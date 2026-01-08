/**
 * 计算两个字符串的相似度（使用 Levenshtein 距离）
 * 返回 0-1 之间的值，1 表示完全相同
 */
export function calculateSimilarity(str1: string, str2: string): number {
    const s1 = normalizeTitle(str1);
    const s2 = normalizeTitle(str2);

    if (s1 === s2) return 1;
    if (s1.length === 0 || s2.length === 0) return 0;

    const distance = levenshteinDistance(s1, s2);
    const maxLen = Math.max(s1.length, s2.length);

    return 1 - distance / maxLen;
}

/**
 * 标准化字符串：转小写，移除标点，压缩空格（导出供 hash 使用）
 */
export function normalizeTitle(str: string): string {
    return str
        .toLowerCase()
        .replace(/[{}\\]/g, '')           // 移除 LaTeX 大括号和反斜杠
        .replace(/[^\w\s]/g, ' ')          // 标点替换为空格
        .replace(/\s+/g, ' ')              // 压缩多个空格
        .trim();
}

/**
 * 计算 Levenshtein 编辑距离
 */
function levenshteinDistance(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;

    // 使用一维数组优化空间
    const dp: number[] = Array(n + 1).fill(0).map((_, i) => i);

    for (let i = 1; i <= m; i++) {
        let prev = dp[0];
        dp[0] = i;

        for (let j = 1; j <= n; j++) {
            const temp = dp[j];
            if (s1[i - 1] === s2[j - 1]) {
                dp[j] = prev;
            } else {
                dp[j] = 1 + Math.min(prev, dp[j], dp[j - 1]);
            }
            prev = temp;
        }
    }

    return dp[n];
}
