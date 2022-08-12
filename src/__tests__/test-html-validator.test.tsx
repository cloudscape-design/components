// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import { expectNoAxeViolations } from '../__a11y__/axe';

describe('html-validator', () => {
  test('html-for', async () => {
    const { container } = render(
      <label htmlFor="not-my-field">
        <span>My field label</span>
        <input id="my-field" />
      </label>
    );

    await expectNoAxeViolations(container);
  });

  test('div-in-label', async () => {
    const { container } = render(
      <label htmlFor="my-field">
        <div>My field label</div>
        <input id="my-field" />
      </label>
    );

    await expectNoAxeViolations(container);
  });
});
