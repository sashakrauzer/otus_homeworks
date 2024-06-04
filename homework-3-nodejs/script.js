const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");

const { resolve } = require("path");
const { readdir } = require("fs").promises;

const args = process.argv.slice(2);
const currentDir = process.cwd();

// async function ls() {
//   const { stdout, stderr } = await exec(`cd ${currentDir}; ls ${args[0]}`);
//   console.log("stdout:", stdout);
//   console.log("stderr:", stderr);
// }
// ls();

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

(async () => {
  for await (const f of getFiles(args[0])) {
    console.log(f);
  }
})();

// fs.readdir(args[0], (err, files) => {
//   files.forEach((file) => {
//     console.log("readdir", file);
//   });
// });

// console.log("arguments", args);
// console.log("current dir", currentDir);
