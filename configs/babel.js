// eslint-disable-next-line no-undef
exports.getBabelConfig = (isTest, esm) => {
  const useESModules = !isTest && esm;
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current",
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
