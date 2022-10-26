const fs = require("fs");
const { stdin, stdout } = require("process");
const path = require("path");
const readline = require("readline");

const pathToTextFile = path.join(__dirname, "./text.txt");
const writeableStream = fs.createWriteStream(pathToTextFile, { flags: "a" });

console.log("Hello, please input your text");

const rl = readline.createInterface({ input: stdin, output: stdout });
rl.on("line", (text) => {
  if (text === "exit") {
    rl.close();
    console.log("goodbye my friend and have a good day ^_^");
  } else {
    writeableStream.write(`\n${text}`);
  }
});

rl.on("SIGINT", () => {
  rl.close();
  console.log("goodbye my friend and have a good day ^_^");
});
