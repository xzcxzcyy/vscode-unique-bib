# Examples

This folder contains sample BibTeX files for testing and demonstration purposes.

## sample.bib

A sample BibTeX file containing:

- **Exact duplicates**: `smith2020deep` and `jones2021deep` have identical titles
- **Similar entries**: `davis2020deep` has a similar title (adds ": A Survey")
- **Unique entry**: Other entries are unique

### Expected Results

When you open `sample.bib` in VSCode:

1. **Real-time detection** will mark `jones2021deep` as an exact duplicate of `smith2020deep`
2. Run **similarity detection** (`Cmd+Shift+P` → `Unique BibTeX: Check Similar Entries`) to find that `davis2020deep` is similar to `smith2020deep`

Use this file to take screenshots for documentation.
