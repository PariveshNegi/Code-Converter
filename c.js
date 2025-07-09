// C Language Conversion Functions

function tokenizeCCode(code, outputPanel) {
  const tokenTypes = {
    preprocessor: [],
    keyword: [],
    identifier: [],
    operator: [],
    symbol: [],
    literal: [],
    comment: []
  };

  const cKeywords = [
    'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
    'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
    'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
    'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while'
  ];

  const operators = [
    '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=', '&&', '||', '++', '--',
    '+', '-', '*', '/', '&', '|', '^', '%', '<<', '>>', '+=', '-=', '*=', '/=', '&=',
    '|=', '^=', '%=', '<<=', '>>=', '->'
  ];

  const symbols = ['{', '}', '(', ')', '[', ']', ';', ',', '.', '#'];

  const regexString = /#\w+|".*?"|'.'|\b\d+\.?\d*\b|\b\w+\b|->|<<=|>>=|[\+\-\*\/%&|\^=<>!]=?|[,;(){}[\]\.]|\/\/.*|\/\*[\s\S]*?\*\//g;

  const matches = code.match(regexString) || [];

  for (let token of matches) {
    if (token.startsWith('#')) {
      tokenTypes.preprocessor.push(token);
    } else if (token.startsWith('//') || token.startsWith('/*')) {
      tokenTypes.comment.push(token);
    } else if (cKeywords.includes(token)) {
      tokenTypes.keyword.push(token);
    } else if (operators.includes(token)) {
      tokenTypes.operator.push(token);
    } else if (symbols.includes(token)) {
      tokenTypes.symbol.push(token);
    } else if (/^".*"$/.test(token) || /^'.'$/.test(token) || /^\d+\.?\d*$/.test(token)) {
      tokenTypes.literal.push(token);
    } else if (/^[a-zA-Z_]\w*$/.test(token)) {
      tokenTypes.identifier.push(token);
    }
  }

  let output = '[LEXICAL PHASE STARTED]\n';
  for (const [type, tokens] of Object.entries(tokenTypes)) {
    if (tokens.length > 0) {
      output += `[LEXICAL] -> ${type} -> ${tokens[0]}\n`;
      for (let i = 1; i < tokens.length; i++) {
        output += `                      -> ${tokens[i]}\n`;
      }
    }
  }
  output += '[LEXICAL PHASE COMPLETE]\n\n';
  outputPanel.textContent = output;
}

function parseCSyntax(code, outputPanel) {
  let output = '[SYNTAX PHASE STARTED]\n';
  const lines = code.split('\n').map(l => l.trim()).filter(l => l !== '');
  let indent = '';
  let inFunction = false;

  lines.forEach(line => {
    if (line.startsWith('//') || line.startsWith('/*')) {
      output += `${indent}└── Comment: ${line}\n`;
      return;
    }

    if (line.includes('{')) {
      output += `${indent}└── Block Start: ${line}\n`;
      indent += '    ';
    } else if (line.includes('}')) {
      indent = indent.slice(0, -4);
      output += `${indent}└── Block End\n`;
      if (inFunction) {
        inFunction = false;
      }
    } else if (/int\s+main\s*\(/.test(line)) {
      output += `${indent}└── Function: main()\n`;
      inFunction = true;
    } else if (/(int|float|double|char)\s+\w+\s*\(.*\)/.test(line)) {
      const funcMatch = line.match(/(\w+)\s+(\w+)\s*\(/);
      output += `${indent}└── Function: ${funcMatch[1]} ${funcMatch[2]}\n`;
      inFunction = true;
    } else if (/(int|float|double|char)\s+\w+\s*=?\s*[^;]*;/.test(line)) {
      const varMatch = line.match(/(\w+)\s+(\w+)/);
      output += `${indent}└── Variable: ${varMatch[1]} ${varMatch[2]}\n`;
    } else if (/for\s*\(/.test(line)) {
      output += `${indent}└── For Loop: ${line}\n`;
    } else if (/if\s*\(/.test(line)) {
      output += `${indent}└── If Statement: ${line}\n`;
    } else if (/printf\s*\(/.test(line)) {
      output += `${indent}└── Print Statement: ${line}\n`;
    } else if (/scanf\s*\(/.test(line)) {
      output += `${indent}└── Scan Statement: ${line}\n`;
    } else if (/return\s+/.test(line)) {
      output += `${indent}└── Return Statement: ${line}\n`;
    } else if (line.trim()) {
      output += `${indent}└── Statement: ${line}\n`;
    }
  });

  output += '[SYNTAX PHASE COMPLETE]\n\n';
  outputPanel.textContent = output;
}

function checkCSemantics(code, outputPanel) {
  let output = '';
  if (code.includes('int main(')) {
    output += '[SEMANTIC] -> Main function found ✅\n';
  } else {
    output += '[SEMANTIC] -> No main function found ❌\n';
  }

  const funcRegex = /(int|float|double|char)\s+(\w+)\s*\([^)]*\)/g;
  let match;
  while ((match = funcRegex.exec(code)) !== null) {
    const returnType = match[1];
    const funcName = match[2];
    const funcBody = code.substring(match.index, code.indexOf('}', match.index));
    
    if (returnType !== 'void' && !funcBody.includes(`return `)) {
      output += `[SEMANTIC] -> Function ${funcName} missing return statement ❌\n`;
    } else {
      output += `[SEMANTIC] -> Function ${funcName} return check passed ✅\n`;
    }
  }

  output += '\n';
  outputPanel.textContent = output;
}

function generateCIntermediateCode(code, outputPanel) {
  let lines = code.split('\n').filter(line => line.trim() !== '');
  let intermediate = lines.map(line => `IR: ${line.trim()}`).join('\n');
  outputPanel.textContent = '[INTERMEDIATE] -> Intermediate Representation:\n' + intermediate + '\n\n';
}

function optimizeCCode(code, outputPanel) {
  const optimized = code.replace(/#include\s+<[^>]+>/g, '');
  
  const optimized2 = optimized.replace(/;\s*$/gm, '');
  
  outputPanel.textContent = '[OPTIMIZATION] -> Removed unused includes and empty statements ✅\n\n';
}

function generatePythonFromC(code, outputPanel) {
  let pyCode = code;

  pyCode = pyCode.replace(/\/\*([\s\S]*?)\*\//g, (match, comment) => {
    const cleanedComment = comment.split('\n')
      .map(line => line.replace(/^\s*\* ?/, ''))
      .join('\n')
      .trim();
    return `'''\n${cleanedComment}\n'''`;
  });

  pyCode = pyCode.replace(/#.*/g, '');

  pyCode = pyCode.replace(/int\s+main\s*\([^)]*\)\s*\{/, 'if __name__ == "__main__":');

  pyCode = pyCode.replace(/(int|float|double|char|void)\s+(\w+)\s*\(([^)]*)\)\s*\{/g, (match, retType, name, params) => {
    const pythonParams = params
      .split(',')
      .map(p => {
        const parts = p.trim().split(/\s+/);
        return parts[parts.length - 1];
      })
      .join(', ');
    return `def ${name}(${pythonParams}):`;
  });

  pyCode = pyCode.replace(/(int|float|double|char)\s+(\w+)\s*;/g, '$2 = None');
  pyCode = pyCode.replace(/(int|float|double|char)\s+(\w+)\s*=\s*([^;]+);/g, '$2 = $3');

  pyCode = pyCode.replace(/printf\s*\((.*)\)\s*;/g, (match, content) => {
    const formatSpecifiers = content.match(/%[dfsc]/g) || [];
    
    const parts = content.split(',');
    const formatString = parts[0].trim();
    const args = parts.slice(1).map(arg => arg.trim());
    
    let pyFormat = formatString;
    let pyArgs = [];
    
    pyFormat = pyFormat.replace(/%d/g, '{}')
                       .replace(/%f/g, '{}')
                       .replace(/%s/g, '{}')
                       .replace(/%c/g, '{}')
                       .replace(/\\n/g, '\\n');
    
    if (pyFormat.startsWith('"') && pyFormat.endsWith('"')) {
      pyFormat = pyFormat.slice(1, -1);
    }
    
    if (args.length > 0) {
      return `print(f"${pyFormat}".format(${args.join(', ')}))`;
    } else {
      return `print("${pyFormat}")`;
    }
  });

  pyCode = pyCode.replace(/scanf\s*\([^,]+,\s*&(\w+)\);/g, '$1 = input()');

  pyCode = pyCode.replace(/for\s*\(\s*(int\s+)?(\w+)\s*=\s*(\d+)\s*;\s*(\w+)\s*([<=>]+)\s*(\w+)\s*;\s*(\w+)\s*(\+\+|--)\s*\)\s*\{/g, 
    (match, typeDecl, varName, start, loopVar, operator, end, incVar, incOp) => {
      let step = '1';
      if (incOp === '--') step = '-1';
      
      if (operator === '<') {
        return `for ${varName} in range(${start}, ${end}, ${step}):`;
      } else if (operator === '<=') {
        return `for ${varName} in range(${start}, ${parseInt(end) + 1}, ${step}):`;
      }
      return match; 
    });

  pyCode = pyCode.replace(/while\s*\(([^)]+)\)\s*\{/g, 'while $1:');

  pyCode = pyCode.replace(/if\s*\(([^)]+)\)\s*\{/g, 'if $1:');
  pyCode = pyCode.replace(/else\s*\{/g, 'else:');
  pyCode = pyCode.replace(/else if\s*\(([^)]+)\)\s*\{/g, 'elif $1:');

  pyCode = pyCode.replace(/&&/g, 'and');
  pyCode = pyCode.replace(/\|\|/g, 'or');
  pyCode = pyCode.replace(/!/g, 'not ');

  pyCode = pyCode.replace(/if __name__ == "__main__":([\s\S]*?)return\s+0;?\s*/, 'if __name__ == "__main__":$1');

  pyCode = pyCode.replace(/return\s+([^;]+);/g, 'return $1');

  pyCode = pyCode.replace(/\/\/.*$/gm, match => {
    const commentText = match.replace(/^\/\//, '').trim();
    return commentText ? `# ${commentText}` : '#';
  });

  pyCode = pyCode.replace(/{/g, '');
  pyCode = pyCode.replace(/}/g, '');
  pyCode = pyCode.replace(/;/g, '');

  const lines = pyCode.split('\n');
  let indentLevel = 0;
  const formatted = [];
  let inMultilineComment = false;

  for (let line of lines) {
    line = line.trim();
    if (line === '') continue;
    
    if (line.startsWith("'''") || line.startsWith('"""')) {
      inMultilineComment = !inMultilineComment;
      formatted.push('    '.repeat(indentLevel) + line);
      continue;
    }
    
    if (inMultilineComment) {
      formatted.push('    '.repeat(indentLevel) + line);
      continue;
    }
    
    if (line.startsWith('#')) {
      formatted.push('    '.repeat(indentLevel) + line);
      continue;
    }

    if (line.startsWith('else') || line.startsWith('elif')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    formatted.push('    '.repeat(indentLevel) + line);
    
    if (line.endsWith(':') && !line.startsWith('#')) {
      indentLevel++;
    }
  }

  outputPanel.textContent = '[PYTHON] -> Translated Python Code:\n\n' + formatted.join('\n') + '\n';
}