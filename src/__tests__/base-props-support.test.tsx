// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { getRequiredPropsForComponent } from './required-props-for-components';
import { getAllComponents, requireComponent, supportsDOMProperties } from './utils';

describe('Base props support', () => {
  const componentRoot = document.createElement('div');
  document.body.appendChild(componentRoot);

  const runtimeProps: any = {
    modal: {
      modalRoot: componentRoot,
    },
  };

  getAllComponents()
    .filter(component => supportsDOMProperties(component))
    .forEach(componentName => {
      const { default: Component } = requireComponent(componentName);
      const props = { ...getRequiredPropsForComponent(componentName), ...runtimeProps[componentName] };

      describe(componentName, () => {
        test('should allow className', () => {
          const { container } = render(<Component {...props} className="example" />, { container: componentRoot });
          expect(container.firstElementChild).toHaveClass('example');
        });

        test('should allow id', () => {
          const { container } = render(<Component {...props} id="example" />, { container: componentRoot });
          expect(container.firstElementChild).toHaveAttribute('id', 'example');
        });

        test('should allow data-attributes', () => {
          const { container } = render(<Component {...props} data-testid="example" />, { container: componentRoot });
          expect(container.firstElementChild).toHaveAttribute('data-testid', 'example');
        });

        test('should not allow everything else', () => {
          const { container } = render(<Component {...props} not-allowed={true} />, { container: componentRoot });
          expect(container.firstElementChild).not.toHaveAttribute('not-allowed');
        });

        test('className should not remove previous classes', () => {
          const { container, rerender } = render(<Component {...props} />, { container: componentRoot });
          const classesBefore = new Set(Array.from(container.firstElementChild!.classList));

          rerender(<Component {...props} className="example" />);
          const classesAfter = new Set(Array.from(container.firstElementChild!.classList));

          // Add the example class to the "before" set to make them equal
          classesBefore.add('example');

          expect(classesBefore).toEqual(classesAfter);
        });

        test('className, id and data- properties should only apply to one element', () => {
          const { container } = render(<Component {...props} className="example" id="id" data-testid="data" />, {
            container: componentRoot,
          });
          expect(container.querySelectorAll('.example')).toHaveLength(1);
          expect(container.querySelectorAll('#id')).toHaveLength(1);
          expect(container.querySelectorAll('[data-testid=data]')).toHaveLength(1);
        });
      });
    });
});
