// script.js - Main controller file

// DOM Elements
const sourceLanguage = document.getElementById('source-language');
const sourceCode = document.getElementById('source-code');
const convertBtn = document.getElementById('convert-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const copyBtns = document.querySelectorAll('.copy-btn');

// Output elements
const lexicalOutput = document.getElementById('lexical-output');
const syntaxOutput = document.getElementById('syntax-output');
const semanticOutput = document.getElementById('semantic-output');
const intermediateOutput = document.getElementById('intermediate-output');
const optimizationOutput = document.getElementById('optimization-output');
const pythonOutput = document.getElementById('python-code');

// Tab switching
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');
    
    // Update active tab button
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update active tab content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
  });
});

// Copy buttons
copyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.closest('.tab-content').id;
    const outputElement = document.getElementById(`${tabId}-output`) || 
                         document.getElementById('python-code');
    const text = outputElement.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.textContent = 'Copy';
      }, 2000);
    });
  });
});

// Conversion controller
convertBtn.addEventListener('click', async () => {
  const language = sourceLanguage.value;
  const code = sourceCode.value;

  // Clear previous outputs
  lexicalOutput.textContent = 'Processing...';
  syntaxOutput.textContent = 'Processing...';
  semanticOutput.textContent = 'Processing...';
  intermediateOutput.textContent = 'Processing...';
  optimizationOutput.textContent = 'Processing...';
  pythonOutput.textContent = 'Processing...';

  // Run the appropriate conversion based on language
  if (language === 'c') {
    await runCConversion(code);
  } else if (language === 'cpp') {
    await runCppConversion(code);
  }
});

async function runCConversion(code) {
  // Run each phase with a small delay for better UX
  tokenizeCCode(code, lexicalOutput);
  await sleep(500);
  parseCSyntax(code, syntaxOutput);
  await sleep(500);
  checkCSemantics(code, semanticOutput);
  await sleep(500);
  generateCIntermediateCode(code, intermediateOutput);
  await sleep(500);
  optimizeCCode(code, optimizationOutput);
  await sleep(500);
  generatePythonFromC(code, pythonOutput);
}

async function runCppConversion(code) {
  // Run each phase with a small delay for better UX
  tokenizeCppCode(code, lexicalOutput);
  await sleep(500);
  parseSyntax(code, syntaxOutput);
  await sleep(500);
  checkSemantics(code, semanticOutput);
  await sleep(500);
  generateIntermediateCode(code, intermediateOutput);
  await sleep(500);
  optimizeCode(code, optimizationOutput);
  await sleep(500);
  generatePythonCode(code, pythonOutput);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}