// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Select, { SelectProps } from '~components/select';
import styles from './styles.scss';

const options: SelectProps.Options = [...Array(50)].map((_, index) => ({
  value: `Option ${index}`,
  label: `Option ${index}`,
}));

interface ExtendedWindow extends Window {
  __eventsLog?: string[];
  __clearEvents?: () => void;
}
declare const window: ExtendedWindow;
const appendLog = (text: string) => {
  if (!window.__eventsLog) {
    window.__eventsLog = [];
  }
  window.__eventsLog.push(text);
};
const clearLog = () => (window.__eventsLog = []);
window.__clearEvents = clearLog;

export default function SelectEventsPage() {
  const [selectedOption, setValue] = useState<SelectProps['selectedOption']>(null);
  const [filteringEnabled, setFiltering] = useState(false);
  const [expandToViewport, setExpandToViewport] = useState(false);
  const [expandDropdownWidth, setExpandDropdownWidth] = useState(false);
  return (
    <div style={{ padding: 10 }}>
      <ul>
        <li>Select component has 4 events: onChange, onBlur, onFocus, onLoadItems</li>
      </ul>
      <h1>Select events</h1>
      <div className={styles['flex-container']}>
        <label>
          enable filtering
          <input
            id="filtering"
            type="checkbox"
            checked={filteringEnabled}
            onChange={e => setFiltering(e.target.checked)}
          />
        </label>
        <label>
          expand to viewport
          <input
            id="expand-to-viewport"
            type="checkbox"
            checked={expandToViewport}
            onChange={e => setExpandToViewport(e.target.checked)}
          />
        </label>
        <label>
          expand dropdown width
          <input
            type="checkbox"
            checked={expandDropdownWidth}
            onChange={e => setExpandDropdownWidth(e.target.checked)}
          />
        </label>
        <input aria-label="focusable" id="focusable" />
        <Select
          selectedOption={selectedOption}
          options={options}
          onChange={event => {
            appendLog('onChange');
            setValue(event.detail.selectedOption);
          }}
          onBlur={() => appendLog('onBlur')}
          onFocus={() => appendLog('onFocus')}
          ariaLabel={'events select'}
          filteringType={filteringEnabled ? 'auto' : 'none'}
          expandToViewport={expandToViewport}
          expandDropdownWidth={expandDropdownWidth}
        />
      </div>
    </div>
  );
}
