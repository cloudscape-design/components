// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import SplitButton, { SplitButtonProps } from '~components/split-button';
import ScreenshotArea from '../utils/screenshot-area';
import { SegmentedControl, SpaceBetween } from '~components';
import { useEffect, useState } from 'react';

const items: SplitButtonProps['items'] = [
  {
    id: 'launch-instance',
    text: 'Launch instance',
  },
  {
    id: 'launch-instance-from-template',
    text: 'Launch instance from template',
    disabledReason: 'No template available',
    disabled: true,
  },
];

export default function SplitButtonPage() {
  const [variant, setVariant] = useState<'normal' | 'primary'>('normal');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      return;
    }
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [loading]);

  return (
    <ScreenshotArea
      disableAnimations={true}
      style={{
        // extra space to include dropdown in the screenshot area
        paddingBottom: 100,
      }}
    >
      <article>
        <h1>Simple SplitButton</h1>
        <SpaceBetween size="xl">
          <SegmentedControl
            label="Variant"
            options={[
              { id: 'normal', text: 'normal' },
              { id: 'primary', text: 'primary' },
            ]}
            selectedId={variant}
            onChange={({ detail }) => setVariant(detail.selectedId as any)}
          />

          <SpaceBetween size="s" direction="horizontal">
            <SplitButton
              id="SplitButton1"
              variant={variant}
              items={items}
              ariaLabel="open dropdown"
              onItemClick={() => setLoading(true)}
              loading={loading}
              loadingText="Loading"
            >
              Launch instance
            </SplitButton>
          </SpaceBetween>
        </SpaceBetween>
      </article>
    </ScreenshotArea>
  );
}
