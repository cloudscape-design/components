// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import '../__a11y__/to-validate-a11y';

describe('html-validator', () => {
  test('valid', async () => {
    const { container } = render(
      <div>
        <label htmlFor="my-field">
          <span>My field label</span>
        </label>
        <input id="my-field" type="text" />
      </div>
    );

    await expect(container).toValidateA11y();
  });

  test('html-for', async () => {
    const { container } = render(
      <label htmlFor="not-my-field">
        <span>My field label</span>
        <input id="my-field" type="text" />
      </label>
    );

    await expect(container).toValidateA11y();
  });

  test('multiple', async () => {
    const { container } = render(
      <label htmlFor="my-field">
        <div>My field label</div>
        <input id="my-field" aria-labelledby="random-id" role="dialog" />
      </label>
    );

    await expect(container).toValidateA11y();
  });
});
