import { writeFileSync } from 'fs';
import { dedent } from 'tslint/lib/utils';

// based on git.version.ts from https://stackoverflow.com/a/42199863

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function createVersionsFile(filename: string) {
  const revision = (await exec('git rev-parse --short HEAD')).stdout.toString().trim();
  const branch = (await exec('git rev-parse --abbrev-ref HEAD')).stdout.toString().trim();

  console.log(`version: '${process.env.npm_package_version}', revision: '${revision}', branch: '${branch}'`);

  const content = dedent`
      export const build = {
        version: '${process.env.npm_package_version}',
        revision: '${revision}',
        date: '${new Date().getTime()}'
      };`;

  writeFileSync(filename, content, {encoding: 'utf8'});
}

createVersionsFile('src/environments/build.ts');
