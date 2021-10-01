const versions = require('fs').readFileSync('./versions.txt', 'utf8').split('\n').filter(Boolean);

function exec(cmd) {
  return new Promise((resolve) => {
    console.log(cmd);
    require('child_process').exec(`cd ${__dirname}; ${cmd}`, (error, stdout, stderr) => {
      resolve({stdout, stderr});
    });
  });
}

const packages = ['@ionic/react', '@ionic/react-router', '@ionic/core'];

const installVersion = (version) => {
  version = version.replace('refs/tags/v', '');
  const installCMD = `npm install ${packages.map(p => `${p}@${version}`).join(' ')}`;
  return exec(installCMD);
};

const runTest = async (version) => {
  const {stdout} = await exec('npx playwright test');
  if(stdout.includes('failed')) {
    console.log(`Version: ${version} failed`)
  } else {
    console.log(`Version: ${version} passed`);
  }
}

async function main() {
  for (const v of versions) {
    console.log(`Running version ${v}`);
    await installVersion(v);
    await runTest(v);
  }
}

main().finally(process.exit);
