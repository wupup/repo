<!-- 安装 eslint 及其插件 -->

pnpm -Dw add eslint@latest @eslint/js globals typescript-eslint eslint-plugin-prettier eslint-config-prettier eslint-plugin-vue

<!-- 安装拼写检查工具 -->

pnpm -Dw add cspell @cspell/dict-lorem-ipsum

<!-- git 提交规范 -->

pnpm -Dw add @commitlint/cli @commitlint/config-conventional commitizen cz-git

<!-- 添加git钩子 初始化后在 .husky/pre-commit 中添加狗子钩子命令 -->

pnpm -Dw add husky

pnpx husky init

<!-- 检查暂存区 -->

pnpm -Dw add lint-staged

<!-- 其他lint工具 -->
<!-- antfu/eslint-config -->
<!-- eslint stylistic -->

<!-- 单元测试 vitest -->

pnpm -Dw add vitest @vitest/browser vitest-browser-vue vue

<!-- 版本管理 Rush -->
