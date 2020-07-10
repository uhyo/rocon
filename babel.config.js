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
      "@babel/preset-typescript",
    ],
  };
};
