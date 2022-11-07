const path = require("path");
const { createWriteStream } = require("fs");
const fs = require("fs/promises");

const pathToStyleFolder = path.join(__dirname, "./styles");
const pathToBundleFile = path.join(__dirname, "./project-dist/bundle.css");

const mergeStyles = async () => {
  const removeBundleCssFile = await fs.rm(pathToBundleFile, {
    recursive: true,
    force: true,
  });

  const writeableStream = createWriteStream(pathToBundleFile, { flags: "a" });

  try {
    const files = await fs.readdir(pathToStyleFolder, { withFileTypes: true });
    for (const file of files) {
      const { ext } = path.parse(file.name);
      if (ext === ".css") {
        const pathToFile = path.join(pathToStyleFolder, file.name);
        const data = await fs.readFile(pathToFile, {
          encoding: "utf8",
        });
        writeableStream.write(data);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};

mergeStyles();
