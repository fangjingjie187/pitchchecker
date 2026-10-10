import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 从 package.json 读取版本号，构建时注入到全局常量，供页脚展示
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as {
  version: string;
};

// base: './' 保证产物可部署到任意静态托管的子路径（GitHub Pages / 静态桶）
export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    // 构建时间戳：dev 为启动时刻，build 为打包时刻，用于页脚区分新旧版本
    __APP_BUILD_TIME__: Date.now(),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
