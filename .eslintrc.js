module.exports = {
  root: true,
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-param-reassign': [2, { props: false }],
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-nested-ternary': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'no-useless-escape': 'off',
    'no-shadow': 'off',
    'class-methods-use-this': 'off',
    'no-lonely-if': 'off',
    'max-classes-per-file': 'off',
    'prefer-destructuring': 'off',
    'no-param-reassign': 'off',
    "no-extend-native": "off",
    'dot-notation': 'off',
    'radix': 'off',
    'consistent-return': 'off'

  },
  parser: "babel-eslint",
};
