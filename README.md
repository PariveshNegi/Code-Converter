<h1 align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com/?lines=Code+Converter!&center=true&size=30">
  </a>
</h1>

📌 Project Overview
Code Converter is a web-based tool designed to help users analyze and convert C and C++ code into Python. It walks the code through multiple compiler phases such as lexical analysis, syntax parsing, semantic checks, intermediate code generation, and basic optimization — all visualized in a user-friendly interface. It’s an educational utility, especially useful for beginners learning how compilers work or transitioning between programming languages.

🧠 Features
Language Support: Currently supports C and C++ as input, and outputs equivalent Python code.

Compiler Phases Simulated: The project simulates core phases of compilation — Lexical Analysis, Syntax Parsing, Semantic Checks, Intermediate Representation, and Optimization.

Python Code Generation: Converts basic code structures from C/C++ to Python, including loops, conditionals, I/O, and function definitions.

Tabbed Output: The interface presents phase-wise outputs in clearly labeled tabs, making it easy to trace code flow.

🛠️ Tech Stack
Frontend: HTML, CSS, and Vanilla JavaScript.

Core Logic: Custom JavaScript functions handle lexical parsing, syntax tree representation, and semantic rule enforcement.

Design: The UI is styled using modern CSS techniques with a responsive layout and visually distinct input/output sections.

🔧 How It Works
The user enters C or C++ code and selects the appropriate language.

On clicking “Convert,” the JavaScript controller (script.js) triggers the respective parser functions.

Each compiler phase processes the code and displays structured output in the respective tab.

The Python conversion module translates supported syntax elements and displays clean Python code for learning or reuse.

🚀 Usage Instructions
Open index.html in any modern browser.

Enter your C/C++ code in the text area.

Select the source language from the dropdown.

Click Convert to analyze and convert your code.

Navigate through the output tabs to view different phases.

📂 Project Structure
index.html: Main UI layout

style.css: Custom styling for layout and components

script.js: Controller for UI interaction and tab switching

c.js and c++.js: Core logic for lexical, syntax, semantic parsing, and conversion
