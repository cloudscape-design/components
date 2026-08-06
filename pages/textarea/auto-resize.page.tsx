// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Textarea from '~components/textarea';

export default function TextareaAutoResizePage() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('Line one\nLine two\nLine three');
  const [value3, setValue3] = useState('');

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Textarea — auto-resize</h1>

      <h2>Basic auto-resize (no maxRows)</h2>
      <p>Grows and shrinks freely as you type.</p>
      <Textarea
        id="auto-resize-basic"
        autoResize={true}
        value={value1}
        placeholder="Start typing…"
        ariaLabel="auto-resize basic"
        onChange={event => setValue1(event.detail.value)}
      />

      <h2>Auto-resize with maxRows=5</h2>
      <p>Grows up to 5 rows, then shows a scrollbar.</p>
      <Textarea
        id="auto-resize-max-rows"
        autoResize={true}
        maxRows={5}
        value={value2}
        ariaLabel="auto-resize with maxRows"
        onChange={event => setValue2(event.detail.value)}
      />

      <h2>Fixed rows (autoResize disabled)</h2>
      <p>Standard behavior — rows=3, no auto-resize.</p>
      <Textarea
        id="no-auto-resize"
        autoResize={false}
        rows={3}
        value={value3}
        placeholder="Fixed height textarea"
        ariaLabel="fixed rows"
        onChange={event => setValue3(event.detail.value)}
      />

      <h2>Auto-resize — disabled state</h2>
      <Textarea
        id="auto-resize-disabled"
        autoResize={true}
        disabled={true}
        value="Disabled textarea with auto-resize enabled"
        ariaLabel="auto-resize disabled"
        onChange={() => {
          /* read-only */
        }}
      />

      <h2>Auto-resize — read-only state</h2>
      <Textarea
        id="auto-resize-readonly"
        autoResize={true}
        readOnly={true}
        value={'Read-only textarea\nwith two lines of content'}
        ariaLabel="auto-resize read-only"
        onChange={() => {
          /* read-only */
        }}
      />
    </div>
  );
}
