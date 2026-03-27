# Contributing Guidelines

## Support

Use this repository to [create bug reports or feature requests](https://github.com/cloudscape-design/components/issues/new/choose). You can also [start a discussion](https://github.com/cloudscape-design/components/discussions) to ask a question. We will do our best to reply. To minimize duplicates, we recommend that you search for existing bug reports, feature requests, or discussions before initiating a new thread.

## Documentation

For detailed guides on component conventions, styling, writing tests, supported platforms, and more, see the [General Guide](docs/GENERAL_GUIDE.md).

## How to contribute code

Currently we only accept code contributions for bug fixes. Follow the steps below to clone, build, test, and open a pull request. A code owner will review the pull request and merge it. Once we merge a pull request, we run additional testing internally before publishing artifacts to npm.

Before sending us a pull request, ensure that:

1. You are working against the latest source on the _main_ branch.
2. You check existing open, and recently merged, pull requests to make sure someone else hasn't addressed the problem already.
3. You open an issue to discuss any significant work - we would hate for your time to be wasted.

To send us a pull request:

1. Fork the repository.
2. Modify the source; please focus on the specific change you are contributing. If you also reformat all the code, it will be hard for us to focus on your change.
3. Ensure local tests pass.
4. Commit to your fork using clear commit messages.
5. Send us a pull request, answering any default questions in the pull request interface.
6. Pay attention to any automated CI failures reported in the pull request, and stay involved in the conversation.

GitHub provides additional documentation on [forking a repository](https://help.github.com/articles/fork-a-repo/) and [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

Please note that we do not guarantee that this project can be built on Windows machines.

### First steps

Clone this repository and install the dependencies:

```
git clone git@github.com:cloudscape-design/components.git
cd components
npm install
```

To generate the build artifacts, run the following command:

```
npm run build
```

Then, start the dev-server by running:

```
npm start
```

This will open a webpack-dev-server at http://localhost:8080 and watch for file changes.

### Quick rebuild

To quickly rebuild this package, run `npm run quick-build`. This runs only the source code build, skipping documentation and screenshot testing builds.

### Running tests

```
npm test               # all tests
npm run test:unit      # unit + build-tool tests
npm run test:integ     # integration tests
npm run test:motion    # motion tests
```

For targeting specific files, updating snapshots, ChromeDriver setup, and visual regression tests, see [docs/RUNNING_TESTS.md](docs/RUNNING_TESTS.md).

### Directory layout

See [docs/DIRECTORY_LAYOUT.md](docs/DIRECTORY_LAYOUT.md) for the full repo structure.

## Code of Conduct

This project has adopted the [Amazon Open Source Code of Conduct](https://aws.github.io/code-of-conduct).
For more information see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq) or contact
opensource-codeofconduct@amazon.com with any additional questions or comments.

## Security issue notifications

If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security via our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public github issue.

## Licensing

See the [LICENSE](LICENSE) file for our project's licensing. We will ask you to confirm the licensing of your contribution.
