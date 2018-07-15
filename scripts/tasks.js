require('shelljs/global');

exports.copyAssets = (type) => {
  const env = type === 'build' ? 'prod' : type;
  rm('-rf', type);
  mkdir(type);
  cp(`chrome/manifest.${env}.json`, `${type}/manifest.json`);
  cp('-R', 'chrome/assets/*', type);
  exec(`pug -O "{ env: '${env}' }" -o ${type} chrome/views/`);
};
