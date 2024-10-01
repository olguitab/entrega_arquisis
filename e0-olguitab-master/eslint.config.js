// eslint.config.js
const typescriptParser = require('@typescript-eslint/parser');
const eslintPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['src/**/*.ts'], // Ajusta la ruta según tu proyecto
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json', // Asegúrate de que esta ruta sea correcta
      },
    },
    plugins: {
      '@typescript-eslint': eslintPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Añade más reglas específicas para NestJS si es necesario
    },
  },
  {
    files: ['mqtt-service/**/*.js'], // Ajusta la ruta según tu proyecto
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      // Añade reglas específicas para JavaScript aquí
    },
  },
];
