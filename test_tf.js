const tf = require("@tensorflow/tfjs-node");

console.log("TensorFlow.js version:", tf.version.tfjs);
console.log("Backend:", tf.getBackend());
