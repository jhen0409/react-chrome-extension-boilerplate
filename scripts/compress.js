const fs = require("fs");
const path = require("path");
const ChromeExtension = require("crx");
const name = require('../build/manifest.json').name;
const argv = require('minimist')(process.argv.slice(2));

const crx = new ChromeExtension({
  appId: argv['app-id'],
  codebase: argv.codebase,
  privateKey: fs.readFileSync(argv.key || 'key.pem')
});

crx.load('build')
  .then(function(){
    return crx.loadContents();
  })
  .then(function(archiveBuffer){
    fs.writeFile(name + '.zip', archiveBuffer);

    return crx.pack(archiveBuffer);
  })
  .then(function(crxBuffer){
    const updateXML = crx.generateUpdateXML()

    fs.writeFile('update.xml', updateXML)
    fs.writeFile(name + ".crx", crxBuffer)
  });
