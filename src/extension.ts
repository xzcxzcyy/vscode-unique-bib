import * as vscode from 'vscode';
import { parseBibTeX, BibEntry } from './bibParser';
import { calculateSimilarity, normalizeTitle } from './similarity';

// 获取相似度阈值配置
function getSimilarityThreshold(): number {
    return vscode.workspace.getConfiguration('uniqueBib').get('similarityThreshold', 0.9);
}

// 诊断集合
let diagnosticCollection: vscode.DiagnosticCollection;

/**
 * 扩展激活时调用
 */
export function activate(context: vscode.ExtensionContext) {
    console.log(vscode.l10n.t('Extension activated'));

    diagnosticCollection = vscode.languages.createDiagnosticCollection('uniqueBib');
    context.subscriptions.push(diagnosticCollection);

    // 实时检测（hash set，O(n)）
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (isBibFile(event.document)) {
                checkExactDuplicates(event.document);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            if (isBibFile(document)) {
                checkExactDuplicates(document);
            }
        })
    );

    // 注册详细检测命令（F1 可调用）
    context.subscriptions.push(
        vscode.commands.registerCommand('uniqueBib.checkSimilar', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && isBibFile(editor.document)) {
                checkSimilarDuplicates(editor.document);
            } else {
                vscode.window.showWarningMessage(vscode.l10n.t('Please open a .bib file first'));
            }
        })
    );

    // 检查已打开的文件
    vscode.workspace.textDocuments.forEach(document => {
        if (isBibFile(document)) {
            checkExactDuplicates(document);
        }
    });
}

/**
 * 判断是否为 .bib 文件
 */
function isBibFile(document: vscode.TextDocument): boolean {
    return document.languageId === 'bibtex' ||
           document.fileName.endsWith('.bib');
}

/**
 * 实时检测：用 hash set 检测精确重复（O(n)）
 */
function checkExactDuplicates(document: vscode.TextDocument) {
    const entries = parseBibTeX(document.getText());
    const diagnostics: vscode.Diagnostic[] = [];
    const seen = new Map<string, BibEntry>();

    for (const entry of entries) {
        const normalized = normalizeTitle(entry.title);
        const existing = seen.get(normalized);

        if (existing) {
            // 只标记后出现的条目，指向第一次出现的位置
            diagnostics.push(createDiagnostic(
                document, entry, existing, 1
            ));
        } else {
            seen.set(normalized, entry);
        }
    }

    diagnosticCollection.set(document.uri, diagnostics);
}

/**
 * 创建诊断信息
 */
function createDiagnostic(
    document: vscode.TextDocument,
    entry: BibEntry,
    firstEntry: BibEntry,
    similarity: number
): vscode.Diagnostic {
    const line = entry.titleLine;
    const range = new vscode.Range(
        line, 0,
        line, document.lineAt(line).text.length
    );

    const firstLine = firstEntry.titleLine + 1;
    const message = similarity === 1
        ? vscode.l10n.t('Entry {0} has same title as "{1}" (line {2})', entry.key, firstEntry.key, firstLine)
        : vscode.l10n.t('Entry {0} is similar to "{1}" {2}% (line {3})', entry.key, firstEntry.key, (similarity * 100).toFixed(1), firstLine);

    const diagnostic = new vscode.Diagnostic(
        range,
        message,
        vscode.DiagnosticSeverity.Warning
    );
    diagnostic.source = 'Unique BibTeX';

    return diagnostic;
}

/**
 * 详细检测：O(n^2) 相似度比较（手动触发）
 */
function checkSimilarDuplicates(document: vscode.TextDocument) {
    const entries = parseBibTeX(document.getText());
    const diagnostics: vscode.Diagnostic[] = [];

    for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
            const similarity = calculateSimilarity(
                entries[i].title,
                entries[j].title
            );

            if (similarity >= getSimilarityThreshold()) {
                // 只标记后出现的条目 (entries[j])，指向先出现的 (entries[i])
                diagnostics.push(createDiagnostic(
                    document, entries[j], entries[i], similarity
                ));
            }
        }
    }

    diagnosticCollection.set(document.uri, diagnostics);
    vscode.window.showInformationMessage(
        vscode.l10n.t('Check complete, found {0} similar entries', diagnostics.length)
    );
}

/**
 * 扩展停用时调用
 */
export function deactivate() {
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
}
