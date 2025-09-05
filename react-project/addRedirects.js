const fs = require("fs");
const path = require("path");

const buildPath = path.join(__dirname, "build", "_redirects");

fs.writeFileSync(buildPath, "/* /index.html 200");
console.log("_redirects file created!");
