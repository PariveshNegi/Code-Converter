// C++ Language Conversion Functions

function tokenizeCppCode(code, outputPanel) {
  const tokenTypes = {
    preprocessor: [],
    header: [],
    keyword: [],
    identifier: [],
    operator: [],
    symbol: [],
    literal: [],
    return: []
  };

  const keywords = ['int', 'return', 'using', 'namespace', 'main', 'cin', 'cout', 'for', 'if', 'else', 'while'];
  const operators = ['=', '*', '/', '+', '-', '>>', '<<', '>=', '<=', '==', '++', '--', '&&', '||', '!', '&', '|', '^'];
  const symbols = [';', '{', '}', '(', ')', '[', ']', ',', '.', '<', '>', ':', '?'];
  const regexString = /#include|<.*?>|"[^"]*"|\b(?:int|return|using|namespace|main|cin|cout|for|if|else|while)\b|>>|<<|[=*/+\-;{}()<>[\].,?:&|^!~]|\b[a-zA-Z_]\w*\b|\d+/g;

  const matches = code.match(regexString) || [];

  for (let token of matches) {
    if (token === '#include') tokenTypes.preprocessor.push(token);
    else if (/^<.*>$/.test(token)) tokenTypes.header.push(token);
    else if (keywords.includes(token)) {
      if (token === 'return') tokenTypes.return.push(token);
      else tokenTypes.keyword.push(token);
    } else if (operators.includes(token)) tokenTypes.operator.push(token);
    else if (symbols.includes(token)) tokenTypes.symbol.push(token);
    else if (/^".*"$/.test(token) || /^\d+$/.test(token)) tokenTypes.literal.push(token);
    else tokenTypes.identifier.push(token);
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

function parseSyntax(code, outputPanel) {
  let output = '[SYNTAX PHASE STARTED]\n';
  const lines = code.split('\n').map(l => l.trim()).filter(l => l !== '');
  let indent = '';

  lines.forEach(line => {
    if (line.includes('{')) {
      output += `${indent}└── Block Start: ${line}\n`;
      indent += '    ';
    } else if (line.includes('}')) {
      indent = indent.slice(0, -4);
      output += `${indent}└── Block End\n`;
    } else if (/int\s+main\s*\(\)/.test(line)) {
      output += `${indent}└── Function: main()\n`;
    } else if (/int\s+\w+\s*=/.test(line)) {
      const varName = line.match(/int\s+(\w+)/)[1];
      output += `${indent}└── Declaration: int ${varName}\n`;
    } else if (/cout\s*<</.test(line)) {
      output += `${indent}└── Output Statement: ${line}\n`;
    } else if (/cin\s*>>/.test(line)) {
      output += `${indent}└── Input Statement: ${line}\n`;
    } else if (/for\s*\(/.test(line)) {
      output += `${indent}└── For Loop: ${line}\n`;
    } else if (/return\s+/.test(line)) {
      output += `${indent}└── Return Statement: ${line}\n`;
    } else {
      output += `${indent}└── Statement: ${line}\n`;
    }
  });

  output += '[SYNTAX PHASE COMPLETE]\n\n';
  outputPanel.textContent = output;
}

function checkSemantics(code, outputPanel) {
  let output = '';
  if (code.includes('int') && code.includes('return')) {
    output += '[SEMANTIC] -> Types and returns look valid ✅\n\n';
  } else {
    output += '[SEMANTIC] -> Type or return issue found ❌\n\n';
  }
  outputPanel.textContent = output;
}

function generateIntermediateCode(code, outputPanel) {
  let lines = code.split('\n').filter(line => line.trim() !== '');
  let intermediate = lines.map(line => `IR: ${line.trim()}`).join('\n');
  outputPanel.textContent = '[INTERMEDIATE] -> Intermediate Representation:\n' + intermediate + '\n\n';
}

function optimizeCode(code, outputPanel) {
  outputPanel.textContent = '[OPTIMIZATION] -> Removed redundant steps (mock) ✅\n\n';
}

function generatePythonCode(code, outputPanel) {
  let pyCode = code;

  pyCode = pyCode.replace(/using\s+namespace\s+std\s*;/g, '');

  pyCode = pyCode.replace(/std::/g, '');

  pyCode = pyCode.replace(/cout\s*<<\s*([^;]+);/g, (match, content) => {
    const parts = content.split('<<')
      .map(part => part.trim())
      .filter(part => part !== '')
      .map(part => {
        if (part === 'endl') return '"\\n"';
        if (part === 'ends') return '" "';
        if (part === 'flush') return '';
        return part;
      })
      .filter(part => part !== ''); 

    if (parts.length === 0) return 'print()';

    return `print(${parts.join(', ')})`;
  });

  pyCode = pyCode.replace(/cin\s*>>\s*([^;]+);/g, (match, variables) => {
    return variables.split('>>')
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(v => `${v} = input()`)
      .join('\n');
  });

  pyCode = pyCode.replace(/\/\*([\s\S]*?)\*\//g, (match, comment) => {
    return `'''\n${comment.trim()}\n'''`;
  });

  pyCode = pyCode.replace(/#.*/g, '');

  pyCode = pyCode.replace(/\/\/(.*)/g, '# $1');

  pyCode = pyCode.replace(/int\s+main\s*\(\)\s*{/g, 'def main():');

  pyCode = pyCode.replace(/(int|float|double|char|string)\s+(\w+)\s*;/g, '');
  pyCode = pyCode.replace(/(int|float|double|char|string)\s+(\w+)\s*=\s*([^;]+);/g, '$2 = $3');

  pyCode = pyCode.replace(/for\s*\(\s*(int\s+)?(\w+)\s*=\s*(\d+);\s*\2\s*[<>=]+\s*(\d+);\s*\2(\+\+|--)\s*\)/g,
    'for $2 in range($3, $4):');
  pyCode = pyCode.replace(/if\s*\(([^)]+)\)/g, 'if $1:');
  pyCode = pyCode.replace(/else\s*/g, 'else:');
  pyCode = pyCode.replace(/while\s*\(([^)]+)\)/g, 'while $1:');

  pyCode = pyCode.replace(/return\s+0\s*;/g, 'return 0');

  pyCode = pyCode.replace(/{/g, '');
  pyCode = pyCode.replace(/}/g, '');
  pyCode = pyCode.replace(/;/g, '');

  const lines = pyCode.split('\n');
  let indentLevel = 0;
  const formatted = [];
  let inMainFunction = false;

  for (let line of lines) {
    line = line.trim();
    if (line === '') continue;

    if (line.startsWith('def main():')) {
      inMainFunction = true;
    }

    if (line.startsWith('#') || line.startsWith("'''") || line.startsWith('"""')) {
      formatted.push('    '.repeat(indentLevel) + line);
      continue;
    }

    if (line.startsWith('else') || line.startsWith('elif')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    formatted.push('    '.repeat(indentLevel) + line);

    if (line.endsWith(':')) {
      indentLevel++;
    }

    if (line.startsWith('return') && inMainFunction) {
      const remainingLines = lines.slice(lines.indexOf(line) + 1)
        .filter(l => l.trim() !== '' && !l.trim().startsWith('#') && !l.trim().startsWith("'''") && !l.trim().startsWith('}'));
      if (remainingLines.length === 0) {
        formatted.pop(); 
        continue;
      }
    }
  }

  if (pyCode.includes('def main():')) {
    formatted.push('');
    formatted.push('if __name__ == "__main__":');
    formatted.push('    main()');
  }

  outputPanel.textContent = '[PYTHON] -> Translated Python Code:\n\n' + formatted.join('\n') + '\n';
}