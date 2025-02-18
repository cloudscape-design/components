// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import { getRequiredPropsForComponent } from '../required-props-for-components';
import { getAllComponents, requireComponent } from '../utils';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  useVisualRefresh: jest.fn().mockReturnValue(true),
}));

beforeEach(() => {
  jest.mocked(useVisualRefresh).mockReturnValue(true);
});

afterEach(() => {
  jest.mocked(useVisualRefresh).mockReset();
});

const skippedComponents = ['button'];

describe('Check outer form submission', () => {
  getAllComponents()
    .filter(componentName => !skippedComponents.includes(componentName))
    .forEach(componentName => {
      const { default: Component } = requireComponent(componentName);
      const requiredProps = getRequiredPropsForComponent(componentName);

      test(componentName, () => {
        const onSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) => {
          // JSDOM doesn't support form submissions, so we need to call preventDefault.
          e.preventDefault();
          // jest.fn accesses the event multiple times to print invocation logs on failure.
          e.persist();
        });

        const { getByTestId } = render(
          <form data-testid="form" onSubmit={onSubmit}>
            <Component {...requiredProps} />
          </form>
        );

        getByTestId('form')
          .querySelectorAll('button')
          .forEach(button => button.click());

        expect(onSubmit).not.toBeCalled();
      });
    });
});
