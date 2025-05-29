import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Skip TypeScript type checking during build for faster compilation
    // 跳过构建时的TypeScript类型检查以加快编译速度
    target: 'es2020'
  },
  server: {
    proxy: {
      // DashScope API代理 - 解决CORS问题
      '/api': {
        target: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        changeOrigin: true,
        rewrite: (path) => {
          // 保持compatible-mode路径不变，只去掉/api-dashscope前缀
          const newPath = path.replace(/^\/api-dashscope/, '');
          console.log(`代理转发: ${path} -> ${newPath}`);
          return newPath;
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`代理请求: ${req.method} ${req.url}`);
            console.log(`转发到: ${options.target}${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`代理响应: ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
          });
          proxy.on('error', (err, req, res) => {
            console.error('代理错误:', err);
          });
        }
      }
    }
  }
})
