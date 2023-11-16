## React components for Cloudscape Design System

This package contains the source code of the React components for the [Cloudscape Design System](https://cloudscape.design/).

Cloudscape is an open source design system for building intuitive, engaging, and inclusive user experiences at scale. It consists of an extensive set of guidelines to create web applications, along with the design resources and front-end components to streamline implementation.

Cloudscape was built for and is used by [Amazon Web Services (AWS)](https://aws.amazon.com/) products and services. We created it in 2016 to improve the user experience across AWS web applications, and also to help teams implement those applications faster. Since then, we have continued enhancing the system based on customer feedback and research.

Components APIs and guidelines can be found in the [Components section of the Cloudscape website](https://cloudscape.design/components/).

## Getting started
For an in-depth guide on getting started with Cloudscape development, check out the [Cloudscape website](https://cloudscape.design/get-started/integration/using-cloudscape-components/).

### Installation
All Cloudscape packages are available on npm.

```sh
npm install @cloudscape-design/components @cloudscape-design/global-styles
```

### Using Cloudscape components
Here is a basic example that renders a primary button:

```jsx
import Button from '@cloudscape-design/components/button';
import '@cloudscape-design/global-styles/index.css';

function App() {
  return <Button variant="primary">Click me</Button>;
}
```

You can also play around with a small example on CodeSandbox:

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/cloudscape-design-system-react-javascript-ljs1t7)

## Getting help

You can [create bug reports or feature requests](https://github.com/cloudscape-design/components/issues/new/choose), or [start a discussion](https://github.com/cloudscape-design/components/discussions) to ask a question. To minimize duplicates, we recommend that you search for existing bug reports, feature requests, or discussions before initiating a new thread.

## Contributing

The [contribution guidelines](https://github.com/cloudscape-design/components/blob/main/CONTRIBUTING.md) contains information on how to contribute, as well as our support model and versioning strategy.

## License

This project is licensed under the [Apache 2.0 License](/LICENSE).
