const path = require("path");
const { createWriteStream } = require("fs");
const fs = require("fs/promises");

const pathToNewDist = path.join(__dirname, "project-dist");
const pathToOldAssetsFolder = path.join(__dirname, "./assets");
const pathToNewAssetsFolder = path.join(pathToNewDist, "./assets");

const createIndexPage = async () => {
  const pathToTemplate = path.join(__dirname, "./template.html");
  const pathToIndex = path.join(pathToNewDist, "index.html");
  const removeIndex = await fs.rm(pathToIndex, {
    recursive: true,
    force: true,
  });
  const pathToComponents = path.join(__dirname, "./components");
  const writeableStream = createWriteStream(pathToIndex, { flags: "a" });
  let templateData = await fs.readFile(pathToTemplate, {
    encoding: "utf8",
  });
  const tagsRex = /{{[a-z]+}}/gi;
  const matchAllTags = templateData.match(tagsRex);
  const tagsNames = [...matchAllTags].map((item) => item.slice(2, -2));
  const files = await fs.readdir(pathToComponents, { withFileTypes: true });
  for (const file of files) {
    const { name, ext } = path.parse(file.name);
    if (tagsNames.includes(name) && ext === ".html") {
      const pathToFile = path.join(pathToComponents, file.name);
      const fileData = await fs.readFile(pathToFile, {
        encoding: "utf8",
      });
      const newTemplateData = templateData.replaceAll(`{{${name}}}`, fileData);
      templateData = newTemplateData;
    }
  }
  writeableStream.write(templateData);
};

const mergeStyles = async () => {
  const pathToStyleFolder = path.join(__dirname, "./styles");
  const pathToBundleFile = path.join(pathToNewDist, "style.css");
  const removeBundleCssFile = await fs.rm(pathToBundleFile, {
    recursive: true,
    force: true,
  });

  const writeableStream = createWriteStream(pathToBundleFile, { flags: "a" });
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
};

const copyDirectory = async (oldPath, newPath) => {
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
};

const buildPage = async () => {
  try {
    const createDir = await fs.mkdir(pathToNewDist, { recursive: true });
    await createIndexPage();
    await mergeStyles();
    await copyDirectory(pathToOldAssetsFolder, pathToNewAssetsFolder);
  } catch (err) {
    console.error(err.message);
  }
};

buildPage();