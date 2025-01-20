module.exports = {
    presets: [
      [
        "@babel/preset-react",
        {
          runtime: "automatic", // Habilita el nuevo runtime de React
        },
      ],
      "@babel/preset-env",
      "@babel/preset-typescript",
    ],
  };
  