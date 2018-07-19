module.exports = {
  "extends": "eslint:recommended",
  "env": {
    "es6": true,
    "node": true
  },
  "globals": {
    "__dirname": true,
    "module": true,
    "process": true,
    "require": true
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2018
  },
  "settings": {
    "import/resolver": {
      webpack: {
        config: {
          resolve: require("./webpack.config.js").resolve
        }
      }
    }
  },
  "rules": {
    "no-mixed-operators": 2,
    "no-return-assign": 2,
    "no-self-compare": 2,
    "no-undef": 2,
    "no-unused-vars": 2,
    "no-useless-constructor": 2,
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx"
        ]
      }
    },
    "arrow-parens": [
      "error",
      "always"
    ],
    "arrow-spacing": [
      "error",
      {
        "after": true,
        "before": true
      }
    ],
    "comma-dangle": [
      "error",
      {
        "arrays": "always-multiline",
        "exports": "never",
        "functions": "ignore",
        "imports": "never",
        "objects": "always-multiline"
      }
    ],
    "comma-style": [
      "error",
      "last"
    ],
    "import/default": [
      "error"
    ],
    "import/no-unresolved": [
      "error",
      {
        "amd": true,
        "commonjs": true
      }
    ],
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1
      }
    ],
    "key-spacing": [
      "error",
      {
        "afterColon": true,
        "beforeColon": false
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "multiline-ternary": [
      "error",
      "always-multiline"
    ],
    "no-console": [
      "off"
    ],
    "no-multi-spaces": [
      2
    ],
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1,
        "maxBOF": 0,
        "maxEOF": 0
      }
    ],
    "object-property-newline": [
      "error",
      {
        "allowAllPropertiesOnSameLine": true
      }
    ],
    "quotes": [
      "error",
      "double",
      {
        "allowTemplateLiterals": true
      }
    ],
    "semi": [
      "error",
      "always"
    ],
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "asyncArrow": "always",
        "named": "never"
      }
    ]
  },
  "plugins": [
    "import"
  ]
}