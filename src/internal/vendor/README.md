### What is the src/internal/vendor folder about?

This folder references dependencies which are shipped as bundled dependencies.
Bundling the files is handled by rollup as part of the build process (run TS compile, run rollup which takes the compiled
artifact as input and bundles its dependencies).

When adding (or modifying) a dependency, you need to take care about the additional licences: When we bundle a 3rd party
dependency, we need to add them to our THIRD-PARTY-LICENCES file in the project root.
