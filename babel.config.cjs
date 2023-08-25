module.exports = {
  presets: ['module:metro-react-native-babel-preset', '@babel/preset-env', '@babel/preset-react', {
    targets: {
      node: 'current'
    }
  }],
  // presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
