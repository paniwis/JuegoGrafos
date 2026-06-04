const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outRoot = path.resolve(root, "..");
const htmlPath = path.join(root, "index.html");
const cssPath = path.join(root, "src", "styles.css");
const jsPath = path.join(root, "src", "game.js");
const outputPath = path.join(outRoot, "necroforge.html");

let html = fs.readFileSync(htmlPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const js = fs.readFileSync(jsPath, "utf8");

html = html.replace('<link rel="stylesheet" href="src/styles.css">', `<style>\n${css}\n  </style>`);
html = html.replace('<script src="src/game.js"></script>', `<script>\n${js}\n  </script>`);

fs.writeFileSync(outputPath, html, "utf8");
console.log(`Built ${outputPath}`);
