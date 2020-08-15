// eslint-disable-next-line no-undef
exports.getBabelConfig = (isTest, esm) => {
  const useESModules = !isTest && esm;
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "12",
            ios: "12",
          },
          modules: !useESModules ? "auto" : false,
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
          useESModules,
        },
      ],
    ],
  };
};
