// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ExpandableSection, { ExpandableSectionProps } from '../../../lib/components/expandable-section';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/use-visual-mode'),
  useVisualRefresh: jest.fn().mockReturnValue(true),
}));

const subtleContextClass = 'awsui-context-container-subtle';

test.each<ExpandableSectionProps.Variant>(['container', 'stacked'])(
  'applies the subtle background context to the %s variant',
  variant => {
    expect(renderExpandableSection({ variant, background: 'subtle' })).toHaveClass(subtleContextClass);
  }
);

test.each<ExpandableSectionProps.Variant>(['default', 'footer', 'inline', 'navigation'])(
  'ignores the subtle background on the %s variant',
  variant => {
    expect(renderExpandableSection({ variant, background: 'subtle' })).not.toHaveClass(subtleContextClass);
  }
);

test('does not apply the subtle background context by default', () => {
  expect(renderExpandableSection({ variant: 'container' })).not.toHaveClass(subtleContextClass);
});

test('does not render the background prop as a DOM attribute', () => {
  expect(renderExpandableSection({ variant: 'default', background: 'subtle' })).not.toHaveAttribute('background');
});

function renderExpandableSection(props: ExpandableSectionProps) {
  const { container } = render(
    <ExpandableSection headerText="Header" {...props}>
      Content
    </ExpandableSection>
  );
  return createWrapper(container).findExpandableSection()!.getElement();
}
