// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { Checkbox, KeyValuePairs, Popover } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

type PageContext = React.Context<
  AppContextType<{
    renderWithPortal: boolean;
  }>
>;

export default function () {
  const {
    urlParams: { renderWithPortal = true },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const shared = { header: 'Header', content: 'Popover content with a styled surface and arrow.', renderWithPortal };
  return (
    <SimplePage
      title="Popover - Style API v2"
      screenshotArea={{}}
      settings={
        <Checkbox
          checked={renderWithPortal}
          onChange={({ detail }) => setUrlParams({ renderWithPortal: detail.checked })}
        >
          renderWithPortal
        </Checkbox>
      }
    >
      <KeyValuePairs
        columns={4}
        items={[
          {
            type: 'pair',
            label: 'Brand',
            value: (
              <Popover
                {...shared}
                {...{
                  styleClassNames: {
                    container: styles['popover-brand'],
                    arrow: styles['popover-brand-arrow'],
                    dismissButton: styles['popover-brand-dismiss'],
                  },
                }}
              >
                Open popover
              </Popover>
            ),
          },
          {
            type: 'pair',
            label: 'Info',
            value: (
              <Popover
                {...shared}
                {...{
                  styleClassNames: {
                    container: styles['popover-borderless'],
                    arrow: styles['popover-borderless-arrow'],
                  },
                }}
              >
                Open popover
              </Popover>
            ),
          },
        ]}
      />
    </SimplePage>
  );
}
