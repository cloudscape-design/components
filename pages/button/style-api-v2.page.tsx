// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import clsx from 'clsx';

import { Button, Checkbox, KeyValuePairs, SpaceBetween } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

type PageContext = React.Context<
  AppContextType<{
    loading?: boolean;
    disabled?: boolean;
    disabledReason?: boolean;
  }>
>;

export default function () {
  const {
    urlParams: { loading = false, disabled = false, disabledReason = false },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const shared = { loading, disabled, disabledReason: disabledReason ? 'Disabled reason' : undefined };
  const disabledStyle = disabled || loading ? styles.disabled : undefined;
  return (
    <SimplePage
      title="Button - Style API v2"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs" direction="horizontal">
          <Checkbox checked={loading} onChange={({ detail }) => setUrlParams({ loading: detail.checked })}>
            loading
          </Checkbox>
          <Checkbox checked={disabled} onChange={({ detail }) => setUrlParams({ disabled: detail.checked })}>
            disabled
          </Checkbox>
          <Checkbox
            checked={disabledReason}
            onChange={({ detail }) => setUrlParams({ disabledReason: detail.checked })}
          >
            disabled reason
          </Checkbox>
        </SpaceBetween>
      }
    >
      <KeyValuePairs
        items={[
          {
            type: 'pair',
            label: 'Danger button',
            value: (
              <Button
                iconName="remove"
                {...shared}
                {...{ classNames: { button: clsx(styles['button-danger'], disabledStyle) } }}
              >
                Delete resource
              </Button>
            ),
          },
          {
            type: 'pair',
            label: 'Circle button',
            value: (
              <Button
                variant="icon"
                iconName="copy"
                ariaLabel="Copy"
                {...shared}
                {...{ classNames: { button: clsx(styles['button-circle'], disabledStyle) } }}
              />
            ),
          },
          {
            type: 'pair',
            label: 'Ghost button',
            value: (
              <Button
                iconName="settings"
                {...shared}
                {...{ classNames: { button: clsx(styles['button-ghost'], disabledStyle) } }}
              >
                Settings
              </Button>
            ),
          },
          {
            type: 'pair',
            label: 'Link button',
            value: (
              <Button variant="link" href="#" external={true} {...{ classNames: { anchor: styles['button-ghost'] } }}>
                Preferences
              </Button>
            ),
          },
        ]}
      />
    </SimplePage>
  );
}
