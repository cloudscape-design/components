// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import TreeView from '../../../lib/components/tree-view';

test('renders items', () => {
  const { container } = render(<TreeView items={[{ text: 'one' }, { text: 'two' }]} />);
  const wrapper = createWrapper(container).findTreeView()!;
  expect(wrapper.findAll('li')).toHaveLength(2);
});
