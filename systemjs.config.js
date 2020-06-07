System.config({
  transpiler: 'ts',
  defaultJSExtensions: true,
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
    // 'ts': 'npm:plugin-typescript@7.1.0/lib/plugin.js',
    'ts': 'packages:plugin-typescript/lib/plugin.js',
    // typescript is required to compile
    // 'typescript': 'npm:typescript@2.4.2/lib/typescript.js',
    'typescript': 'packages:typescript/lib/typescript.js',
    
    'react': 'packages:react/umd/react.development.js',
    'react-dom': 'packages:react-dom/umd/react-dom.development.js',

    // 'react': 'npm:react@15.6.2/dist/react.js',
    // 'react-dom': 'npm:react-dom@15.6.2/dist/react-dom.js',

    'lodash': 'packages:lodash/lodash.js',
    'moment': 'packages:moment/moment.js',
    'app': './src',
  },
  packages: {
    app: {
      main: './main.tsx',
      defaultExtension: false,
    },
    src:{
      defaultExtension:'tsx'
    }
  },
});