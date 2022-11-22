### What is the vendor folder about?

This folder contains setup for dependencies which we ship as bundled dependencies.
Bundling the files is handled by rollup as part of the build process (run TS compile, run rollup which takes the compiled
artifact as input and bundles its dependencies).

👉 When adding (or modifying) a dependency, take care about changed licences: When bundling a 3rd party
dependency, it needs to get reflected in the packages THIRD-PARTY-LICENCES file.
