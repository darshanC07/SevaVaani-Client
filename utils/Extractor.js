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
    const answer = await predictAnswer("update name to robin", "what is the name?")
    console.log("predicted answer : ", answer)
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

const wordpieceTokenize = (word) => {
    if (vocab[word] !== undefined) return [word];

    let tokens = [];
    let start = 0;

    while (start < word.length) {
        let end = word.length;
        let found = null;

        while (start < end) {
            let subword = word.slice(start, end);
            if (start > 0) subword = "##" + subword;

            if (vocab[subword] !== undefined) {
                found = subword;
                break;
            }
            end--;
        }

        if (!found) return ["[UNK]"];

        tokens.push(found);
        start = end;
    }

    return tokens;
};


const tokenize = (question, context) => {
    question = question.toLowerCase();
    context = context.toLowerCase();

    let tokens = ["[CLS]"];

    question.split(/\s+/).forEach(word => {
        tokens.push(...wordpieceTokenize(word));
    });

    tokens.push("[SEP]");

    context.split(/\s+/).forEach(word => {
        tokens.push(...wordpieceTokenize(word));
    });

    tokens.push("[SEP]");

    let inputIds = tokens.map(t => vocab[t] ?? vocab["[UNK]"]);
    let attentionMask = inputIds.map(() => 1);

    if (inputIds.length > MAX_LEN) {
        inputIds = inputIds.slice(0, MAX_LEN);
        attentionMask = attentionMask.slice(0, MAX_LEN);
    }

    while (inputIds.length < MAX_LEN) {
        inputIds.push(vocab["[PAD]"] ?? 0);
        attentionMask.push(0);
    }

    return { inputIds, attentionMask };
};


export const predictAnswer = async (question, context) => {

    if (!model) throw new Error("Model not loaded");
    if (!vocabLoaded) throw new Error("Vocab not loaded");

    const { inputIds, attentionMask } = tokenize(question, context);

    const inputTensor = tf.tensor([inputIds], [1, MAX_LEN], 'int32');
    const maskTensor = tf.tensor([attentionMask], [1, MAX_LEN], 'int32');

    const outputs = await model.execute({
        "inputs": inputTensor,
        "inputs_1": maskTensor
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

    tf.dispose([inputTensor, maskTensor, outputs]);
    console.log("startIndex:", startIndex);
    console.log("endIndex:", endIndex);
    console.log("start token:", idToToken[inputIds[startIndex]]);
    console.log("end token:", idToToken[inputIds[endIndex]]);
    return answer;
};