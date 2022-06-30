import { updatePackageJsons } from './utils.mjs';

updatePackageJsons(
  (packageName) => `file:${process.env.GITHUB_WORKSPACE}/${packageName.replace('@cloudscape-design/', '')}.tgz`
);
