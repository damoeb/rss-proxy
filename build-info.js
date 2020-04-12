const { writeFileSync } = require('fs');

// based on git.version.ts from https://stackoverflow.com/a/42199863

const { exec } = require('child_process');

async function createVersionsFile(filename) {
  exec('git rev-parse --short HEAD', (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }

    const revision = stdout.toString().trim();

    exec('git rev-parse --abbrev-ref HEAD', (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return;
      }

      const branch = stdout.toString().trim();

      console.log(`version: '${process.env.npm_package_version}', revision: '${revision}', branch: '${branch}'`);

      const content = `{
        "version": "${process.env.npm_package_version}",
        "revision": "${revision}",
        "date": "${new Date().getTime()}"
      }`;

      writeFileSync(filename, content, {encoding: 'utf8'});

    });

  });
}

createVersionsFile(process.argv[2]);
