<!-- 安装 eslint 及其插件 -->

pnpm -Dw add eslint@latest @eslint/js globals typescript-eslint eslint-plugin-prettier eslint-config-prettier eslint-plugin-vue

<!-- 安装拼写检查工具 -->

pnpm -Dw add cspell @cspell/dict-lorem-ipsum

<!-- git 提交规范 -->

pnpm -Dw add @commitlint/cli @commitlint/config-conventional commitizen cz-git
