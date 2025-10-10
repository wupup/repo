export default {
  printWidth: 120, // 换行长度
  tabWidth: 2, // 缩进长度
  singleQuote: true, // 使用单引号
  trailingComma: 'all', // 尾随逗号
  useTabs: false, // 不使用缩进符，而使用空格
  arrowParens: 'avoid', // 箭头函数参数总是有括号
  semi: true, // 句尾添加分号
  quoteProps: 'as-needed', // 对象属性仅在必要时用引号
  jsxSingleQuote: false, // jsx 使用单引号
  jsxBracketSameLine: false, // jsx > 是否另起一行
  bracketSpacing: true, // 对象大括号直接是否有空格
  embeddedLanguageFormatting: 'auto', // 对引用代码进行格式化
  htmlWhitespaceSensitivity: 'css', // 根据显示样式决定 html 空格敏感度
  bracketSameLine: false, // 多行 HTML、JSX 或 Vue 时，> 是否另起一行
  requirePragma: false, // 不需要顶部注释来格式化文件
  proseWrap: 'preserve', // 保留 markdown 文件中的换行
  endOfLine: 'auto', // 换行符使用系统默认
  vueIndentScriptAndStyle: false, // Vue 文件中的 script 和 style 标签缩进
  rangeStart: 0, // 每个文件格式化的范围是从头开始
  rangeEnd: Infinity, // 每个文件格式化的范围是到文件末尾
};
