// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import HelpPanel from '~components/help-panel';

export function HelpContent() {
  return (
    <HelpPanel header="How to use the demo">
      <h3>Client-side validation</h3>
      <ul>
        <li>&quot;Domain name&quot; column does not allow spaces</li>
      </ul>
      <h3>Server side validation</h3>
      <ul>
        <li>Submit the codeword &quot;inline&quot; to show validation message inline</li>
      </ul>
    </HelpPanel>
  );
}
