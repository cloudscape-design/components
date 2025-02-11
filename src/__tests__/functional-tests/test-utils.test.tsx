// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// The test-utils directory is compiled in a separate TypeScript task than the rest
// of the project. To make use of the generated wrapper file, tests live outside
// of the test-utils folder.
import React from 'react';
import { render } from 'react-dom';
import { render as renderTestingLibrary } from '@testing-library/react';
import { pascalCase } from 'change-case';

import { clearVisualRefreshState } from '@cloudscape-design/component-toolkit/internal/testing';

import { Modal } from '../../../lib/components';
import Button from '../../../lib/components/button';
import createWrapperDom, { ElementWrapper as DomElementWrapper } from '../../../lib/components/test-utils/dom';
import createWrapperSelectors from '../../../lib/components/test-utils/selectors';
import { getRequiredPropsForComponent } from '../required-props-for-components';
import { getAllComponents, requireComponent } from '../utils';

const globalWithFlags = globalThis as any;

beforeEach(() => {
  globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;
});

afterEach(() => {
  delete globalWithFlags[Symbol.for('awsui-visual-refresh-flag')];
  clearVisualRefreshState();
});

const componentWithMultipleRootElements = ['top-navigation', 'app-layout', 'app-layout-toolbar'];
const componentsWithExceptions = ['annotation-context', ...componentWithMultipleRootElements];
const components = getAllComponents().filter(component => !componentsWithExceptions.includes(component));

const RENDER_COMPONENTS_DEFAULT_PROPS: Record<string, unknown>[] = [
  {
    'data-testid': 'first-item',
    'data-name': 'first item',
  },
  {
    'data-testid': 'second-item',
    'data-name': 'second item',
  },
];

function renderModal(props = RENDER_COMPONENTS_DEFAULT_PROPS) {
  const root = document.createElement('div');
  document.body.appendChild(root);

  return renderTestingLibrary(
    <div>
      {props.map(({ ...customProps }, index) => (
        <Modal key={index} visible={true} modalRoot={root} {...customProps} />
      ))}
    </div>,
    { container: root }
  );
}

function renderComponents(componentName: string, props = RENDER_COMPONENTS_DEFAULT_PROPS) {
  if (componentName === 'modal') {
    return renderModal(props);
  }

  const { default: Component } = requireComponent(componentName);
  const defaultProps = getRequiredPropsForComponent(componentName);
  return renderTestingLibrary(
    <div>
      {props.map(({ ...customProps }, index) => (
        <Component key={index} {...defaultProps} {...customProps} />
      ))}
    </div>
  );
}

function getComponentSelectors(componentName: string) {
  const componentNamePascalCase = pascalCase(componentName);
  const findAllRegex = new RegExp(`findAll${componentNamePascalCase}.*`);

  // The same set of selector functions are present in both dom and selectors.
  // For this reason, looking into DOM is representative of both groups.
  const wrapperPropsList = Object.keys(DomElementWrapper.prototype);

  // Every component has the same set of selector functions.
  // For this reason, casting the function names into the Alert component.
  const findName = `find${componentNamePascalCase}` as 'findAlert';
  const findAllName = wrapperPropsList.find(selector => findAllRegex.test(selector)) as 'findAllAlerts';

  return { findName, findAllName };
}

describe('createWrapper', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('given attached node when creating a wrapper then no warning is printed', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(React.createElement(Button), container);

    createWrapperDom(container);

    expect(spy).not.toBeCalled();
  });

  test('given detached node when creating a wrapper then a warning is printed', () => {
    const container = document.createElement('div');
    render(React.createElement(Button), container);

    createWrapperDom(container);

    expect(spy).toBeCalledTimes(1);
  });

  test('given node rendered with "@testing-library/react" when creating a wrapper then no warning is printed', () => {
    const { container } = renderTestingLibrary(React.createElement(Button));

    createWrapperDom(container);

    expect(spy).not.toBeCalled();
  });
});

describe.each(components)('ElementWrapper selectors for %s component', componentName => {
  const { findName, findAllName } = getComponentSelectors(componentName);

  describe('dom wrapper', () => {
    test(`${findName} returns the first ${componentName}`, () => {
      const { container } = renderComponents(componentName);
      const wrapper = createWrapperDom(container);
      const element = wrapper[findName]()!.getElement();

      expect(element).toHaveAttribute('data-name', 'first item');
    });

    test(`${findAllName} returns all of the ${componentName} components`, () => {
      const { container } = renderComponents(componentName);
      const wrapper = createWrapperDom(container);
      const elementNameAttributes = wrapper[findAllName]().map(component =>
        component!.getElement().getAttribute('data-name')
      );

      expect(elementNameAttributes).toEqual(['first item', 'second item']);
    });

    test(`${findAllName} returns only the matching ${componentName} components, when a selector is specified`, () => {
      const { container } = renderComponents(componentName, [
        { className: 'first-type', 'data-name': 'first item' },
        { className: 'second-type', 'data-name': 'second item' },
        { className: 'second-type', 'data-name': 'third item' },
      ]);
      const wrapper = createWrapperDom(container);
      const elementNameAttributes = wrapper[findAllName]('.second-type').map(component =>
        component!.getElement().getAttribute('data-name')
      );

      expect(elementNameAttributes).toEqual(['second item', 'third item']);
    });
  });

  describe('selectors wrapper', () => {
    test(`${findName} returns a selector that matches the ${componentName}`, () => {
      const { container } = renderComponents(componentName);
      const wrapper = createWrapperSelectors();
      const selector = wrapper[findName]().toSelector();
      const element = container.querySelector(selector);

      expect(element).toHaveAttribute('data-name', 'first item');
    });

    test(`${findAllName} returns a selector that matches the ${componentName} with nth-child index`, () => {
      const { container } = renderComponents(componentName);
      const wrapper = createWrapperSelectors();
      const selector = wrapper[findAllName]().get(2).toSelector();
      const element = container.querySelector(selector);

      expect(element).toHaveAttribute('data-name', 'second item');
    });

    test(`${findAllName} appends the specified selector to the default ${componentName} selectors`, () => {
      const { container } = renderComponents(componentName, [
        { className: 'first-type', 'data-name': 'first item' },
        { className: 'second-type', 'data-name': 'second item' },
      ]);
      const wrapper = createWrapperSelectors();
      const firstElement = container.querySelector(wrapper[findAllName]('.second-type').get(1).toSelector());
      const secondElement = container.querySelector(wrapper[findAllName]('.second-type').get(2).toSelector());

      expect(firstElement).toBeFalsy();
      expect(secondElement).toBeTruthy();
    });
  });
});

describe.each(componentWithMultipleRootElements)('ElementWrapper selectors for %s component', componentName => {
  const { findName, findAllName } = getComponentSelectors(componentName);

  describe('dom wrapper', () => {
    test(`${findName} returns the first ${componentName}`, () => {
      const { container } = renderComponents(componentName);
      const wrapper = createWrapperDom(container);
      const element = wrapper[findName]()!.getElement();

      expect(element.closest('[data-name]')).toHaveAttribute('data-name', 'first item');
    });

    test(`${findAllName} returns all of the ${componentName} components`, () => {
      const { container } = renderComponents(componentName);
      const wrapper = createWrapperDom(container);
      const elementNameAttributes = wrapper[findAllName]().map(component =>
        component!.getElement()!.closest('[data-name]')!.getAttribute('data-name')
      );

      expect(elementNameAttributes).toEqual(['first item', 'second item']);
    });
  });

  describe('selectors wrapper', () => {
    test(`${findName} returns a selector that matches the ${componentName}`, () => {
      const { container } = renderComponents(componentName);
      const wrapper = createWrapperSelectors();
      const selector = wrapper[findName]().toSelector();
      const element = container.querySelector(selector);

      expect(element!.closest('[data-name]')).toHaveAttribute('data-name', 'first item');
    });

    test(`${findAllName} returns a selector that matches the ${componentName}`, () => {
      const { container } = renderComponents(componentName);
      const wrapper = createWrapperSelectors();
      const selector = wrapper[findAllName]().toSelector();
      const element = container.querySelector(selector);

      expect(element!.closest('[data-name]')).toHaveAttribute('data-name', 'first item');
    });
  });
});
