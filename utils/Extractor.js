import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

// import { File, Paths } from 'expo-file-system';

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

const modelJson = require('../assets/ie_model/model.json');

const modelWeights = [
    require("../assets/ie_model/group1-shard1of63.bin"),
    require("../assets/ie_model/group1-shard2of63.bin"),
    require("../assets/ie_model/group1-shard3of63.bin"),
    require("../assets/ie_model/group1-shard4of63.bin"),
    require("../assets/ie_model/group1-shard5of63.bin"),
    require("../assets/ie_model/group1-shard6of63.bin"),
    require("../assets/ie_model/group1-shard7of63.bin"),
    require("../assets/ie_model/group1-shard8of63.bin"),
    require("../assets/ie_model/group1-shard9of63.bin"),
    require("../assets/ie_model/group1-shard10of63.bin"),
    require("../assets/ie_model/group1-shard11of63.bin"),
    require("../assets/ie_model/group1-shard12of63.bin"),
    require("../assets/ie_model/group1-shard13of63.bin"),
    require("../assets/ie_model/group1-shard14of63.bin"),
    require("../assets/ie_model/group1-shard15of63.bin"),
    require("../assets/ie_model/group1-shard16of63.bin"),
    require("../assets/ie_model/group1-shard17of63.bin"),
    require("../assets/ie_model/group1-shard18of63.bin"),
    require("../assets/ie_model/group1-shard19of63.bin"),
    require("../assets/ie_model/group1-shard20of63.bin"),
    require("../assets/ie_model/group1-shard21of63.bin"),
    require("../assets/ie_model/group1-shard22of63.bin"),
    require("../assets/ie_model/group1-shard23of63.bin"),
    require("../assets/ie_model/group1-shard24of63.bin"),
    require("../assets/ie_model/group1-shard25of63.bin"),
    require("../assets/ie_model/group1-shard26of63.bin"),
    require("../assets/ie_model/group1-shard27of63.bin"),
    require("../assets/ie_model/group1-shard28of63.bin"),
    require("../assets/ie_model/group1-shard29of63.bin"),
    require("../assets/ie_model/group1-shard30of63.bin"),
    require("../assets/ie_model/group1-shard31of63.bin"),
    require("../assets/ie_model/group1-shard32of63.bin"),
    require("../assets/ie_model/group1-shard33of63.bin"),
    require("../assets/ie_model/group1-shard34of63.bin"),
    require("../assets/ie_model/group1-shard35of63.bin"),
    require("../assets/ie_model/group1-shard36of63.bin"),
    require("../assets/ie_model/group1-shard37of63.bin"),
    require("../assets/ie_model/group1-shard38of63.bin"),
    require("../assets/ie_model/group1-shard39of63.bin"),
    require("../assets/ie_model/group1-shard40of63.bin"),
    require("../assets/ie_model/group1-shard41of63.bin"),
    require("../assets/ie_model/group1-shard42of63.bin"),
    require("../assets/ie_model/group1-shard43of63.bin"),
    require("../assets/ie_model/group1-shard44of63.bin"),
    require("../assets/ie_model/group1-shard45of63.bin"),
    require("../assets/ie_model/group1-shard46of63.bin"),
    require("../assets/ie_model/group1-shard47of63.bin"),
    require("../assets/ie_model/group1-shard48of63.bin"),
    require("../assets/ie_model/group1-shard49of63.bin"),
    require("../assets/ie_model/group1-shard50of63.bin"),
    require("../assets/ie_model/group1-shard51of63.bin"),
    require("../assets/ie_model/group1-shard52of63.bin"),
    require("../assets/ie_model/group1-shard53of63.bin"),
    require("../assets/ie_model/group1-shard54of63.bin"),
    require("../assets/ie_model/group1-shard55of63.bin"),
    require("../assets/ie_model/group1-shard56of63.bin"),
    require("../assets/ie_model/group1-shard57of63.bin"),
    require("../assets/ie_model/group1-shard58of63.bin"),
    require("../assets/ie_model/group1-shard59of63.bin"),
    require("../assets/ie_model/group1-shard60of63.bin"),
    require("../assets/ie_model/group1-shard61of63.bin"),
    require("../assets/ie_model/group1-shard62of63.bin"),
    require("../assets/ie_model/group1-shard63of63.bin")
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

    console.log("QA Model Loaded Successfully");
    const answer = await predictAnswer("what is job title?", "i want to post a job for fixing bathroom taps")
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

    const outputs = await model.executeAsync({
        input_ids: inputTensor,
        attention_mask: maskTensor
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

    return answer;
};