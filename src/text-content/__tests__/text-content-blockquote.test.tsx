// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TextContent from '../../../lib/components/text-content';

import styles from '../../../lib/components/text-content/styles.css.js';

describe('TextContent blockquote', () => {
  test('renders a blockquote element inside TextContent', () => {
    const { container } = render(
      <TextContent>
        <blockquote>Quoted text</blockquote>
      </TextContent>
    );
    const blockquote = container.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveTextContent('Quoted text');
  });

  test('blockquote is a descendant of the text-content root element', () => {
    const { container } = render(
      <TextContent>
        <blockquote>Quoted text</blockquote>
      </TextContent>
    );
    const root = container.querySelector(`.${styles['text-content']}`);
    expect(root).not.toBeNull();
    expect(root!.querySelector('blockquote')).not.toBeNull();
  });

  test('renders blockquote alongside other content without error', () => {
    expect(() =>
      render(
        <TextContent>
          <p>Before the quote.</p>
          <blockquote>The quoted passage.</blockquote>
          <p>After the quote.</p>
        </TextContent>
      )
    ).not.toThrow();
  });

  test('blockquote content is accessible as text', () => {
    const { getByText } = render(
      <TextContent>
        <blockquote>Accessible quote content</blockquote>
      </TextContent>
    );
    expect(getByText('Accessible quote content')).toBeInTheDocument();
  });
});
