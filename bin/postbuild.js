const path = require("path");
const fs   = require("fs");

const libPath = path.resolve(process.cwd(), "projects");
const libraries = fs.readdirSync(libPath).filter((project) => project !== "sandbox");

for(let i = 0, ln = libraries.length; i < ln; i++) {
    cleanLibrary(libraries[i]);
}

function cleanLibrary(name) {
    const libPath = path.resolve(process.cwd(), "dist", name);

    fs.readdirSync(libPath)
        .filter((file) => /^tsmonkeypatch|public-api/.test(file))
        .forEach((file) => fs.unlinkSync(path.resolve(libPath, file)));
}