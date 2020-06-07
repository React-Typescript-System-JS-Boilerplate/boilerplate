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
    'npm:': './packages/',
  },
  map: {
    // ts is required to be able to use tsconfig: true in typescriptOptions
    'ts': 'npm:plugin-typescript/lib/plugin.js',
    // typescript is required to compile
    'typescript': 'npm:typescript/lib/typescript.js',




    'react': 'npm:react',
    'react-dom': 'npm:react-dom',
    'lodash': 'npm:lodash',
    'app': './src',
  },
  packages: {
    app: {
      main: './main.tsx',
      defaultExtension: false,
    },
  },
});
