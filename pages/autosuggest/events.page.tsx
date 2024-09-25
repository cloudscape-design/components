// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';

import AppContext, { AppContextType } from '../app/app-context';

import styles from './styles.scss';

type AutosuggestEventsPageContext = React.Context<AppContextType<{ expandToViewport: boolean }>>;

const options: AutosuggestProps.Options = [...Array(50)].map((_, index) => ({
  value: `Option ${index}`,
  label: `Option ${index}`,
}));
const enteredTextLabel = (value: string) => `Use: ${value}`;

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

export default function AutosuggestEventsPage() {
  const [value, setValue] = useState('');
  const { urlParams, setUrlParams } = useContext(AppContext as AutosuggestEventsPageContext);
  return (
    <div style={{ padding: 10 }}>
      <ul>
        <li>
          Autosuggest component has 8 events: onChange, onDelayedChange, onBlur, onFocus, onKeyUp, onKeyDown,
          onRecoveryClick, onLoadMore
        </li>
      </ul>
      <h1>Autosuggest events</h1>
      <label>
        <input
          type="checkbox"
          checked={urlParams.expandToViewport}
          onChange={event => setUrlParams({ expandToViewport: event.target.checked })}
        />{' '}
        expandToViewport
      </label>
      <div className={styles['flex-container']}>
        <input aria-label="focusable" id="focusable" />
        <Autosuggest
          value={value}
          options={options}
          onChange={event => {
            appendLog('onChange');
            setValue(event.detail.value);
          }}
          onSelect={event => appendLog(`onSelect: ${event.detail.value}`)}
          onBlur={() => appendLog('onBlur')}
          onFocus={() => appendLog('onFocus')}
          enteredTextLabel={enteredTextLabel}
          expandToViewport={urlParams.expandToViewport}
          ariaLabel={'events autosuggest'}
          selectedAriaLabel="Selected"
        />
      </div>
    </div>
  );
}
