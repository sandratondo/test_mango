module.exports = {
    parser: '@typescript-eslint/parser',  // Usamos el parser de TypeScript
    parserOptions: {
      ecmaVersion: 2020,  // Soporta características de ECMAScript 2020
      sourceType: 'module',  // Habilita los módulos
    },
    extends: [
      'eslint:recommended',  // Reglas recomendadas de ESLint
      'plugin:react/recommended',  // Reglas recomendadas para React
      'plugin:@typescript-eslint/recommended',  // Reglas recomendadas para TypeScript
      'prettier',  // Desactiva las reglas de ESLint que pueden entrar en conflicto con Prettier
    ],
    plugins: ['react', '@typescript-eslint', 'prettier'],  // Plugins de ESLint
    rules: {
      'prettier/prettier': 'error',  // Activa la regla de Prettier como error
      'react/prop-types': 'off',  // Desactiva la regla de Prop-Types (no la necesitamos con TypeScript)
      '@typescript-eslint/no-explicit-any': 'warn',  // Advierte cuando se usa el tipo 'any'
    },
    settings: {
      react: {
        version: 'detect',  // Detecta la versión de React automáticamente
      },
    },
  };
  