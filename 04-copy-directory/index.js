const path = require("path");
const fs = require("fs/promises");

const pathToOldFolder = path.join(__dirname, "./files");
const pathToNewFolder = path.join(__dirname, "./files-copy");

const copyDirectory = async (oldPath, newPath) => {
  try {
    const removeCopyDir = await fs.rm(newPath, {
      recursive: true,
      force: true,
    });
    const createDir = await fs.mkdir(newPath, { recursive: true });
    const files = await fs.readdir(oldPath, { withFileTypes: true });
    for (const file of files) {
      const pathToOldFile = path.join(oldPath, file.name);
      const pathToNewFile = path.join(newPath, file.name);
      if (file.isDirectory()) {
        copyDirectory(pathToOldFile, pathToNewFile);
      } else if (file.isFile()) {
        await fs.copyFile(pathToOldFile, pathToNewFile);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};

copyDirectory(pathToOldFolder, pathToNewFolder);
