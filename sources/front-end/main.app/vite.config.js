import { paraglide } from '@inlang/paraglide-sveltekit/vite'
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import dns from 'node:dns';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  plugins: [
    // mkcert({
    //   savePath: './.cert',
    //   force: true,
    //   keyFileName: 'key.pem',
    //   certFileName: 'cert.pem',
    // }),
    paraglide({ project: './project.inlang', outdir: './src/lib/paraglide' }),
    sveltekit()
  ],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       chunkFileNames: (file) => {
  //         console.debug(`build.rollupOptions.output.chunkFileNames(${file})`);

  //         return file;
  //       },
  //     },
  //   },
  // },
  worker: {
    format: 'es',
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  server: {
    // strictPort: true,
    // https: {
    //   key: fs.readFileSync('./.cert/key.pem'),
    //   cert: fs.readFileSync('./.cert/cert.pem'),
    //   ca: fs.readFileSync('./.cert/rootCA.pem'),
    // },
    fs: {
      allow: ['..'],
    }
  },
});
