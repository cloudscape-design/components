import path from 'path';
import fs from 'fs';

const inputs = {
  path: process.env.INPUT_PATH,
};

function findPackageFiles(directory) {
  const files = [];

  if (!fs.existsSync(directory)) {
    return [];
  }

  ['package.json', 'package-lock.json'].forEach(fileName => {
    const packageJson = path.join(directory, fileName);
    if (fs.existsSync(packageJson)) {
      files.push(packageJson);
    }
  });

  return files;
}

function findAllPackageJsons() {
  const files = [];

  if (!inputs.path || !fs.existsSync(inputs.path)) {
    console.error(`Invalid input path: ${inputs.path}`);
    process.exit(1);
  }

  const mainPackageJsons = findPackageFiles(inputs.path);
  if (mainPackageJsons.length) {
    files.push(...mainPackageJsons);
  }

  const subPackagesPath = path.join(inputs.path, 'packages');
  if (fs.existsSync(subPackagesPath)) {
    fs.readdirSync(subPackagesPath).forEach(fileName => {
      const filePath = path.join(subPackagesPath, fileName);
      if (fs.statSync(filePath).isDirectory()) {
        const packageJsons = findPackageFiles(filePath);
        if (packageJsons) {
          files.push(...packageJsons);
        }
      }
    });
  }

  return files;
}

function updateDependencyVersions(dependencies, newVersion, sourcePackageName) {
  if (!dependencies) {
    return;
  }

  const updatedDependencies = {};

  Object.keys(dependencies)
    .filter(packageName => packageName.startsWith('@cloudscape-design/'))
    .forEach(packageName => {
      const isPackageLock = typeof dependencies[packageName] !== 'string';
      const previousVersion = isPackageLock ? dependencies[packageName].version : dependencies[packageName];

      // Skip local file dependencies
      if (previousVersion.startsWith('file:')) {
        return;
      }

      // Don't touch this local lerna dependency in test-utils-converter
      if (sourcePackageName === '@cloudscape-design/test-utils-converter' && packageName === '@cloudscape-design/test-utils-core') {
        return;
      }

      const nextVersion = typeof newVersion === 'function' ? newVersion(packageName) : newVersion;

      if (isPackageLock) {
        updatedDependencies[packageName] = { ...dependencies[packageName], version: nextVersion };

        // Remove some additional keys for package-lock.json files
        delete updatedDependencies[packageName].resolved;
        delete updatedDependencies[packageName].integrity;
      } else {
        updatedDependencies[packageName] = nextVersion;
      }
    });

  return { ...dependencies, ...updatedDependencies };
}

export function updatePackageJsons(newVersion) {
  const packageJsons = findAllPackageJsons();
  packageJsons.forEach(filePath => {
    const packageJson = JSON.parse(fs.readFileSync(filePath));
    const packageName = packageJson.name;

    ['dependencies', 'devDependencies'].forEach(dependencyKey => {
      const newDeps = updateDependencyVersions(packageJson[dependencyKey], newVersion, packageName);
      packageJson[dependencyKey] = newDeps;
    });

    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
  });
}
