/** @type {import('cz-git').UserConfig} */

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // see: https://commitlint.js.org/#/reference-rules
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'subject-case': [0, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build', // 构建相关的更改，例如发布版本、对构建系统或外部依赖项的更改（例如升级 npm 包）
        'feat', // 新功能
        'fix', // 修复 bug
        'refactor', // 代码重构，既不是修复 bug 也不是添加新功能的代码更改
        'style', // 仅样式更改（不影响代码运行的更改，例如空格、格式化、缺少分号等）
        'test', // 添加缺失的测试或更正现有测试
        'docs', // 仅文档更改
        'perf', // 提升性能的代码更改
        'ci', // 持续集成相关的更改，例如修改 CI 配置文件和脚本
        'chore', // 其他不修改 src 或测试文件的更改
        'revert', // 回滚某个更早的提交
        'wip', // 工作进行中
        'types', // 类型定义文件更改
        'merge', // 分支合并
        'workflow', // 工作流相关的更改，例如 GitHub Actions 工作流文件
        'release', // 发布新版本
        'hotfix', // 紧急修复
        'security', // 安全相关的更改，例如修复安全漏洞
        'i18n', // 国际化相关的更改
        'l10n', // 本地化相关的更改
        'a11y', // 可访问性相关的更改
        'ux', // 用户体验相关的更改
        'infra', // 基础设施相关的更改，例如服务器配置、网络设置等
        'config', // 配置文件更改
        'data', // 数据相关的更改，例如数据库迁移、数据修复等
        'analytics', // 分析相关的更改，例如添加或修改分析工具
        'demo', // 示例相关的更改，例如添加或修改示例代码
        'example', // 示例相关的更改，例如添加或修改示例代码
        'mock', // 模拟数据相关的更改，例如添加或修改模拟数据
        'script', // 脚本相关的更改，例如添加或修改构建脚本、部署脚本等
        'generator', // 代码生成器相关的更改，例如添加或修改代码生成器
        'translation', // 翻译相关的更改
      ],
    ],
  },
  prompt: {
    alias: { fd: 'docs:fix' },
    types: [
      {
        value: 'build',
        name: 'build:     🔗 构建相关的更改，例如发布版本、对构建系统或外部依赖项的更改（例如升级 npm 包）',
      },
      { value: 'feat', name: 'feat:      ⭐ 新功能' },
      { value: 'fix', name: 'fix:       🐛 修复 bug' },
      { value: 'perf', name: 'perf:      🚀 提升性能的代码更改' },
      { value: 'docs', name: 'docs:      📃 仅文档更改' },
      { value: 'style', name: 'style:     🎨 仅样式更改（不影响代码运行的更改，例如空格、格式化、缺少分号等）' },
      { value: 'test', name: 'test:      💉 添加缺失的测试或更正现有测试' },
      { value: 'chore', name: 'chore:     🔧 其他不修改 src 或测试文件的更改' },
      { value: 'refactor', name: 'refactor:  📦 代码重构，既不是修复 bug 也不是添加新功能的代码更改' },
      { value: 'revert', name: 'revert:    🔙 回滚某个更早的提交' },
      { value: 'types', name: 'types:     🎭 类型定义文件更改' },
      { value: 'config', name: 'config:    🔩 配置文件更改' },
      { value: 'release', name: 'release:   🍎 发布新版本' },
      // { value: 'hotfix', name: 'hotfix:    紧急修复' },
      // { value: 'ci', name: 'ci:        持续集成相关的更改，例如修改 CI 配置文件和脚本' },
      // { value: 'i18n', name: 'i18n:      国际化相关的更改' },
      // { value: 'l10n', name: 'l10n:      本地化相关的更改' },
      // { value: 'wip', name: 'wip:       工作进行中' },
      // { value: 'workflow', name: 'workflow:  工作流相关的更改，例如 GitHub Actions 工作流文件' },
      // { value: 'security', name: 'security:  安全相关的更改，例如修复安全漏洞' },
      // { value: 'a11y', name: 'a11y:      可访问性相关的更改' },
      // { value: 'ux', name: 'ux:        用户体验相关的更改' },
      // { value: 'infra', name: 'infra:     基础设施相关的更改，例如服务器配置、网络设置等' },
      // { value: 'data', name: 'data:      数据相关的更改，例如数据库迁移、数据修复等' },
      // { value: 'analytics', name: 'analytics: 分析相关的更改，例如添加或修改分析工具' },
      // { value: 'demo', name: 'demo:      示例相关的更改，例如添加或修改示例代码' },
    ],
    scopes: [
      { name: 'root' },
      { name: 'apps' },
      { name: 'components' },
      { name: 'utils' },
      { name: 'utils-web' },
      { name: 'styles' },
      { name: 'docs' },
      { name: 'tests' },
      { name: 'config' },
      { name: 'scripts' },
      { name: 'types' },
    ],
    messages: {
      type: '📌 选择你要提交的更改类型:',
      scope: '🎯 选择一个提交范围 (可选):',
      // customScope: '请输入自定义的提交范围:',
      subject: '🔍 请简要描述提交 (必填):',
      body: '✍ 请输入详细描述 (可选). 使用 "|" 换行:',
      // breaking: '列出任何重大更改 (可选):',
      footer: '🔗 列出任何关闭的 issue 例如: #31, #34 (可选):',
      confirmCommit: '✅ 你确定要继续执行提交吗?',
    },
    skipQuestions: ['body', 'footer', 'footerPrefix', 'breaking'],
    useEmoji: true,
    emojiAlign: 'center',
    themeColorCode: '',
    allowCustomScopes: false,
    allowEmptyScopes: false,
    customScopesAlign: 'bottom',
    emptyScopesAlign: 'bottom',
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    issuePrefixes: ['#'],
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlign: 'bottom',
    confirmColorize: true,
    maxHeaderLength: 108,
    maxSubjectLength: 100,
  },
};
