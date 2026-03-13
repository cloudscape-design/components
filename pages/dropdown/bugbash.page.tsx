// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useEffect, useState } from 'react';

import Button from '~components/button';
import Checkbox from '~components/checkbox';
import Dropdown from '~components/dropdown';
import FormField from '~components/form-field';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import ListContent from './list-content';

interface OptionType {
  label: string;
  value: string;
}

export default function DropdownBugbash() {
  const [open, setOpen] = useState(false);
  const [expandToViewport, setExpandToViewport] = useState(false);
  const [hasHeader, setHasHeader] = useState(false);
  const [hasFooter, setHasFooter] = useState(false);

  // Handler toggles
  const [enableOnEscape, setEnableOnEscape] = useState(true);
  const [enableOnOutsideClick, setEnableOnOutsideClick] = useState(true);
  const [enableOnFocusEnter, setEnableOnFocusEnter] = useState(false);
  const [enableOnFocusLeave, setEnableOnFocusLeave] = useState(false);

  const [minWidthOption, setMinWidthOption] = useState<OptionType>({ label: 'None', value: 'none' });
  const [maxWidthOption, setMaxWidthOption] = useState<OptionType>({ label: 'None', value: 'none' });
  const [contentSize, setContentSize] = useState<OptionType>({ label: 'Medium (20 items)', value: '20' });
  const [contentWidth, setContentWidth] = useState<OptionType>({ label: 'Short', value: 'short' });

  const widthOptions: OptionType[] = [
    { label: 'None', value: 'none' },
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
    const repeatMap = { short: 1, medium: 5, long: 15, 'extra-long': 30 };
    return repeatMap[width as keyof typeof repeatMap] || 1;
  };

  const getWidthValue = (option: OptionType) => (option.value === 'none' ? undefined : parseInt(option.value, 10));

  const minWidth = getWidthValue(minWidthOption);
  const maxWidth = getWidthValue(maxWidthOption);
  const itemCount = parseInt(contentSize.value, 10);
  const contentRepeat = getContentRepeat(contentWidth.value);

  useEffect(() => {
    setOpen(false);
  }, [expandToViewport, minWidth, maxWidth, itemCount, contentRepeat, hasHeader, hasFooter]);

  const dropdownNode = (
    <Dropdown
      trigger={<Button onClick={() => setOpen(!open)}>{open ? 'Close' : 'Open'} Dropdown</Button>}
      open={open}
      expandToViewport={expandToViewport}
      minWidth={minWidth}
      maxWidth={maxWidth}
      header={hasHeader ? <div style={{ padding: '10px', background: '#f0f0f0' }}>Header</div> : undefined}
      footer={hasFooter ? <div style={{ padding: '10px', background: '#f0f0f0' }}>Footer</div> : undefined}
      content={<ListContent n={itemCount} repeat={contentRepeat} withSpaces={true} />}
      onEscape={enableOnEscape ? () => setOpen(false) : undefined}
      onOutsideClick={enableOnOutsideClick ? () => setOpen(false) : undefined}
      onFocusEnter={enableOnFocusEnter ? () => console.log('onFocusEnter') : undefined}
      onFocusLeave={enableOnFocusLeave ? () => console.log('onFocusLeave') : undefined}
    />
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dropdown Bug Bash</h1>
      <p>Use this page to test dropdown behavior with different prop combinations.</p>

      <div style={{ display: 'flex', gap: '40px', marginTop: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* ── Left panel: controls ── */}
        <div style={{ minWidth: '340px', flexShrink: 0 }}>
          <SpaceBetween size="l">
            {/* Content */}
            <section>
              <h2 style={{ marginBottom: '12px' }}>Content</h2>
              <SpaceBetween size="m">
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
              </SpaceBetween>
            </section>

            {/* Width */}
            <section>
              <h2 style={{ marginBottom: '12px' }}>Width Constraints</h2>
              <SpaceBetween size="m">
                <FormField label="minWidth">
                  <Select
                    selectedOption={minWidthOption}
                    onChange={({ detail }) => setMinWidthOption(detail.selectedOption as OptionType)}
                    options={widthOptions}
                  />
                </FormField>
                <FormField label="maxWidth">
                  <Select
                    selectedOption={maxWidthOption}
                    onChange={({ detail }) => setMaxWidthOption(detail.selectedOption as OptionType)}
                    options={widthOptions}
                  />
                </FormField>
              </SpaceBetween>
            </section>

            {/* Structural props */}
            <section>
              <h2 style={{ marginBottom: '12px' }}>Structural Props</h2>
              <SpaceBetween size="xs">
                <Checkbox checked={expandToViewport} onChange={({ detail }) => setExpandToViewport(detail.checked)}>
                  expandToViewport
                </Checkbox>
                <Checkbox checked={hasHeader} onChange={({ detail }) => setHasHeader(detail.checked)}>
                  Show Header
                </Checkbox>
                <Checkbox checked={hasFooter} onChange={({ detail }) => setHasFooter(detail.checked)}>
                  Show Footer
                </Checkbox>
              </SpaceBetween>
            </section>

            {/* Event handlers */}
            <section>
              <h2 style={{ marginBottom: '12px' }}>Event Handlers</h2>
              <SpaceBetween size="xs">
                <Checkbox checked={enableOnEscape} onChange={({ detail }) => setEnableOnEscape(detail.checked)}>
                  <code>onEscape</code>
                  <span style={{ color: '#666', fontSize: '12px', marginLeft: '6px' }}>→ setOpen(false)</span>
                </Checkbox>
                <Checkbox
                  checked={enableOnOutsideClick}
                  onChange={({ detail }) => setEnableOnOutsideClick(detail.checked)}
                >
                  <code>onOutsideClick</code>
                  <span style={{ color: '#666', fontSize: '12px', marginLeft: '6px' }}>→ setOpen(false)</span>
                </Checkbox>
                <Checkbox checked={enableOnFocusEnter} onChange={({ detail }) => setEnableOnFocusEnter(detail.checked)}>
                  <code>onFocusEnter</code>
                  <span style={{ color: '#666', fontSize: '12px', marginLeft: '6px' }}>→ console.log</span>
                </Checkbox>
                <Checkbox checked={enableOnFocusLeave} onChange={({ detail }) => setEnableOnFocusLeave(detail.checked)}>
                  <code>onFocusLeave</code>
                  <span style={{ color: '#666', fontSize: '12px', marginLeft: '6px' }}>→ console.log</span>
                </Checkbox>
              </SpaceBetween>
            </section>
          </SpaceBetween>
        </div>

        {/* ── Right panel: test area ── */}
        <div style={{ flex: 1 }}>
          <h2>Test Area</h2>

          {expandToViewport ? (
            <>
              <p style={{ color: '#666', fontSize: '13px' }}>
                <strong>expandToViewport=true</strong> — The dropdown is placed inside a small{' '}
                <code>overflow: hidden</code> container. With this prop enabled it should escape the container; without
                it the dropdown would be clipped.
              </p>
              {/* Restricted container that would normally clip the dropdown */}
              <div
                style={{
                  overflow: 'hidden',
                  border: '2px dashed #f89',
                  borderRadius: '6px',
                  padding: '16px',
                  height: '120px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  background: '#fff5f5',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    left: '10px',
                    fontSize: '11px',
                    color: '#f89',
                    fontFamily: 'monospace',
                  }}
                >
                  overflow: hidden container
                </span>
                {dropdownNode}
              </div>
            </>
          ) : (
            <>
              <p style={{ color: '#666', fontSize: '13px' }}>
                <strong>expandToViewport=false</strong> — Scroll down to test positioning near the bottom of the
                viewport.
              </p>
              <div style={{ marginTop: '100px', display: 'inline-block' }}>{dropdownNode}</div>
              <div style={{ height: '600px' }} />
              <div style={{ padding: '20px', background: '#f5f5f5' }}>
                Scroll down to test dropdown positioning at bottom of viewport
              </div>
              <div style={{ height: '600px' }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
