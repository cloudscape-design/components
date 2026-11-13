// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Container, { ContainerProps } from '../../../lib/components/container';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/use-visual-mode'),
  useVisualRefresh: jest.fn().mockReturnValue(true),
}));

const subtleContextClass = 'awsui-context-container-subtle';

afterEach(() => {
  jest.mocked(useVisualRefresh).mockReturnValue(true);
});

test('applies the subtle background context when background is subtle', () => {
  expect(renderContainer({ background: 'subtle' })).toHaveClass(subtleContextClass);
});

test('applies the subtle background context to stacked containers', () => {
  expect(renderContainer({ background: 'subtle', variant: 'stacked' })).toHaveClass(subtleContextClass);
});

test.each<ContainerProps.Background | undefined>([undefined, 'default'])(
  'does not apply the subtle background context when background is %s',
  background => {
    expect(renderContainer({ background })).not.toHaveClass(subtleContextClass);
  }
);

test('does not apply the subtle background context in classic', () => {
  jest.mocked(useVisualRefresh).mockReturnValue(false);
  expect(renderContainer({ background: 'subtle' })).not.toHaveClass(subtleContextClass);
});

function renderContainer(props: ContainerProps) {
  const { container } = render(
    <Container header="Header" {...props}>
      Content
    </Container>
  );
  return createWrapper(container).findContainer()!.getElement();
}
