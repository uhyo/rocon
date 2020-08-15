module.exports = (api) => {
  const isTest = api.env("test");

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current",
          },
          modules: isTest ? "auto" : false,
        },
      ],
      [
        "@babel/preset-typescript",
        {
          allowDeclareFields: true,
        },
      ],
      ["@babel/preset-react"],
    ],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-export-namespace-from",
      [
        "@babel/plugin-transform-runtime",
        {
          useESModules: !isTest,
        },
      ],
    ],
  };
};
