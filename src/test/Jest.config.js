module.exports = {
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest'
    },
    testMatch: [
      '**/__tests__/**/*.[jt]s?(x)',
      '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    moduleFileExtensions: [
      'js',
      'jsx',
      'ts',
      'tsx',
      'json',
      'node'
    ],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    }
  };
  