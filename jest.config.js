module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Para TypeScript
    '^.+\\.(js|jsx|tsx)$': 'babel-jest', // Para JavaScript y JSX
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!react|react-dom|some-library-you-need-to-transform)/', // Incluir react y react-dom si es necesario
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],  // Para ECMAScript Modules (si es necesario)
  moduleNameMapper: {
    // Aquí resolvemos el alias '@' a la ruta correspondiente en el proyecto
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
