// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import HelpPanel from '~components/help-panel';

const rgba2hex = (rgba: string) => {
  const match = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/);
  if (!match) {
    return rgba;
  }
  return `#${match
    .slice(1)
    .map((n, i) => {
      const number = i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return number.toString(16).padStart(2, '0').replace('NaN', '');
    })
    .join('')}`;
};

export function ColorPicker({
  value: externalValue,
  onChange,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const dropperRef = useRef<HTMLDivElement>(null);
  const [parsedValue, setParsedValue] = useState('');

  useEffect(() => {
    if (!dropperRef.current || externalValue.indexOf('var(') !== 0) {
      return;
    }
    const { backgroundColor } = getComputedStyle(dropperRef.current);
    setParsedValue(rgba2hex(backgroundColor));
  }, [externalValue]);

  const value = externalValue.indexOf('var(') !== 0 ? externalValue : parsedValue;

  return (
    <>
      <div style={{ backgroundColor: externalValue }} ref={dropperRef} />
      <input type="color" value={value} onChange={onChange} />
    </>
  );
}

export function HelpContent() {
  return (
    <HelpPanel header="How to use the demo">
      <h3>Client-side validation</h3>
      <ul>
        <li>&quot;Label&quot; column does not allow spaces</li>
      </ul>
      <h3>Server side validation</h3>
      <ul>
        <li>Submit the codeword &quot;inline&quot; to show validation message inline</li>
      </ul>
    </HelpPanel>
  );
}
