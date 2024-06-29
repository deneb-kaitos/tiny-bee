import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// import {
//   PUBLIC_WS_PROTO,
//   PUBLIC_WS_HOST,
//   PUBLIC_WS_PORT,
//
//   PUBLIC_WEB_PROTO,
//   PUBLIC_WEB_HOST,
//   PUBLIC_WEB_PORT,
//   PUBLIC_WEB_DEBUG_PORT,
// } from '$env/static/public';
//

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess()],
  compilerOptions: {
    runes: true,
  },
	kit: {
		adapter: adapter({
      out: 'build',
      precompress: false,
      envPrefix: '',
    }),
    serviceWorker: {
      register: true,
    },
    files: {
      lib: 'src/lib',
      hooks: {
        server: 'src/files/hooks/hooks.server.js',
      },
      serviceWorker: 'src/lib/service-worker/index.js'
    },
    // csp: {
    //   directives: {
    //     'default-src': ['none'],
    //     'img-src': ['self'],
    //     'font-src': ['self'],
    //     'manifest-src': ['self'],
    //     'style-src': ['self', 'unsafe-inline'],
    //     'script-src': ['self', 'unsafe-inline'],
    //     // 'connect-src': [
    //     //   'self',
    //     //   // svelte front-end
    //     //   `${PUBLIC_WEB_PROTO}://${PUBLIC_WEB_HOST}:${PUBLIC_WEB_PORT}`,
    //     //   // svelte dev server's port
    //     //   `${PUBLIC_WS_PROTO}://${PUBLIC_WEB_HOST}:${PUBLIC_WEB_DEBUG_PORT}`,
    //     //   // API port
    //     //   `${PUBLIC_WS_PROTO}://${PUBLIC_WS_HOST}:${PUBLIC_WS_PORT}`,
    //     // ],
    //
    //   },
    //   reportOnly: {},
    // },
    env: {
      dir: './environments',
    },
	},
};

export default config;
