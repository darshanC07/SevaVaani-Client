import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import metadata from '../assets/model/metadata.json';

const modelJson = require('../assets/model/model.json');
const modelWeights = require('../assets/model/weights.bin');

let model = null;

export const initModel = async () => {
  if (model) return;
  await tf.ready();
  // bundleResourceIO handles the complex file loading for mobile
  model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
  console.log("Model Loaded Successfully");
};

const tokenize = (text) => {
  const { vocab, maxLen } = metadata;
  let sequence = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/)
    .map(word => vocab.indexOf(word))
    .map(id => id === -1 ? 1 : id); 

  while (sequence.length < maxLen) sequence.push(0);
  return sequence.slice(0, maxLen);
};

export const predictIntent = (text) => {
  if (!model) return { intent: 'loading', confidence: 0 };

  const tokens = tokenize(text);
  const inputTensor = tf.tensor2d([tokens]);
  const prediction = model.predict(inputTensor);
  
  const scores = prediction.dataSync();
  const maxScoreIndex = prediction.argMax(1).dataSync()[0];
  
  return {
    intent: metadata.labelMap[maxScoreIndex],
    confidence: scores[maxScoreIndex]
  };
};