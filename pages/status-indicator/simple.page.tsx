// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import StatusIndicator, { StatusIndicatorProps } from '~components/status-indicator';

const statusToText: [StatusIndicatorProps.Type, string][] = [
  ['error', 'Error'],
  ['warning', 'Warning'],
  ['success', 'Success'],
  ['info', 'Info'],
  ['stopped', 'Stopped'],
  ['pending', 'Pending'],
  ['in-progress', 'In progress'],
  ['loading', 'Loading'],
  ['gen-ai', 'Generated'],
];

export default function StatusIndicatorScenario() {
  return (
    <article>
      <h1>Status Indicator demo page</h1>
      <ul>
        <li>Status indicator renders the icon with the supplied status text in appropriate color</li>
        <li>Color can be overridden by using colorOverride property</li>
      </ul>
      <div>
        {statusToText.map(([type, text]) => (
          <div key={type}>
            <StatusIndicator type={type} iconAriaLabel={text}>
              {text}
            </StatusIndicator>
          </div>
        ))}
      </div>
      <div>
        {statusToText.map(([type, text]) => (
          <div key={type}>
            <StatusIndicator colorOverride={'green'} type={type} iconAriaLabel={text}>
              {text}
            </StatusIndicator>
          </div>
        ))}
      </div>
    </article>
  );
}
