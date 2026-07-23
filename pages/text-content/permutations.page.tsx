// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import TextContent from '~components/text-content';

import ScreenshotArea from '../utils/screenshot-area';

export default function TextContentPermutations() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <TextContent>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <div>just a div</div>
        <span>just a span</span>

        <p>
          <strong>This is strong text.</strong> <em>This is emphasized text.</em>{' '}
          <small>
            This is small text <a href="#">with a link</a>.
          </small>
          <code>this.is_code();</code> <a href="#">I am a full-size link</a>
        </p>
        <div>
          <small>small text</small>
        </div>
        <p>just a paragraph</p>

        <ul>
          <li>This is an item.</li>
          <li>This is another item.</li>
          <li>
            <ul>
              <li>This is a list of items.</li>
              <li>
                <ol>
                  <li>Here is a list of items inside a list of items.</li>
                </ol>
              </li>
            </ul>
          </li>
        </ul>

        <ol>
          <li>This is the first item.</li>
          <li>This is the second item.</li>
          <li>This is the last item.</li>
        </ol>
        <code>This is just some code</code>

        <blockquote>
          This is a blockquote. It uses a left border accent and italic text to visually distinguish quoted content from
          the surrounding body text.
        </blockquote>

        <p>Text after a blockquote.</p>

        <blockquote>
          A longer blockquote that spans multiple lines to verify that the left border accent extends the full height of
          the quoted block and that the padding and margin tokens keep the content comfortably separated from adjacent
          elements.
        </blockquote>
      </TextContent>
    </ScreenshotArea>
  );
}
