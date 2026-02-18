// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useEffect, useState } from 'react';

import Button from '~components/button';
import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';
import Dropdown from '~components/internal/components/dropdown';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import ListContent from './list-content';

interface OptionType {
  label: string;
  value: string;
}

export default function DropdownTestProps() {
  const [open, setOpen] = useState(false);
  const [expandToViewport, setExpandToViewport] = useState(false);
  const [preferCenter, setPreferCenter] = useState(false);
  const [scrollable, setScrollable] = useState(true);
  const [hasHeader, setHasHeader] = useState(false);
  const [hasFooter, setHasFooter] = useState(false);

  const [minWidthOption, setMinWidthOption] = useState<OptionType>({
    label: 'None',
    value: 'none',
  });
  const [maxWidthOption, setMaxWidthOption] = useState<OptionType>({
    label: 'None',
    value: 'none',
  });
  const [contentSize, setContentSize] = useState<OptionType>({
    label: 'Medium (20 items)',
    value: '20',
  });
  const [contentWidth, setContentWidth] = useState<OptionType>({
    label: 'Short',
    value: '1',
  });

  const widthOptions: OptionType[] = [
    { label: 'None', value: 'none' },
    { label: 'Trigger', value: 'trigger' },
    { label: '200px', value: '200' },
    { label: '400px', value: '400' },
    { label: '600px', value: '600' },
  ];

  const contentSizeOptions: OptionType[] = [
    { label: 'Small (5 items)', value: '5' },
    { label: 'Medium (20 items)', value: '20' },
    { label: 'Large (50 items)', value: '50' },
    { label: 'Extra Large (100 items)', value: '100' },
  ];

  const contentWidthOptions: OptionType[] = [
    { label: 'Short', value: 'short' },
    { label: 'Medium', value: 'medium' },
    { label: 'Long', value: 'long' },
    { label: 'Extra Long', value: 'extra-long' },
  ];

  const getContentRepeat = (width: string) => {
    const repeatMap = {
      short: 1,
      medium: 5,
      long: 15,
      'extra-long': 30,
    };
    return repeatMap[width as keyof typeof repeatMap] || 1;
  };

  const getWidthValue = (option: { value: string }) => {
    if (option.value === 'none') {
      return undefined;
    }
    if (option.value === 'trigger') {
      return 'trigger';
    }
    return parseInt(option.value, 10);
  };

  const minWidth = getWidthValue(minWidthOption);
  const maxWidth = getWidthValue(maxWidthOption);
  const itemCount = parseInt(contentSize.value, 10);
  const contentRepeat = getContentRepeat(contentWidth.value);

  // Close dropdown when props change
  useEffect(() => {
    setOpen(false);
  }, [expandToViewport, preferCenter, scrollable, minWidth, maxWidth, itemCount, contentRepeat, hasHeader, hasFooter]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dropdown Props Test Page</h1>
      <p>Use this page to test dropdown behavior with different prop combinations.</p>

      <div style={{ display: 'flex', gap: '40px', marginTop: '30px', flexWrap: 'wrap' }}>
        {/* Controls Panel */}
        <div style={{ minWidth: '300px', flexShrink: 0 }}>
          <SpaceBetween size="m">
            <h3>Dropdown Props</h3>

            <FormField label="Content Size">
              <Select
                selectedOption={contentSize}
                onChange={({ detail }) => setContentSize(detail.selectedOption as OptionType)}
                options={contentSizeOptions}
              />
            </FormField>

            <FormField label="Content Width">
              <Select
                selectedOption={contentWidth}
                onChange={({ detail }) => setContentWidth(detail.selectedOption as OptionType)}
                options={contentWidthOptions}
              />
            </FormField>

            <FormField label="Min Width">
              <Select
                selectedOption={minWidthOption}
                onChange={({ detail }) => setMinWidthOption(detail.selectedOption as OptionType)}
                options={widthOptions}
              />
            </FormField>

            <FormField label="Max Width">
              <Select
                selectedOption={maxWidthOption}
                onChange={({ detail }) => setMaxWidthOption(detail.selectedOption as OptionType)}
                options={widthOptions}
              />
            </FormField>

            <Checkbox checked={expandToViewport} onChange={({ detail }) => setExpandToViewport(detail.checked)}>
              expandToViewport
            </Checkbox>

            <Checkbox checked={preferCenter} onChange={({ detail }) => setPreferCenter(detail.checked)}>
              preferCenter
            </Checkbox>

            <Checkbox checked={scrollable} onChange={({ detail }) => setScrollable(detail.checked)}>
              scrollable
            </Checkbox>

            <Checkbox checked={hasHeader} onChange={({ detail }) => setHasHeader(detail.checked)}>
              Show Header
            </Checkbox>

            <Checkbox checked={hasFooter} onChange={({ detail }) => setHasFooter(detail.checked)}>
              Show Footer
            </Checkbox>
          </SpaceBetween>
        </div>

        {/* Dropdown Test Area */}
        <div style={{ flex: 1 }}>
          <h3>Test Area</h3>
          <div style={{ marginTop: '100px', display: 'inline-block' }}>
            <Dropdown
              trigger={<Button onClick={() => setOpen(!open)}>{open ? 'Close' : 'Open'} Dropdown</Button>}
              open={open}
              expandToViewport={expandToViewport}
              minWidth={minWidth}
              maxWidth={maxWidth}
              preferCenter={preferCenter}
              scrollable={scrollable}
              header={hasHeader ? <div style={{ padding: '10px', background: '#f0f0f0' }}>Header</div> : undefined}
              footer={hasFooter ? <div style={{ padding: '10px', background: '#f0f0f0' }}>Footer</div> : undefined}
              content={<ListContent n={itemCount} repeat={contentRepeat} withSpaces={true} />}
            />
          </div>

          {/* Additional space for scroll testing */}
          <div style={{ height: '600px' }} />
          <div style={{ padding: '20px', background: '#f5f5f5' }}>
            Scroll down to test dropdown positioning at bottom of viewport
          </div>
          <div style={{ height: '600px' }} />
        </div>
      </div>
    </div>
  );
}
