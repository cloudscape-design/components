// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

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
 * - `page`: no container, the page scrolls.
 * - `wrapper-fixed`: a wrapper div with a fixed height and `overflow: auto`.
 * - `wrapper-max`: a wrapper div with a max height and `overflow: auto`.
 * - `root`: the same fixed-height class passed to OptionList's `className`, so its root scrolls.
 */
type Container = 'page' | 'wrapper-fixed' | 'wrapper-max' | 'root';

/**
 * Which options are selected when the list renders. `several` selects the option near the end first and option 3
 * second, so selection order differs from list order (relevant to which option focus entry highlights in multi).
 */
type Preselected = 'none' | 'first' | 'middle' | 'near-end' | 'last' | 'several';

type PageContext = React.Context<
  AppContextType<{
    container?: Container;
    selectionType?: OptionListProps.SelectionType;
    optionCount?: number;
    preselected?: Preselected;
  }>
>;

const getPreselectedOptions = (
  options: OptionListProps.Options,
  preselected: Preselected
): ReadonlyArray<OptionListProps.Option> => {
  const nearEnd = options[Math.floor(options.length * 0.8)];
  switch (preselected) {
    case 'first':
      return [options[0]];
    case 'middle':
      return [options[Math.floor(options.length / 2)]];
    case 'near-end':
      return [nearEnd];
    case 'last':
      return [options[options.length - 1]];
    case 'several':
      return [nearEnd, options[2]];
    default:
      return [];
  }
};

const containerClassName: Record<Exclude<Container, 'page'>, string> = {
  'wrapper-fixed': styles['fixed-height'],
  'wrapper-max': styles['max-height'],
  root: styles['fixed-height'],
};

const createOptions = (count: number): OptionListProps.Options =>
  Array.from({ length: count }, (_, index) => ({ value: `option-${index + 1}`, label: `Option ${index + 1}` }));

function ConfiguredOptionList({
  container,
  selectionType,
  options,
  preselected,
}: {
  container: Container;
  selectionType: OptionListProps.SelectionType;
  options: OptionListProps.Options;
  preselected: Preselected;
}) {
  // The initial selection checks that focus entry scrolls to the selected option.
  const [selectedOptions, setSelectedOptions] = useState<ReadonlyArray<OptionListProps.Option>>(() =>
    getPreselectedOptions(options, preselected)
  );

  const list = (
    <OptionList
      data-testid="option-list"
      className={container === 'root' ? containerClassName.root : undefined}
      ariaLabelledby="option-list-heading"
      selectionType={selectionType}
      options={options}
      selectedOptions={selectedOptions}
      onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
    />
  );

  return (
    <SpaceBetween size="xs">
      {/* Integ tests click the heading, then press Tab to move keyboard focus into the list. */}
      <Header variant="h2" id="option-list-heading">
        Long list
      </Header>
      {container === 'page' || container === 'root' ? (
        list
      ) : (
        <div id="scroll-container" className={containerClassName[container]}>
          {list}
        </div>
      )}
      <div data-testid="selected-value">
        Selected: {selectedOptions.map(option => option.value).join(', ') || 'none'}
      </div>
    </SpaceBetween>
  );
}

export default function OptionListScrollPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const container = urlParams.container ?? 'wrapper-fixed';
  const selectionType = urlParams.selectionType ?? 'single';
  const optionCount = Number(urlParams.optionCount ?? 100);
  const preselected = urlParams.preselected ?? 'none';
  const options = createOptions(optionCount);

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
                { id: 'page', text: 'Page' },
                { id: 'wrapper-fixed', text: 'Wrapper, fixed height' },
                { id: 'wrapper-max', text: 'Wrapper, max height' },
                { id: 'root', text: 'OptionList className' },
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
          <FormField label="Number of options">
            <SegmentedControl
              selectedId={`${optionCount}`}
              onChange={({ detail }) => setUrlParams({ optionCount: Number(detail.selectedId) })}
              options={[
                { id: '10', text: '10' },
                { id: '100', text: '100' },
                { id: '1000', text: '1000' },
              ]}
            />
          </FormField>
          <FormField
            label="Already selected"
            description="Several selects the option near the end first, then option 3. Single selection uses only the first."
          >
            <SegmentedControl
              selectedId={preselected}
              onChange={({ detail }) => setUrlParams({ preselected: detail.selectedId as Preselected })}
              options={[
                { id: 'none', text: 'None' },
                { id: 'first', text: 'First' },
                { id: 'middle', text: 'Middle' },
                { id: 'near-end', text: 'Near end' },
                { id: 'last', text: 'Last' },
                { id: 'several', text: 'Several' },
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
          key={`${container}-${selectionType}-${optionCount}-${preselected}`}
          container={container}
          selectionType={selectionType}
          options={options}
          preselected={preselected}
        />
      </div>
    </SimplePage>
  );
}
