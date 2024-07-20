export const CompilerConfig = Object.freeze({
  compileTo: ['ts'],
  outputRootDir: './generated',
  rootFile: './schema/Message.fbs',
  languages: {
    ts: {
      generatorOptions: [
        '--natural-utf8',
        '--gen-all',
        '--warnings-as-errors',
      ],
      preProcess: null,
      postProcess: (await import(new URL('../.processors/ts/postProcess.mjs', import.meta.url))).postProcess,
    },
  },
});