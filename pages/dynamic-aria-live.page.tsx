// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import DynamicAriaLive from '~components/internal/components/dynamic-aria-live';
import Button from '~components/button';

export const INITIAL_TEXT = 'Initial text';
export const UPDATED_TEXT = 'Updated text';
export const DELAYED_TEXT = 'Delayed text';
export const SKIPPED_TEXT = 'Skipped text';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function DynamicAriaLivePage() {
  const [text, setText] = useState(INITIAL_TEXT);
  const executeTextUpdate = async () => {
    setText(UPDATED_TEXT);
    setTimeout(() => setText(SKIPPED_TEXT), 1000);
    await sleep(2000);
    setTimeout(() => setText(DELAYED_TEXT), 1000);
    await sleep(3000);
  };

  return (
    <>
      <h1>Dynamic aria live</h1>
      <Button id={'activation-button'} onClick={executeTextUpdate}>
        Start
      </Button>
      <div>{text}</div>
      <DynamicAriaLive delay={4000}>{text}</DynamicAriaLive>
    </>
  );
}
