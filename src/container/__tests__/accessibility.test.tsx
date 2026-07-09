// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Container from '../../../lib/components/container';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/container/styles.css.js';

function renderContainer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return { wrapper: createWrapper(container).findContainer()!, container };
}

describe('Accessibility: scrollable-region-focusable (fitHeight)', () => {
  test('fitHeight=false renders no tabIndex, role, or aria-labelledby on the content wrapper', () => {
    const { wrapper } = renderContainer(<Container header="Header">content</Container>);
    const contentDiv = wrapper.findByClassName(styles.content)!.getElement();
    expect(contentDiv).not.toHaveAttribute('tabindex');
    expect(contentDiv).not.toHaveAttribute('role');
    expect(contentDiv).not.toHaveAttribute('aria-labelledby');
  });

  test('fitHeight=true with no header and no focusable descendants: tabIndex=0, no role, no aria-labelledby', () => {
    const { wrapper } = renderContainer(<Container fitHeight={true}>content</Container>);
    const contentDiv = wrapper.findByClassName(styles['content-fit-height'])!.getElement();
    expect(contentDiv).toHaveAttribute('tabindex', '0');
    expect(contentDiv).not.toHaveAttribute('role');
    expect(contentDiv).not.toHaveAttribute('aria-labelledby');
  });

  test('fitHeight=true with header and no focusable descendants: tabIndex=0, no role, no aria-labelledby', () => {
    const { wrapper } = renderContainer(
      <Container fitHeight={true} header="My Header">
        content
      </Container>
    );
    const contentDiv = wrapper.findByClassName(styles['content-fit-height'])!.getElement();
    expect(contentDiv).toHaveAttribute('tabindex', '0');
    expect(contentDiv).not.toHaveAttribute('role');
    expect(contentDiv).not.toHaveAttribute('aria-labelledby');
  });

  test('fitHeight=true with a focusable descendant: no tabIndex, no role, no aria-labelledby', () => {
    const { wrapper } = renderContainer(
      <Container fitHeight={true} header="My Header">
        <button>Click me</button>
      </Container>
    );
    const contentDiv = wrapper.findByClassName(styles['content-fit-height'])!.getElement();
    expect(contentDiv).not.toHaveAttribute('tabindex');
    expect(contentDiv).not.toHaveAttribute('role');
    expect(contentDiv).not.toHaveAttribute('aria-labelledby');
  });
});
