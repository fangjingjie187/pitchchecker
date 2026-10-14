import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * 供 tsx 直跑脚本（validate / review / sample / psychometrics）时补齐构建期注入的全局常量。
 *
 * src/config/app.config.ts 引用了 __APP_VERSION__ / __APP_BUILD_TIME__，它们由
 * vite.config.ts / vitest.config.ts 的 `define` 在构建/测试时替换。但 `tsx` 直接运行
 * 脚本不走 vite 的 define，两个裸标识符不存在 → import app.config 的模块顶层求值会
 * ReferenceError。本模块在 import 时把它们挂到 globalThis，使后续模块求值可用。
 */
const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf-8'),
) as { version: string };

(globalThis as Record<string, unknown>).__APP_VERSION__ = pkg.version;
(globalThis as Record<string, unknown>).__APP_BUILD_TIME__ = 0;
