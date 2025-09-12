import path from 'path';
import fs from 'fs';

// ✅ 缓存：目录 -> lint配置的路径
const eslintConfigMapPathCache = new Map();

function findPackageDir(filePath) {
  if (eslintConfigMapPathCache.has(filePath)) {
    return eslintConfigMapPathCache.get(filePath);
  }

  let currentDir = path.dirname(filePath);
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    const configPath = path.join(currentDir, 'eslint.config.js');
    if (fs.existsSync(configPath)) {
      eslintConfigMapPathCache.set(filePath, { dir: currentDir, configPath });
      return { dir: currentDir, configPath };
    }
    currentDir = path.dirname(currentDir);
  }

  // 缓存“未找到”的结果
  eslintConfigMapPathCache.set(filePath, null);
  return null;
}

export default {
  '*.{js?(x),ts?(x),vue,json}': [
    'pnpm format',
    (files) => {
      console.log('🔍 自动搜索与该文件对应的项目的ESLint配置文件');
      // console.log('📏 Running ESLint on files:', files);

      // ✅ 按 eslint 配置文件路径分组需要 lint 的文件
      const grouped = new Map();

      files.forEach((file) => {
        const absolutePath = path.resolve(file);
        const { configPath } = findPackageDir(absolutePath) ?? {};

        const groupKey = configPath || 'root';
        if (!grouped.has(groupKey)) {
          grouped.set(groupKey, {
            configPath: configPath || './eslint.config.js',
            files: [],
          });
        }
        grouped.get(groupKey).files.push(absolutePath);
      });

      // ✅ 为每组生成一个 eslint 命令（批量处理）
      const commands = [];
      for (const { configPath, files } of grouped.values()) {
        const fileArgs = files.map((f) => `"${f}"`).join(' ');
        commands.push(`npx eslint --no-cache --config ${configPath} --fix ${fileArgs}`);
      }

      // console.log('🛠 ESLint commands to run:', commands);
      return commands;
    },
  ],

  '*.{html,css,less,scss}': 'pnpm format',
};
