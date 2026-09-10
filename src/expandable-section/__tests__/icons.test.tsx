// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import ExpandableSection, { ExpandableSectionProps } from '../../../lib/components/expandable-section';

import styles from '../../../lib/components/expandable-section/styles.css.js';

const icons: ExpandableSectionProps.Icons = {
  expandToggle: ({ expanded }) => <span data-testid={expanded ? 'expanded' : 'collapsed'} />,
};

it('renders the custom expand toggle instead of the default icon', () => {
  const { queryByTestId, container, rerender } = render(<ExpandableSection icons={icons} expanded={true} />);
  expect(queryByTestId('expanded')).toBeTruthy();
  expect(queryByTestId('collapsed')).toBeFalsy();
  // Default-icon presentation (the rotation class) must not apply to the custom icon.
  expect(container.querySelector(`.${styles.icon}`)).toBeFalsy();

  rerender(<ExpandableSection icons={icons} expanded={false} />);
  expect(queryByTestId('expanded')).toBeFalsy();
  expect(queryByTestId('collapsed')).toBeTruthy();
});
