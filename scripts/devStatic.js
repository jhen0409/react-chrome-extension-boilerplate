require('shelljs/global');

// should run devReloadable first then, run this from other terminal window
console.log('[Webpack devStatic: watching for page script changes]');
console.log('-'.repeat(80));

exec('webpack --watch --config webpack/devStatic.config.js --progress --profile --colors');
