// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ExpandableSection, { ExpandableSectionProps } from '../../../lib/components/expandable-section';
import createWrapper from '../../../lib/components/test-utils/dom';

import containerStyles from '../../../lib/components/container/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/use-visual-mode'),
  useVisualRefresh: jest.fn().mockReturnValue(true),
}));

const contentContextClass = 'awsui-context-container-accentuated';
const headerClass = containerStyles['header-accentuated'];

test.each<ExpandableSectionProps.Variant>(['container', 'stacked'])(
  'applies the accentuated surfaces to the %s variant',
  variant => {
    const root = renderExpandableSection({ variant, containerVisualVariant: 'accentuated' });
    expect(root).toHaveClass(contentContextClass);
    expect(root.querySelector(`.${headerClass}`)).not.toBeNull();
  }
);

test.each<ExpandableSectionProps.Variant>(['default', 'footer', 'inline', 'navigation'])(
  'ignores the accentuated surfaces on the %s variant',
  variant => {
    const root = renderExpandableSection({ variant, containerVisualVariant: 'accentuated' });
    expect(root).not.toHaveClass(contentContextClass);
    expect(root.querySelector(`.${headerClass}`)).toBeNull();
  }
);

test('does not apply the accentuated surfaces by default', () => {
  const root = renderExpandableSection({ variant: 'container' });
  expect(root).not.toHaveClass(contentContextClass);
  expect(root.querySelector(`.${headerClass}`)).toBeNull();
});

test('does not render the containerVisualVariant prop as a DOM attribute', () => {
  expect(renderExpandableSection({ variant: 'default', containerVisualVariant: 'accentuated' })).not.toHaveAttribute(
    'containervisualvariant'
  );
});

function renderExpandableSection(props: ExpandableSectionProps) {
  const { container } = render(
    <ExpandableSection headerText="Header" {...props}>
      Content
    </ExpandableSection>
  );
  return createWrapper(container).findExpandableSection()!.getElement();
}
