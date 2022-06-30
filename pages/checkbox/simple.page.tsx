// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Checkbox from '~components/checkbox';

export default function CheckboxSimpleScenario() {
  const [state, setState] = useState({ checked: false, indeterminate: false });
  return (
    <>
      <h1>Checkboxes demo</h1>
      <Checkbox
        id="main"
        checked={state.checked}
        indeterminate={state.indeterminate}
        onChange={event => {
          const { checked, indeterminate } = event.detail;
          setState({ ...state, checked, indeterminate });
        }}
      >
        Sample checkbox
      </Checkbox>
      <Checkbox
        checked={state.indeterminate}
        onChange={event => setState({ ...state, indeterminate: event.detail.checked })}
      >
        Make the first checkbox indeterminate
      </Checkbox>
      <Checkbox checked={false} disabled={true}>
        Unchecked and disabled
      </Checkbox>
      <Checkbox checked={true} disabled={true}>
        Checked and disabled
      </Checkbox>
    </>
  );
}
