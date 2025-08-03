const vscode = require('vscode');
const fs = require('fs').promises;
const path = require('path');

const anchorCache = new Map(); // { anchorId: { filePath, lineNumber, comment } }

function collectMultiLineComment(lines, startIndex) {
  const comments = [];
  
  // @anchor 라인에서 주석 부분이 있다면 포함
  const anchorLine = lines[startIndex];
  const anchorMatch = anchorLine.match(/\/\/\s*@(cmt-anchor|comment-anchor)\s+([\w-]+)(?:\s+(.*))?/);
  if (anchorMatch && anchorMatch[3] && anchorMatch[3].trim()) {
    comments.push(anchorMatch[3].trim());
  }
  
  // 다음 줄부터 주석 수집
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 빈 줄인 경우 빈 라인 추가하고 계속
    if (line === '') {
      comments.push('');
      continue;
    }
    
    // 일반 주석 라인인지 확인
    const commentMatch = line.match(/^\/\/\s*(.*)/);
    if (commentMatch) {
      const commentText = commentMatch[1];
      
      // 다른 특수 주석(@cmt-anchor, @cmt-link 등)이면 중단
      if (commentText.trim().match(/^@(cmt-anchor|comment-anchor|cmt-link|comment-link)\s+/)) {
        break;
      }
      
      comments.push(commentText);
    } else {
      // 주석이 아닌 라인이 나오면 중단
      break;
    }
  }
  
  return comments.join('\n');
}

async function buildAnchorCache() {
  anchorCache.clear();
  const files = await vscode.workspace.findFiles('**/*.{js,ts}', '**/node_modules/**');
  console.log('Found files:', files.map(f => f.fsPath));
  
  for (const file of files) {
    const fileContent = await fs.readFile(file.fsPath, 'utf-8');
    const lines = fileContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/\/\/\s*@(cmt-anchor|comment-anchor)\s+([\w-]+)/); // 콜론 제거
      
      if (match) {
        const [, , anchorId] = match;
        const comment = collectMultiLineComment(lines, i);
        
        console.log('Caching anchor:', anchorId, 'from', file.fsPath, 'line:', i + 1);
        console.log('Full comment:', comment);
        
        anchorCache.set(anchorId, { 
          filePath: file.fsPath, 
          lineNumber: i + 1, 
          comment: comment 
        });
      }
    }
  }
}

function activate(context) {
  console.log('Comment Tooltip Linker activated!');
  buildAnchorCache();

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(async (event) => {
      const filePath = event.document.uri.fsPath;
      if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
        console.log('File changed, rebuilding cache:', filePath);
        await buildAnchorCache();
      }
    })
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(['javascript', 'typescript'], {
      async provideHover(document, position) {
        const range = document.getWordRangeAtPosition(position, /@(cmt-link|comment-link)\s+[\w-]+/);
        console.log('Hover at:', document.uri.fsPath, position.line, position.character, 'Range:', range);
        
        if (!range) {
          console.log('No range found for @cmt-link or @comment-link');
          return null;
        }

        const linkText = document.getText(range).trim();
        console.log('Link text:', linkText);
        
        const match = linkText.match(/@(cmt-link|comment-link)\s+([\w-]+)/);
        if (!match) {
          console.log('No match for link text');
          return null;
        }

        const [, , anchorId] = match;
        console.log('Looking for anchor:', anchorId);
        
        const entry = anchorCache.get(anchorId);
        if (!entry) {
          console.log('Anchor not found:', anchorId);
          return new vscode.Hover(new vscode.MarkdownString(`Anchor not found: ${anchorId}`));
        }

        const { filePath, lineNumber, comment } = entry;
        const relativePath = path.relative(path.dirname(document.uri.fsPath), filePath);
        
        // 마크다운에서 줄바꿈이 제대로 렌더링되도록 처리
        const formattedComment = comment.replace(/\n/g, '  \n'); // 마크다운 줄바꿈 규칙
        
        const markdown = new vscode.MarkdownString(`**Comment from ${relativePath}:${lineNumber}**\n\n${formattedComment}`);
        markdown.isTrusted = true;
        markdown.appendMarkdown(`\n\n[Open File](${vscode.Uri.file(filePath).with({ fragment: `L${lineNumber}` }).toString()})`);
        
        console.log('Showing tooltip:', comment);
        return new vscode.Hover(markdown, range);
      },
    })
  );
}

module.exports = { activate, deactivate: () => {} };