# Unique BibTeX

[English](#english) | [中文](#中文)

---

## English

A VSCode extension for detecting duplicate and similar entries in BibTeX files.

### Features

- **Real-time Detection**: Automatically detects exact duplicate entries (based on title)
- **Similarity Detection**: Manually triggered, detects similar entries (default threshold 90%)

### Installation

Search for "Unique BibTeX" in VSCode Extensions Marketplace, or install from VSIX file.

### Usage

1. Open a `.bib` file, the extension activates automatically
2. Duplicate entries are highlighted with warnings in the editor
3. Press `F1` and type `Unique BibTeX: Check Similar Entries` to run similarity detection

### Screenshots

When duplicates are found, warnings appear on the duplicate entry with a reference to the first occurrence:

```
Entry foo2024 has same title as "bar2024" (line 15)
```

For similar entries:

```
Entry foo2024 is similar to "bar2024" 92.5% (line 15)
```

### Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `uniqueBib.similarityThreshold` | `0.9` | Similarity threshold for detecting similar entries (0.5-1.0) |

Example in `settings.json`:

```json
{
  "uniqueBib.similarityThreshold": 0.85
}
```

---

## 中文

一个 VSCode 扩展，用于检测 BibTeX 文件中的重复和相似条目。

### 功能

- **实时检测**：自动检测完全重复的条目（基于标题）
- **相似度检测**：手动触发，检测相似条目（默认阈值 90%）

### 安装

在 VSCode 扩展商店搜索 "Unique BibTeX"，或从 VSIX 文件安装。

### 使用方法

1. 打开 `.bib` 文件，扩展自动激活
2. 重复条目会以警告形式显示在编辑器中
3. 按 `F1` 输入 `Unique BibTeX: 检测相似条目` 执行相似度检测

### 效果示例

发现重复时，警告会显示在重复条目上，并指向首次出现的位置：

```
条目 foo2024 与 "bar2024" 标题相同 (第 15 行)
```

相似条目：

```
条目 foo2024 与 "bar2024" 标题相似 92.5% (第 15 行)
```

### 配置

| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| `uniqueBib.similarityThreshold` | `0.9` | 相似度检测阈值 (0.5-1.0) |

在 `settings.json` 中配置：

```json
{
  "uniqueBib.similarityThreshold": 0.85
}
```

---

## Development

### Install Dependencies

```bash
npm install
```

### Compile

```bash
npm run compile
```

### Debug

1. Open the project in VSCode
2. Press `F5` to start debugging
3. Test with a `.bib` file in the Extension Development Host window

### Watch Mode

```bash
npm run watch
```

### Project Structure

```
src/
├── extension.ts    # Extension entry point
├── bibParser.ts    # BibTeX parser
└── similarity.ts   # Similarity calculation
```

## License

MIT
