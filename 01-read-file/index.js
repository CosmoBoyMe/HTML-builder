const fs = require("fs");
const path = require("path");
const { stdout } = require("process");

const pathToTextFile = path.join(__dirname, "./text.txt");
const readStream = fs.createReadStream(pathToTextFile);
readStream.on("data", (data) => stdout.write(data));
