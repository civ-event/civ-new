import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useMock = env.VITE_USE_MOCK === 'true';

  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        enable: command === 'serve' && useMock,
        watchFiles: true,
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 5176,
      proxy: {
        '/api': {
          target: 'https://activity-api-test.mars-era.cn',
          changeOrigin: true,
          secure: false,
          // 后台确认路径后再决定是否去掉 /api：
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
