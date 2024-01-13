// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import TextContent from '~components/text-content';
import ScreenshotArea from '../utils/screenshot-area';

export default function TextContentPermutations() {
  return (
    <ScreenshotArea>
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
      </TextContent>
    </ScreenshotArea>
  );
}
