import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
// import { File, Paths } from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

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
    console.log("loading model")
    if (model) {
        console.log("model already initialized")
        return;
    }

    await tf.ready();
    await tf.setBackend('rn-webgl');
    model = await tf.loadGraphModel(
        bundleResourceIO(modelJson, modelWeights)
    );
    console.log("model inputs :", model.inputs)
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
        vocab[clean] = index;
        idToToken[index] = clean;
    });

    vocabLoaded = true;
    console.log("Vocab Loaded");
};
const wordpieceTokenize = (token) => {
    if (vocab[token] !== undefined) {
        return [token];
    }

    const chars = token.split("");
    let start = 0;
    const subTokens = [];

    while (start < chars.length) {
        let end = chars.length;
        let found = null;

        while (start < end) {
            let substr = chars.slice(start, end).join("");
            if (start > 0) {
                substr = "##" + substr;
            }

            if (vocab[substr] !== undefined) {
                found = substr;
                break;
            }
            end -= 1;
        }

        if (found === null) {
            return ["[UNK]"];
        }

        subTokens.push(found);
        start = end;
    }

    return subTokens;
};

const basicTokenize = (text) => {
    text = text.toLowerCase();

    // Separate punctuation
    text = text.replace(/([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, " $1 ");

    // Remove extra spaces
    text = text.replace(/\s+/g, " ").trim();

    return text.length ? text.split(" ") : [];
};

export const encode = (question, context) => {
    if (!vocabLoaded) {
        throw new Error("Vocab not loaded");
    }

    const qTokens = basicTokenize(question);
    const cTokens = basicTokenize(context);

    let tokens = [];
    let tokenTypeIds = [];

    // [CLS]
    tokens.push("[CLS]");
    tokenTypeIds.push(0);

    // Question
    qTokens.forEach(word => {
        const wp = wordpieceTokenize(word);
        wp.forEach(sub => {
            tokens.push(sub);
            tokenTypeIds.push(0);
        });
    });

    // [SEP]
    tokens.push("[SEP]");
    tokenTypeIds.push(0);

    // Context
    cTokens.forEach(word => {
        const wp = wordpieceTokenize(word);
        wp.forEach(sub => {
            tokens.push(sub);
            tokenTypeIds.push(1);
        });
    });

    // [SEP]
    tokens.push("[SEP]");
    tokenTypeIds.push(1);

    // Convert to IDs
    let inputIds = tokens.map(t => vocab[t] ?? vocab["[UNK]"]);
    let attentionMask = inputIds.map(() => 1);

    if (inputIds.length > MAX_LEN) {
        inputIds = inputIds.slice(0, MAX_LEN);
        attentionMask = attentionMask.slice(0, MAX_LEN);
        tokenTypeIds = tokenTypeIds.slice(0, MAX_LEN);
    }

    while (inputIds.length < MAX_LEN) {
        inputIds.push(vocab["[PAD]"]);
        attentionMask.push(0);
        tokenTypeIds.push(0);
    }

    return { inputIds, attentionMask, tokenTypeIds, tokens };
};

export const predictAnswer = async (question, context) => {

    if (!model) throw new Error("Model not loaded");
    if (!vocabLoaded) throw new Error("Vocab not loaded");
    // const { inputIds, attentionMask, tokenTypeIds } = tokenize(question, context);
    const { inputIds, attentionMask, tokenTypeIds } =
        encode(question, context);

    const inputTensor = tf.tensor([inputIds], [1, MAX_LEN], 'int32');
    const maskTensor = tf.tensor([attentionMask], [1, MAX_LEN], 'int32');
    const tokenTypeTensor = tf.tensor([tokenTypeIds], [1, MAX_LEN], 'int32');

    const outputs = await model.execute({
        inputs: inputTensor,
        inputs_1: maskTensor,
        inputs_2: tokenTypeTensor
    });

    const startLogits = outputs[0].dataSync();
    const endLogits = outputs[1].dataSync();

    const startIndex = startLogits.indexOf(Math.max(...startLogits));
    let endIndex = endLogits.indexOf(Math.max(...endLogits));

    if (endIndex < startIndex) endIndex = startIndex;

    const answerTokenIds = inputIds.slice(startIndex, endIndex + 1);

    let answer = answerTokenIds
        .map(id => idToToken[id])
        .join(" ")
        .replace(/ ##/g, "")
        .replace(/\[CLS\]|\[SEP\]|\[PAD\]/g, "")
        .trim();

    tf.dispose([inputTensor, maskTensor, tokenTypeTensor, outputs]);
    console.log("startIndex:", startIndex);
    console.log("endIndex:", endIndex);
    console.log("start token:", idToToken[inputIds[startIndex]]);
    console.log("end token:", idToToken[inputIds[endIndex]]);
    return answer;
};