const typescriptParser = require('@typescript-eslint/parser');
const eslintPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['mqtt-service/**/*.js'], 
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      // Reglas generales
      'no-console': 'warn', // Advertencia para `console.log`
      'no-unused-vars': 'warn', // Advertencia para variables no usadas

      // Estilo de código
      'indent': ['error', 2], // Indentación de 2 espacios
      'semi': ['error', 'always'], // Requiere punto y coma al final de las líneas

      // Buenas prácticas
      'curly': 'error', // Requiere llaves para todas las declaraciones de control (if, else, etc.)
      'prefer-const': 'error', // Sugiere `const` en lugar de `let` para variables no reasignadas

      // Reglas específicas para TypeScript (si usas TypeScript)
      //'@typescript-eslint/no-unused-vars': ['warn'], // Advertencia para variables no usadas en TypeScript
      //'@typescript-eslint/explicit-function-return-type': 'off', // Desactiva requerir tipo explícito de retorno en funciones
      //'@typescript-eslint/no-explicit-any': 'warn', // Advertencia para el uso de `any`

      // Prettier
      'prettier/prettier': ['error'], // Integra Prettier como regla de ESLint
    },
  },
];
