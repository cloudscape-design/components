// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { getAllComponents, requireComponent, supportsDOMProperties } from './utils';
import { getRequiredPropsForComponent } from './required-props-for-components';
import { COMPONENT_METADATA_KEY } from '@cloudscape-design/component-toolkit/internal';
import { pascalCase } from 'change-case';
import { PACKAGE_VERSION } from '../../lib/components/internal/environment';

describe('useBaseComponent hook is used in all allowlisted public components', () => {
  const componentRoot = document.createElement('div');
  document.body.appendChild(componentRoot);

  const runtimeProps: any = {
    modal: {
      modalRoot: componentRoot,
    },
  };

  describe('components not on the to-do list have metadata attached', () => {
    getAllComponents()
      .filter(supportsDOMProperties)
      .forEach(componentName => {
        const { default: Component } = requireComponent(componentName);
        const props = { ...getRequiredPropsForComponent(componentName), ...runtimeProps[componentName] };

        test(`${componentName}: component root DOM node has metadata property attached`, () => {
          const component = <Component {...props} />;
          const { container } = render(component, { container: componentRoot });
          const annotatedNode: any = container.firstChild;

          expect(annotatedNode).not.toBeNull();
          expect(annotatedNode[COMPONENT_METADATA_KEY]?.name).toBe(pascalCase(componentName));
          expect(annotatedNode[COMPONENT_METADATA_KEY]?.version).toBe(PACKAGE_VERSION);
        });

        test(`${componentName}: childs nodes do not have metadata property attached`, () => {
          const component = <Component {...props} />;
          const { container } = render(component, { container: componentRoot });
          const annotatedNode: any = container.firstChild;

          if (annotatedNode.hasChildNodes()) {
            const childNodeWithProperty = getChildNodeWithMetadata(annotatedNode.firstChild);
            expect(childNodeWithProperty).toBeNull();
          }
        });
      });
  });
});

function getChildNodeWithMetadata(rootElement: ChildNode | null) {
  let node = rootElement;
  while (node) {
    if (Object.prototype.hasOwnProperty.call(node, COMPONENT_METADATA_KEY)) {
      return node;
    }
    node = node.firstChild;
  }
  return null;
}
