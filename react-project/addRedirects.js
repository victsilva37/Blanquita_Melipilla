const fs = require("fs");
const path = require("path");

// Ruta al dist
const distPath = path.join(__dirname, "dist", "_redirects");

fs.writeFileSync(distPath, "/* /index.html 200");
console.log("_redirects file created in dist!");
