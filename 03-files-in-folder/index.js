// const fs = require("fs");
const path = require("path");
const fs = require("fs/promises");

const pathToFolder = path.join(__dirname, "./secret-folder");

const readDir = async () => {
  try {
    const files = await fs.readdir(pathToFolder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const pathToFile = path.join(pathToFolder, file.name);
        const fileStat = await fs.stat(pathToFile);
        const { ext, name } = path.parse(file.name);

        console.log(`${name} - ${ext.slice(1)} - ${fileStat.size} bytes`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

readDir();
