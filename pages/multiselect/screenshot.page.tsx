// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings, deselectAriaLabel } from './constants';

const options: MultiselectProps.Options = [
  { value: 'first', label: 'Simple' },
  {
    value: 'second',
    label: 'With small icon',
    iconSvg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
        <circle cx="8" cy="8" r="7" />
        <circle cx="8" cy="8" r="3" />
      </svg>
    ),
  },
  { value: 'third', label: 'With big icon icon', description: 'Very big option', iconName: 'heart' },
  {
    label: 'Option group',
    options: [{ value: 'forth', label: 'Nested option' }],
  },
];

export default function () {
  const [selected, setSelected] = useState<MultiselectProps.Options>(options.slice(0, 3));
  const [virtualScroll, setVirtualScroll] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  return (
    <>
      <h1>Multiselect for screenshot</h1>

      <button id="toggle-virtual" onClick={() => setVirtualScroll(vs => !vs)}>
        Toggle virtual scroll
      </button>

      <button id="toggle-error" onClick={() => setShowError(show => !show)}>
        Toggle error
      </button>

      <ScreenshotArea
        style={{
          // extra space to include dropdown in the screenshot area
          paddingBottom: 300,
        }}
      >
        <Multiselect
          placeholder="Select an option"
          selectedOptions={selected}
          options={options}
          filteringType="manual"
          finishedText="End of all results"
          errorText="verylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspacesverylongtextwithoutspaces"
          recoveryText="Retry"
          statusType={showError ? 'error' : 'finished'}
          onChange={event => setSelected(event.detail.selectedOptions)}
          i18nStrings={i18nStrings}
          tokenLimit={2}
          deselectAriaLabel={deselectAriaLabel}
          virtualScroll={virtualScroll}
          ariaLabel="multiselect demo"
          data-testid="multiselect-demo"
        />
      </ScreenshotArea>
    </>
  );
}
