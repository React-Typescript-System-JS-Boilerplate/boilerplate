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
  },
  map: {
    // ts is required to be able to use tsconfig: true in typescriptOptions
    'ts': 'npm:plugin-typescript@7.1.0/lib/plugin.js',
    // typescript is required to compile
    'typescript': 'npm:typescript@2.4.2/lib/typescript.js',




    'react': 'npm:react@15.6.2/dist/react.js',
    'react-dom': 'npm:react-dom@15.6.2/dist/react-dom.js',
    'lodash': 'npm:lodash@4.17.10/index.js',
    'app': './src',
  },
  packages: {
    app: {
      main: './main.tsx',
      defaultExtension: false,
    },
  },
});
