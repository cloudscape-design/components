// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import '../__a11y__/to-validate-a11y';

describe('a11y validator', () => {
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

  test('invalid HTML', async () => {
    const { container } = render(
      <label htmlFor="not-my-field">
        <div>My field label</div>
        <input id="my-field" type="text" />
      </label>
    );
    // TODO: add <div> element is not permitted as content under <label> error when element-permitted-content is enabled
    await expect(expect(container).toValidateA11y()).rejects.toThrow(
      'Expected HTML to be valid but had the following errors:\n1. <label> is associated with multiple controls [multiple-labeled-controls]'
    );
  });

  test('invalid aria attribute value', async () => {
    const { container } = render(
      <label htmlFor="my-field">
        <span>My field label</span>
        <input id="my-field" type="text" aria-labelledby="non-exist-id" />
      </label>
    );
    await expect(expect(container).toValidateA11y()).rejects.toThrow(
      'Expected HTML to be valid but had the following errors:\n1. Fix all of the following:\n  ARIA attribute element ID does not exist on the page: aria-labelledby="non-exist-id" [aria-valid-attr-value]'
    );
  });
});
