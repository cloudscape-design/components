// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef, useState } from 'react';

import Button, { ButtonProps } from '~components/button';
import Dropdown from '~components/dropdown';
import FormField from '~components/form-field';
import Header from '~components/header';
import OptionList, { OptionListProps } from '~components/option-list';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

import styles from './scroll.scss';

/**
 * Where the scrolling happens:
 * - `wrapper`: a wrapper div with a fixed height and `overflow: auto`.
 * - `root`: the same fixed-height class passed to OptionList's `className`, so its root scrolls.
 * - `page`: no container, the page scrolls.
 * - `dropdown`: the list is the content of a Dropdown opened by a button.
 */
type Container = 'wrapper' | 'root' | 'page' | 'dropdown';
type Preselected = 'none' | 'near-end';

type PageContext = React.Context<
  AppContextType<{
    container?: Container;
    expandToViewport?: boolean;
    selectionType?: OptionListProps.SelectionType;
    preselected?: Preselected;
  }>
>;

const options: OptionListProps.Option[] = Array.from({ length: 100 }, (_, index) => ({
  value: `option-${index + 1}`,
  label: `Option ${index + 1}`,
}));

function DropdownOptionList({
  expandToViewport,
  list,
  listRef,
}: {
  expandToViewport: boolean;
  list: (props: { onChange: () => void }) => React.ReactNode;
  listRef: React.RefObject<OptionListProps.Ref>;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<ButtonProps.Ref>(null);

  // Move focus into the list once the Dropdown has rendered its content.
  useEffect(() => {
    if (open) {
      listRef.current?.focus();
    }
  }, [open, listRef]);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  };

  return (
    <Dropdown
      open={open}
      onOutsideClick={() => close(false)}
      onEscape={() => close(true)}
      minWidth={320}
      expandToViewport={expandToViewport}
      trigger={
        <Button
          id="dropdown-trigger"
          ref={triggerRef}
          ariaExpanded={open}
          ariaHaspopup="listbox"
          iconName="caret-down-filled"
          iconAlign="right"
          onClick={() => setOpen(!open)}
        >
          Choose an option
        </Button>
      }
      content={<div className={styles['dropdown-content']}>{list({ onChange: () => close(true) })}</div>}
    />
  );
}

function ConfiguredOptionList({
  container,
  expandToViewport,
  selectionType,
  preselected,
}: {
  container: Container;
  expandToViewport: boolean;
  selectionType: OptionListProps.SelectionType;
  preselected: Preselected;
}) {
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>(
    preselected === 'near-end' ? [options[80]] : []
  );
  const listRef = useRef<OptionListProps.Ref>(null);

  const list = ({ onChange }: { onChange?: () => void } = {}) => (
    <OptionList
      ref={listRef}
      data-testid="option-list"
      className={container === 'root' ? styles['fixed-height'] : undefined}
      ariaLabelledby="option-list-heading"
      selectionType={selectionType}
      options={options}
      selectedOptions={selectedOptions}
      onChange={({ detail }) => {
        setSelectedOptions(detail.selectedOptions);
        onChange?.();
      }}
    />
  );

  return (
    <SpaceBetween size="xs">
      {/* Integ tests click the heading, then press Tab to move keyboard focus into the list. */}
      <Header variant="h2" id="option-list-heading">
        Long list
      </Header>
      {container === 'wrapper' && (
        <div id="scroll-container" className={styles['fixed-height']}>
          {list()}
        </div>
      )}
      {(container === 'root' || container === 'page') && list()}
      {container === 'dropdown' && (
        <DropdownOptionList expandToViewport={expandToViewport} list={list} listRef={listRef} />
      )}
      <div data-testid="selected-value">
        Selected: {selectedOptions.map(option => option.value).join(', ') || 'none'}
      </div>
    </SpaceBetween>
  );
}

export default function OptionListScrollPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const container = urlParams.container ?? 'wrapper';
  const expandToViewport = urlParams.expandToViewport ?? false;
  const selectionType = urlParams.selectionType ?? 'single';
  const preselected = urlParams.preselected ?? 'none';

  return (
    <SimplePage
      title="Option list: scrolling long lists"
      settings={
        <SpaceBetween size="m">
          <FormField label="Scroll container">
            <SegmentedControl
              selectedId={container}
              onChange={({ detail }) => setUrlParams({ container: detail.selectedId as Container })}
              options={[
                { id: 'wrapper', text: 'Wrapper' },
                { id: 'root', text: 'OptionList className' },
                { id: 'page', text: 'Page' },
                { id: 'dropdown', text: 'Dropdown' },
              ]}
            />
          </FormField>
          <FormField label="Expand to viewport (Dropdown only)">
            <SegmentedControl
              selectedId={`${expandToViewport}`}
              onChange={({ detail }) => setUrlParams({ expandToViewport: detail.selectedId === 'true' })}
              options={[
                { id: 'false', text: 'No' },
                { id: 'true', text: 'Yes' },
              ]}
            />
          </FormField>
          <FormField label="Selection type">
            <SegmentedControl
              selectedId={selectionType}
              onChange={({ detail }) =>
                setUrlParams({ selectionType: detail.selectedId as OptionListProps.SelectionType })
              }
              options={[
                { id: 'single', text: 'Single' },
                { id: 'multi', text: 'Multi' },
              ]}
            />
          </FormField>
          <FormField label="Already selected">
            <SegmentedControl
              selectedId={preselected}
              onChange={({ detail }) => setUrlParams({ preselected: detail.selectedId as Preselected })}
              options={[
                { id: 'none', text: 'None' },
                { id: 'near-end', text: 'Option 81' },
              ]}
            />
          </FormField>
        </SpaceBetween>
      }
      screenshotArea={{}}
    >
      <div style={{ maxInlineSize: 520 }}>
        {/* Remount on every configuration change so the initial selection follows the settings. */}
        <ConfiguredOptionList
          key={`${container}-${expandToViewport}-${selectionType}-${preselected}`}
          container={container}
          expandToViewport={expandToViewport}
          selectionType={selectionType}
          preselected={preselected}
        />
      </div>
    </SimplePage>
  );
}
