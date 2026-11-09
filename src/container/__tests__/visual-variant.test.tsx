// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Container, { ContainerProps } from '../../../lib/components/container';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/container/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/use-visual-mode'),
  useVisualRefresh: jest.fn().mockReturnValue(true),
}));

const contentContextClass = 'awsui-context-container-accentuated';
const headerClass = styles['header-accentuated'];

afterEach(() => {
  jest.mocked(useVisualRefresh).mockReturnValue(true);
});

test('applies the accentuated surfaces to the root and the header', () => {
  const wrapper = renderContainer({ visualVariant: 'accentuated' });
  expect(wrapper.getElement()).toHaveClass(contentContextClass);
  expect(wrapper.findHeader()!.getElement()).toHaveClass(headerClass);
});

test('applies the accentuated surfaces to stacked containers', () => {
  const wrapper = renderContainer({ visualVariant: 'accentuated', variant: 'stacked' });
  expect(wrapper.getElement()).toHaveClass(contentContextClass);
  expect(wrapper.findHeader()!.getElement()).toHaveClass(headerClass);
});

test.each<ContainerProps.VisualVariant | undefined>([undefined, 'default'])(
  'does not apply the accentuated surfaces when visualVariant is %s',
  visualVariant => {
    const wrapper = renderContainer({ visualVariant });
    expect(wrapper.getElement()).not.toHaveClass(contentContextClass);
    expect(wrapper.findHeader()!.getElement()).not.toHaveClass(headerClass);
  }
);

test('does not apply the accentuated surfaces in classic', () => {
  jest.mocked(useVisualRefresh).mockReturnValue(false);
  const wrapper = renderContainer({ visualVariant: 'accentuated' });
  expect(wrapper.getElement()).not.toHaveClass(contentContextClass);
  expect(wrapper.findHeader()!.getElement()).not.toHaveClass(headerClass);
});

function renderContainer(props: ContainerProps) {
  const { container } = render(
    <Container header="Header" {...props}>
      Content
    </Container>
  );
  return createWrapper(container).findContainer()!;
}
