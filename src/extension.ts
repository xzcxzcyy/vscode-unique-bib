import * as vscode from 'vscode';
import { parseBibTeX, BibEntry } from './bibParser';
import { calculateSimilarity, normalizeTitle } from './similarity';

// 相似度阈值（详细检测用）
const SIMILARITY_THRESHOLD = 0.9;

// 诊断集合
let diagnosticCollection: vscode.DiagnosticCollection;

/**
 * 扩展激活时调用
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Unique BibTeX 扩展已激活');

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
                vscode.window.showWarningMessage('请先打开一个 .bib 文件');
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
            // 两个条目都标记警告
            diagnostics.push(createDiagnostic(
                document, entry, existing, 1, 'exact'
            ));
            diagnostics.push(createDiagnostic(
                document, existing, entry, 1, 'exact'
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
    duplicate: BibEntry,
    similarity: number,
    type: 'exact' | 'similar'
): vscode.Diagnostic {
    const line = entry.titleLine;
    const range = new vscode.Range(
        line, 0,
        line, document.lineAt(line).text.length
    );

    const percentage = (similarity * 100).toFixed(1);
    const message = type === 'exact'
        ? `"${entry.key}" 与 "${duplicate.key}" 标题相同`
        : `"${entry.key}" 与 "${duplicate.key}" 标题相似 (${percentage}%)`;

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

            if (similarity >= SIMILARITY_THRESHOLD) {
                diagnostics.push(createDiagnostic(
                    document, entries[i], entries[j], similarity, 'similar'
                ));
                diagnostics.push(createDiagnostic(
                    document, entries[j], entries[i], similarity, 'similar'
                ));
            }
        }
    }

    diagnosticCollection.set(document.uri, diagnostics);
    vscode.window.showInformationMessage(
        `检测完成，发现 ${diagnostics.length / 2} 对相似条目`
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
