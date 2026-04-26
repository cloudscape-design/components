// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import NavigationBar from '../../../lib/components/navigation-bar';

describe('NavigationBar', () => {
  test('renders content', () => {
    const { container } = render(<NavigationBar content={<span>Hello</span>} />);
    expect(container.querySelector('nav')).toHaveTextContent('Hello');
  });
});
