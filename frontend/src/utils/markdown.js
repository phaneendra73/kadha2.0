export function renderMarkdown(markdown = '') {
  if (!markdown) return 'No content available.';

  let html = markdown
    // Escape HTML entities to prevent raw scripts insertion
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks: ```language ... ```
  html = html.replace(/```(\w*)\n([\s\S]*?)\n```/gm, (match, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers: # Header
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');

  // Blockquotes: > Quote
  html = html.replace(/^&gt;\s(.*?)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rules: --- or *** or ___ on a line
  html = html.replace(/^(?:\*{3,}|-{3,}|_{3,})\s*$/gm, '<hr />');

  // Task list items
  html = html.replace(/^- \[ \] (.*?)$/gm, '<li class="task-list-item"><label><input type="checkbox" disabled /> $1</label></li>');
  html = html.replace(/^- \[(x|X)\] (.*?)$/gm, '<li class="task-list-item"><label><input type="checkbox" checked disabled /> $2</label></li>');

  // Strikethrough: ~~text~~
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // Tables
  html = html.replace(/(^\|?.*\|.*\n)(^\|?[ \t]*[:-]+[-| :]*(\|[ \t]*[:-]+[-| :]*)*\n)((?:^\|?.*\|.*\n?)*)/gm, (match, headerRow, separatorRow, _separatorExtras, bodyRows = '') => {
    const headerCells = headerRow.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());
    const headers = headerCells.map(cell => `<th>${cell}</th>`).join('');
    const rows = bodyRows.trim().split('\n').filter(Boolean).map(row => {
      const cells = row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());
      const rowCells = cells.map(cell => `<td>${cell}</td>`).join('');
      return `<tr>${rowCells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Images: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Unordered lists: - item
  html = html.replace(/^\-\s(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>');

  // Ordered lists: 1. item
  html = html.replace(/^\d+\.\s(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)+/gs, '<ol>$&</ol>');

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:underline">$1</a>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Paragraphs (split by double newlines)
  const lines = html.split('\n\n');
  const formattedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    // Skip if it starts with structural block tags
    if (/^<(h1|h2|h3|h4|pre|blockquote|ul|li|ol|table|hr)/i.test(trimmed)) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
  });

  return formattedLines.filter(Boolean).join('');
}
