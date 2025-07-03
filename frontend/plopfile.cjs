const pathObject = {
  1: "./src/components/inputs/",
  2: "./src/components/layouts/",
  3: "./src/pages/",
};
const componentGenerator = {
  description: "Create a new component",
  prompts: [
    {
      type: "input",
      name: "type",
      message: "1. Form Component,  2. Layout Component, 3. Page Component.?",
    },
    {
      type: "input",
      name: "name",
      message: "Component name?",
    },
  ],
  actions: ({ type }) => {
    const actions = [
      {
        type: "add",
        path: `${pathObject[type]}{{name}}/{{name}}.jsx`,
        templateFile: "plop-templates/Component.js.hbs",
      },
      {
        type: "add",
        path: `${pathObject[type]}{{name}}/{{name}}.scss`,
        templateFile: "plop-templates/Component.scss.hbs",
      },
      {
        type: "add",
        path: `${pathObject[type]}{{name}}/index.js`,
        templateFile: "plop-templates/index.js.hbs",
      },
    ];
    return actions;
  },
};

const lowerCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.toLowerCase();
  });
};

module.exports = (plop) => {
  plop.setGenerator("component", componentGenerator);
  plop.setHelper("lowerCase", lowerCase);
};
