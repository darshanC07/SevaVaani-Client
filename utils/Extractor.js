import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert } from 'react-native';

const modelJson = require('../assets/ie_model/model.json');

const modelWeights = [
    require("../assets/ie_model/group1-shard1of14.bin"),
    require("../assets/ie_model/group1-shard2of14.bin"),
    require("../assets/ie_model/group1-shard3of14.bin"),
    require("../assets/ie_model/group1-shard4of14.bin"),
    require("../assets/ie_model/group1-shard5of14.bin"),
    require("../assets/ie_model/group1-shard6of14.bin"),
    require("../assets/ie_model/group1-shard7of14.bin"),
    require("../assets/ie_model/group1-shard8of14.bin"),
    require("../assets/ie_model/group1-shard9of14.bin"),
    require("../assets/ie_model/group1-shard10of14.bin"),
    require("../assets/ie_model/group1-shard11of14.bin"),
    require("../assets/ie_model/group1-shard12of14.bin"),
    require("../assets/ie_model/group1-shard13of14.bin"),
    require("../assets/ie_model/group1-shard14of14.bin")
];

let model = null;
let vocab = {};
let idToToken = {};
let vocabLoaded = false;
const MAX_LEN = 128;

export const initExtractorModel = async () => {
    console.log("loading model");
    if (model) return;

    await tf.ready();
    // Use 'rn-webgl' or 'cpu' depending on device performance
    await tf.setBackend('rn-webgl');
    model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
    console.log("QA Model Loaded Successfully");
};

export const loadVocab = async () => {
    if (vocabLoaded) return;
    const asset = Asset.fromModule(require('../assets/ie_model/vocab.txt'));
    await asset.downloadAsync();
    const fileUri = asset.localUri || asset.uri;
    const vocabText = await FileSystem.readAsStringAsync(fileUri);

    const tokens = vocabText.split('\n');
    tokens.forEach((token, index) => {
        const clean = token.trim();
        if (clean) {
            vocab[clean] = index;
            idToToken[index] = clean;
        }
    });
    vocabLoaded = true;
    console.log("Vocab Loaded");
};

const wordpieceTokenize = (word) => {
    let tokens = [];
    let start = 0;
    while (start < word.length) {
        let end = word.length;
        let curSubword = null;
        while (start < end) {
            let substr = word.substring(start, end);
            if (start > 0) substr = "##" + substr;
            if (vocab.hasOwnProperty(substr)) {
                curSubword = substr;
                break;
            }
            end--;
        }
        if (!curSubword) {
            return ["[UNK]"];
        }
        tokens.push(curSubword);
        start = end;
    }
    return tokens;
};

const basicTokenize = (text) => {
    return text
        .toLowerCase()
        .replace(/([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, " $1 ")
        .split(/\s+/)
        .filter(t => t.length > 0);
};

export const encode = (question, context) => {
    if (!vocabLoaded) throw new Error("Vocab not loaded");

    const qTokens = [];
    basicTokenize(question).forEach(w => qTokens.push(...wordpieceTokenize(w)));

    const cTokens = [];
    basicTokenize(context).forEach(w => cTokens.push(...wordpieceTokenize(w)));

    let tokens = ["[CLS]", ...qTokens, "[SEP]", ...cTokens, "[SEP]"];
    let tokenTypeIds = [
        0, // [CLS]
        ...qTokens.map(() => 0),
        0, // [SEP]
        ...cTokens.map(() => 1),
        1  // [SEP]
    ];

    let inputIds = tokens.map(t => vocab[t] ?? vocab["[UNK]"]);
    let attentionMask = inputIds.map(() => 1);

    // Truncate
    if (inputIds.length > MAX_LEN) {
        inputIds = inputIds.slice(0, MAX_LEN);
        attentionMask = attentionMask.slice(0, MAX_LEN);
        tokenTypeIds = tokenTypeIds.slice(0, MAX_LEN);
    }

    // Pad
    while (inputIds.length < MAX_LEN) {
        inputIds.push(vocab["[PAD]"] || 0);
        attentionMask.push(0);
        tokenTypeIds.push(0);
    }

    console.log("tokens : ", tokens);
    console.log("Token count before padding:", tokens.length);
    return { inputIds, attentionMask, tokenTypeIds, tokens };
};


export async function predictAnswer(question, context) {

    if(!model) return (Alert.alert("Processing","Please wait while we load models"));
    const inputs = encode(question, context);

    const inputTensor = tf.tensor2d([inputs.inputIds], [1, MAX_LEN], "int32");
    const maskTensor = tf.tensor2d([inputs.attentionMask], [1, MAX_LEN], "int32");
    const typeTensor = tf.tensor2d([inputs.tokenTypeIds], [1, MAX_LEN], "int32");

    const outputs = await model.execute({
        inputs: inputTensor,
        inputs_1: maskTensor,
        inputs_2: typeTensor,
    });

    const startTensor = outputs[0];
    const endTensor = outputs[1];

    const startLogits = Array.from(await startTensor.data());
    const endLogits = Array.from(await endTensor.data());

    // 🔥 Joint span scoring (replace simple argmax)
    let bestScore = -Infinity;
    let bestStart = 0;
    let bestEnd = 0;

    for (let i = 0; i < startLogits.length; i++) {
      for (let j = i; j < Math.min(i + 20, endLogits.length); j++) {
        const score = startLogits[i] + endLogits[j];
        if (score > bestScore) {
          bestScore = score;
          bestStart = i;
          bestEnd = j;
        }
      }
    }

    // Use bestStart / bestEnd instead of single argmax
    const answerIds = inputs.inputIds.slice(bestStart, bestEnd + 1);

    // 🔥 Manual decode
    let tokens = answerIds.map(id => idToToken[id] || "");

    tokens = tokens.filter(t => t !== "[CLS]" && t !== "[SEP]" && t !== "[PAD]");

    let answer = "";
    for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (tok.startsWith("##")) {
            answer += tok.replace("##", "");
        } else {
            if (answer.length > 0) answer += " ";
            answer += tok;
        }
    }

    tf.dispose([inputTensor, maskTensor, typeTensor, startTensor, endTensor]);

    return answer.trim();
}