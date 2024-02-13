// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef, useContext } from 'react';
import { Box, Link, DatePicker } from '~components';
import AppContext, { AppContextType } from '../app/app-context';
import i18nStrings from './i18n-strings';

type DatePickerEventsPageContext = React.Context<AppContextType<{ expandToViewport: boolean }>>;

let blurCount = 0;
let focusCount = 0;
export default function DatePickerScenario() {
  const [value, setValue] = useState('');
  const { urlParams, setUrlParams } = useContext(AppContext as DatePickerEventsPageContext);

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
  const [onChangeDetails, setOnChangeDetails] = useState<string>('');

  return (
    <Box padding="s">
      <h1>Date picker with event handlers</h1>
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
        onChange Event: {changeCount} times. {onChangeDetails !== '' && `Latest detail: ${onChangeDetails}`}
      </div>
      <br />
      <DatePicker
        value={value}
        name={'date-picker-name'}
        ariaLabel={'date-picker-label'}
        locale="en-GB"
        i18nStrings={i18nStrings}
        placeholder={'YYYY/MM/DD'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        expandToViewport={urlParams.expandToViewport}
        onChange={event => {
          setValue(event.detail.value);
          setChangeCount(prevCount => prevCount + 1);
          setOnChangeDetails(event.detail.value);
        }}
        openCalendarAriaLabel={selectedDate =>
          'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
        }
      />
    </Box>
  );
}
