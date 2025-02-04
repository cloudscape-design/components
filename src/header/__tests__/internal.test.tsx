// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import InternalHeader from '../../../lib/components/header/internal';
import createWrapper from '../../../lib/components/test-utils/dom';

describe('InternalHeader', () => {
  test('tabindex attribute is not set when not provided', () => {
    render(<InternalHeader variant="h3">h3 title</InternalHeader>);
    const headerElement = createWrapper().find('h3')!.getElement();
    expect(headerElement).not.toHaveAttribute('tabindex');
  });

  test('heading tag is focusable via ref', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(
      <InternalHeader variant="h3" __headingTagTabIndex={-1} __headingTagRef={ref}>
        h3 title
      </InternalHeader>
    );
    const headerElement = createWrapper().find('h3')!.getElement();
    expect(headerElement).toHaveTextContent('h3 title');
    expect(headerElement).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).not.toBe(headerElement);
    ref.current?.focus();
    expect(document.activeElement).toBe(headerElement);
  });
});
