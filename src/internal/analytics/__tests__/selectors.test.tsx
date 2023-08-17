// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import Header from '../../../../lib/components/header';
import Button from '../../../../lib/components/button';
import { getNameFromSelector } from '../../../../lib/components/internal/analytics/selectors';

test('getNameFromSelector ignores the text in buttons', () => {
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    get() {
      return this.textContent;
    },
  });

  render(
    <Header data-testid="test">
      This is the header text<Button>This is the button text</Button>
    </Header>
  );

  expect(getNameFromSelector('[data-testid=test]')).toBe('This is the header text');
});
