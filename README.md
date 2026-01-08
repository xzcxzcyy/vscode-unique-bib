# Unique BibTeX

[English](README.md) | [中文](README.zh-CN.md)

A VSCode extension for detecting duplicate and similar entries in BibTeX files.

## Features

- **Real-time Detection**: Automatically detects exact duplicate entries (based on title)
- **Similarity Detection**: Manually triggered, detects similar entries (default threshold 90%)

## Installation

Search for "Unique BibTeX" in VSCode Extensions Marketplace, or install from VSIX file.

## Usage

1. Open a `.bib` file, the extension activates automatically
2. Duplicate entries are highlighted with warnings in the editor
3. Open Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux) and type `Unique BibTeX: Check Similar Entries` to run similarity detection

## Screenshots

When duplicates are found, warnings appear on the duplicate entry with a reference to the first occurrence:

<img src="figures/smith.png" alt="example" width="700">

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `uniqueBib.similarityThreshold` | `0.9` | Similarity threshold for detecting similar entries (0.5-1.0) |

Example in `settings.json`:

```json
{
  "uniqueBib.similarityThreshold": 0.85
}
```

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
