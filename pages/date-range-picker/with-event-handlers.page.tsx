// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import { Box, DateRangePicker, DateRangePickerProps, Link } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { i18nStrings, isValid, relativeOptions } from './common';

type DateRangePickerEventsPageContext = React.Context<AppContextType<{ expandToViewport: boolean }>>;

let blurCount = 0;
let focusCount = 0;
export default function DateRangePickerScenario() {
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);
  const { urlParams, setUrlParams } = useContext(AppContext as DateRangePickerEventsPageContext);

  const blurLogDiv = useRef<HTMLDivElement>(null);
  const focusLogDiv = useRef<HTMLDivElement>(null);
  const handleFocus = () => {
    focusCount++;
    if (focusLogDiv.current) {
      focusLogDiv.current.textContent = `onFocus event called ${focusCount} times.`;
    }
  };
  const handleBlur = () => {
    blurCount++;
    if (blurLogDiv.current) {
      blurLogDiv.current.textContent = `onBlur event called ${blurCount} times.`;
    }
  };

  const [changeCount, setChangeCount] = useState(0);
  const [onChangeDetails, setOnChangeDetails] = useState<DateRangePickerProps['value']>({
    type: 'absolute',
    startDate: '2018-01-09T12:34:56Z',
    endDate: '2018-01-19T15:30:00',
  });

  return (
    <Box padding="s">
      <h1>Date range picker with event handlers</h1>
      <label>
        <input
          type="checkbox"
          checked={urlParams.expandToViewport}
          onChange={event => setUrlParams({ expandToViewport: event.target.checked })}
        />
        expandToViewport
      </label>
      <br />
      <Link id="focus-dismiss-helper">Focusable element</Link>
      <br />
      <div id="onFocusEvent" ref={focusLogDiv}>
        onFocus event called 0 times.
      </div>
      <div id="onBlurEvent" ref={blurLogDiv}>
        onBlur event called 0 times.
      </div>
      <div id="onChangeEvent">
        onChange Event: {changeCount} times. Latest detail: {JSON.stringify(onChangeDetails)}
      </div>
      <br />
      <DateRangePicker
        value={value}
        locale={'en-GB'}
        i18nStrings={i18nStrings}
        timeOffset={0}
        placeholder={'Filter by a date and time range'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={event => {
          setValue(event.detail.value);
          setChangeCount(prevCount => prevCount + 1);
          setOnChangeDetails(event.detail.value);
        }}
        relativeOptions={relativeOptions}
        isValidRange={isValid}
        expandToViewport={urlParams.expandToViewport}
      />
    </Box>
  );
}
