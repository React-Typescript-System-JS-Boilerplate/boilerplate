System.config({
  transpiler: 'ts',
  typescriptOptions: {
    tsconfig: true,
  },
  // meta: with typescript and exports ts is required to use tsconfig: true
  meta: {
    typescript: {
      exports: 'ts',
    },
  },
  paths: {
    'npm:': 'https://unpkg.com/',
    'packages:': './packages/',
  },
  map: {
    // ts is required to be able to use tsconfig: true in typescriptOptions
    'ts': 'npm:plugin-typescript@7.1.0/lib/plugin.js',
    // typescript is required to compile
    'typescript': 'npm:typescript@2.4.2/lib/typescript.js',


    // 'object-assign':'packages:object-assign/index.js',
    // 'prop-types/checkPropTypes':'packages:prop-types/checkPropTypes.js',

    // 'prop-types/lib/ReactPropTypesSecret':'packages:prop-types/lib/ReactPropTypesSecret.js',
    // 'prop-types/lib/has':'packages:prop-types/lib/has.js',

    
    // 'react': 'packages:react/cjs/react.development.js',
    // 'react-dom': 'npm:react-dom@15.6.2/dist/react-dom.js',

    'react': 'npm:react@15.6.2/dist/react.js',
    'react-dom': 'npm:react-dom@15.6.2/dist/react-dom.js',

    'lodash': 'packages:lodash/lodash.js',
    'moment': 'packages:moment/moment.js',
    'app': './src',
  },
  packages: {
    app: {
      main: './main.tsx',
      defaultExtension: false,
    },
  },
});
