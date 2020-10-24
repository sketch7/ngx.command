module.exports = {
	root: true,
	parserOptions: {
    project: "./tsconfig.json"
  },
	plugins: [
		"@typescript-eslint",
	],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"./node_modules/@ssv/tools/config/angular-recommended.json"
	],
};
