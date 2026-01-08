# Unique BibTeX

一个 VSCode 扩展，用于检测 BibTeX 文件中的重复和相似条目。

## 功能

- **实时检测**：自动检测完全重复的条目（基于标题）
- **相似度检测**：手动触发，检测相似条目（默认阈值 90%）

## 使用方法

1. 打开 `.bib` 文件，扩展自动激活
2. 重复条目会以警告形式显示在编辑器中
3. 按 `F1` 输入 `Check Similar BibTeX Entries` 执行相似度检测

## 开发

### 安装依赖

```bash
npm install
```

### 编译

```bash
npm run compile
```

### 调试运行

1. 在 VSCode 中打开项目
2. 按 `F5` 启动调试
3. 在新打开的 Extension Development Host 窗口中打开 `.bib` 文件测试

### 监听模式

```bash
npm run watch
```

## 项目结构

```
src/
├── extension.ts    # 扩展入口
├── bibParser.ts    # BibTeX 解析器
└── similarity.ts   # 相似度计算
```
