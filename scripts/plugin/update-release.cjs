
const fs = require('fs');
const { resolve } = require('path');
const nowDir = __dirname

const readSig = (productName, version) => {
  const path = resolve(nowDir, '..', '..', 'src-tauri', 'target', 'release', 'bundle', 'msi', `${productName}_${version}_x64_en-US.msi.zip.sig`)
  console.log('readSig', path)
  const sig = fs.readFileSync(path, 'utf-8')
  return sig
}

const createUpdater = ({ productName, repoName, userName, version, notes }) => {
  const versionTag = "v" + version
  const update = {
    version: versionTag,
    notes,
    "pub_date": new Date(),
    "platforms": {
      "windows-x86_64": {
        "signature": readSig(productName, version),
        "url": `https://github.com/${userName}/${repoName}/releases/download/${versionTag}/${productName}_${version}_x64_en-US.msi.zip`
      }
    }
  }
  const path = resolve(nowDir, '..', '..', '.updater')
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  const jsonPath = resolve(path, 'updater.json')
  console.log('update file：', jsonPath)
  console.log('update data：', update)
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(update, null, 2)
  );
}

/**
 * Called by semantic-release during the success step
 * @param {*} pluginConfig The semantic-release plugin config
 * @param {*} context The context provided by semantic-release
 */
async function success({ productName, repoName, userName }, { nextRelease }) {
  if (!productName) {
    throw new Error('Please configure the productName!')
  }
  createUpdater({
    productName,
    repoName,
    userName,
    version: nextRelease.version,
    notes: nextRelease.notes
  })
}

module.exports = { success };