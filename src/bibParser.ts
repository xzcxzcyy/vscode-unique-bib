/**
 * BibTeX 条目的数据结构
 */
export interface BibEntry {
    type: string;        // 条目类型，如 article, book, inproceedings
    key: string;         // 引用键，如 @article{smith2020, ...} 中的 smith2020
    title: string;       // 文章标题
    startLine: number;   // 条目在文件中的起始行号
    endLine: number;     // 条目在文件中的结束行号
    titleLine: number;   // title 字段所在的行号
}

/**
 * 解析 BibTeX 文件内容，提取所有条目
 */
export function parseBibTeX(content: string): BibEntry[] {
    const entries: BibEntry[] = [];
    const lines = content.split('\n');

    // 匹配条目开始: @type{key,
    const entryStartRegex = /^@(\w+)\s*\{\s*([^,\s]+)\s*,/i;

    let currentEntry: Partial<BibEntry> | null = null;
    let braceCount = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 检查是否是新条目的开始
        const startMatch = line.match(entryStartRegex);
        if (startMatch && braceCount === 0) {
            currentEntry = {
                type: startMatch[1].toLowerCase(),
                key: startMatch[2],
                startLine: i,
                title: '',
                titleLine: -1
            };
            braceCount = 1;
            continue;
        }

        if (currentEntry) {
            // 计算大括号数量来确定条目结束
            for (const char of line) {
                if (char === '{') braceCount++;
                if (char === '}') braceCount--;
            }

            // 提取 title 字段
            if (currentEntry.titleLine === -1) {
                const titleMatch = line.match(/^\s*title\s*=\s*[{"](.+?)[}"]\s*,?\s*$/i);
                if (titleMatch) {
                    currentEntry.title = titleMatch[1];
                    currentEntry.titleLine = i;
                } else {
                    // 处理多行 title 或带大括号的 title
                    const titleStartMatch = line.match(/^\s*title\s*=\s*[{"]/i);
                    if (titleStartMatch) {
                        currentEntry.titleLine = i;
                        currentEntry.title = extractTitle(line);
                    }
                }
            }

            // 条目结束
            if (braceCount === 0) {
                currentEntry.endLine = i;
                if (currentEntry.title && currentEntry.titleLine !== -1) {
                    entries.push(currentEntry as BibEntry);
                }
                currentEntry = null;
            }
        }
    }

    return entries;
}

/**
 * 从一行中提取 title 值
 */
function extractTitle(line: string): string {
    // 移除 "title = " 部分
    const afterEquals = line.replace(/^\s*title\s*=\s*/i, '');
    // 移除开头的 { 或 " 和结尾的 }, 或 ",
    return afterEquals
        .replace(/^[{"]/, '')
        .replace(/[}"],?\s*$/, '')
        .trim();
}
