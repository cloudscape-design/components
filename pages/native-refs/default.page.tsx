// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef, useState } from 'react';

import { Box } from '~components';
import Button from '~components/button';
import Icon from '~components/icon';
import Input from '~components/input';
import KeyValuePairs from '~components/key-value-pairs';
import SpaceBetween from '~components/space-between';
import Textarea from '~components/textarea';

export default function NativeRefsPage() {
  return (
    <Box tagOverride="article" padding={`m`}>
      <h1>Native Element Refs</h1>
      <SpaceBetween size={`xl`}>
        <TextSelectionDemo />
        <ScrollIntoViewDemo />
        <MeasurementDemo />
        <PasteAtCursorDemo />
      </SpaceBetween>
    </Box>
  );
}

/** Use case: Text selection APIs (selectionStart, setSelectionRange) */
function TextSelectionDemo() {
  const [value, setValue] = useState(`Select some of this text`);
  const [selection, setSelection] = useState(``);
  const ref = useRef<any>(null);
  const nativeAttributesRef = useRef<HTMLInputElement | null>(null);

  const getSelection = () => {
    const el = nativeAttributesRef.current;
    if (el) {
      const selected = value.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0);
      setSelection(selected || `(nothing selected)`);
    }
  };

  const selectFirstWord = () => {
    const el = nativeAttributesRef.current;
    if (el) {
      const firstSpace = value.indexOf(` `);
      el.setSelectionRange(0, firstSpace > 0 ? firstSpace : value.length);
      el.focus();
    }
  };

  const focusViaRef = () => {
    ref.current?.focus();
  };

  const selectViaRef = () => {
    ref.current?.select();
  };

  return (
    <section>
      <h2>Text selection (with mixed internal and external refs)</h2>
      <p>
        The component <code>ref</code> exposes <code>focus()</code> and <code>select()</code>. The{' '}
        <code>nativeAttributes.ref</code> gives direct access to the <code>&lt;input&gt;</code> element for APIs like{' '}
        <code>selectionStart</code> and <code>setSelectionRange()</code>.
      </p>
      <SpaceBetween size={`s`}>
        <Input
          ref={ref}
          value={value}
          onChange={e => setValue(e.detail.value)}
          nativeInputAttributes={{ ref: nativeAttributesRef }}
        />
        <h3 style={{ margin: `8px 0 4px` }}>ref</h3>
        <SpaceBetween size={`xs`} direction={`horizontal`}>
          <Button onClick={focusViaRef}>{`Focus`}</Button>
          <Button onClick={selectViaRef}>{`Select`}</Button>
        </SpaceBetween>
        <h3 style={{ margin: `8px 0 4px` }}>nativeAttributes.ref</h3>
        <SpaceBetween size={`xs`} direction={`horizontal`}>
          <Button onClick={getSelection}>{`Get selection`}</Button>
          <Button onClick={selectFirstWord}>{`Select first word`}</Button>
        </SpaceBetween>
        {selection && (
          <div>
            Selected: <code>{selection}</code>
          </div>
        )}
      </SpaceBetween>
    </section>
  );
}

/** Use case: scrollIntoView */
function ScrollIntoViewDemo() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const scrollToButton = () => {
    buttonRef.current?.scrollIntoView({ behavior: `smooth`, block: `center` });
  };

  return (
    <section>
      <h2>Imperative Scrolling</h2>
      <p>
        Call <code>scrollIntoView()</code> on a Button element via <code>nativeAttributes.ref</code>.
      </p>
      <Button onClick={scrollToButton}>{`Scroll to target button`}</Button>
      <div style={{ height: 200, overflow: `auto`, border: `1px solid #ccc`, borderRadius: 4, marginTop: 8 }}>
        <div
          style={{
            height: 800,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
          }}
        >
          <Button nativeButtonAttributes={{ ref: buttonRef }} variant={`primary`}>{`Target button`}</Button>
        </div>
      </div>
    </section>
  );
}

/** Use case: getBoundingClientRect for measurement */
function MeasurementDemo() {
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const measure = () => {
    const el = iconRef.current;
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  };

  return (
    <section>
      <h2>Element Measurement</h2>
      <p>
        Call <code>getBoundingClientRect()</code> on an Icon via <code>nativeAttributes.ref</code> for tooltip/popover
        positioning.
      </p>
      <SpaceBetween size={`s`}>
        <div>
          <Icon name={`status-info`} nativeAttributes={{ ref: iconRef }} /> ← measure this icon
        </div>
        <Button onClick={measure}>{`Measure icon`}</Button>
        {rect && (
          <KeyValuePairs
            columns={2}
            items={[
              {
                type: `group`,
                title: `Position`,
                items: [
                  { label: `x`, value: `${Math.round(rect.x)}` },
                  { label: `y`, value: `${Math.round(rect.y)}` },
                ],
              },
              {
                type: `group`,
                title: `Size`,
                items: [
                  { label: `width`, value: `${Math.round(rect.width)}` },
                  { label: `height`, value: `${Math.round(rect.height)}` },
                ],
              },
            ]}
          />
        )}
      </SpaceBetween>
    </section>
  );
}

/** Use case: paste at cursor in Textarea */
function PasteAtCursorDemo() {
  const [value, setValue] = useState(`Place your cursor anywhere in this text and click insert.`);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (cursorPosition !== null) {
      const el = textareaRef.current;
      if (el) {
        el.setSelectionRange(cursorPosition, cursorPosition);
        el.focus();
      }
      setCursorPosition(null);
    }
  }, [cursorPosition]);

  const insertAtCursor = () => {
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const inserted = `[INSERTED]`;
      const next = value.slice(0, start) + inserted + value.slice(end);
      setValue(next);
      setCursorPosition(start + inserted.length);
    }
  };

  return (
    <section>
      <h2>Paste at Cursor</h2>
      <p>
        Insert text at the cursor position in a <code>Textarea</code> via <code>nativeAttributes.ref</code> and retain
        cursor position.
      </p>
      <SpaceBetween size={`s`}>
        <Textarea
          value={value}
          onChange={e => setValue(e.detail.value)}
          nativeTextareaAttributes={{ ref: textareaRef }}
        />
        <Button onClick={insertAtCursor}>{`Insert at cursor`}</Button>
      </SpaceBetween>
    </section>
  );
}
