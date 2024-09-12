// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import {
  Alert,
  AlertProps,
  Box,
  Button,
  Checkbox,
  ExpandableSection,
  FormField,
  Select,
  SpaceBetween,
} from '~components';
import awsuiPlugins from '~components/internal/plugins';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type PageContext = React.Context<AppContextType<{ loading: boolean; hidden: boolean; type: AlertProps.Type }>>;

awsuiPlugins.alertContent.registerContentReplacer({
  id: 'awsui/alert-test-action',
  runReplacer(context, replacer) {
    console.log('mount');

    const doReplace = () => {
      replacer.restoreHeader();
      replacer.restoreContent();
      if (context.type === 'error' && context.contentRef.current?.textContent?.match('Access denied')) {
        replacer.hideHeader();
        replacer.replaceContent(container => {
          console.log('render replacement content');
          render(
            <SpaceBetween size="s">
              <Box>---REPLACEMENT--- Access denied message! ---REPLACEMENT---</Box>
              <ExpandableSection headerText="Original message">
                {context.contentRef.current?.textContent}
              </ExpandableSection>
            </SpaceBetween>,
            container
          );
        });
      }
    };

    doReplace();

    return {
      update() {
        console.log('update');
        doReplace();
      },
      unmount({ replacementContentContainer }) {
        console.log('unmount');
        unmountComponentAtNode(replacementContentContainer);
      },
    };
  },
});

const alertTypeOptions = ['error', 'warning', 'info', 'success'].map(type => ({ value: type }));

export default function () {
  const {
    urlParams: { loading = false, hidden = false, type = 'error' },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const [unrelatedState, setUnrelatedState] = useState(false);
  const [contentSwapped, setContentSwapped] = useState(false);

  const content1 = loading ? <Box>Loading...</Box> : <Box>Content</Box>;
  const content2 = loading ? <Box>Loading...</Box> : <Box>There was an error: Access denied because of XYZ</Box>;

  return (
    <Box margin="m">
      <h1>Alert runtime actions</h1>
      <SpaceBetween size="m">
        <SpaceBetween size="s">
          <Checkbox onChange={e => setUrlParams({ loading: e.detail.checked })} checked={loading}>
            Content loading
          </Checkbox>
          <Checkbox onChange={e => setUrlParams({ hidden: e.detail.checked })} checked={hidden}>
            Unmount all
          </Checkbox>
          <Checkbox onChange={e => setUnrelatedState(e.detail.checked)} checked={unrelatedState}>
            Unrelated state
          </Checkbox>
          <Checkbox onChange={e => setContentSwapped(e.detail.checked)} checked={contentSwapped}>
            Swap content
          </Checkbox>
          <FormField label="Alert type">
            <Select
              options={alertTypeOptions}
              selectedOption={alertTypeOptions.find(option => option.value === type) ?? alertTypeOptions[0]}
              onChange={e => setUrlParams({ type: e.detail.selectedOption.value as AlertProps.Type })}
            />
          </FormField>
        </SpaceBetween>

        <hr />

        <ScreenshotArea gutters={false}>
          {hidden ? null : (
            <SpaceBetween size="m">
              <Alert
                type={type}
                statusIconAriaLabel={type}
                dismissAriaLabel="Dismiss"
                header="Header"
                action={<Button>Action</Button>}
              >
                {!contentSwapped ? content1 : content2}
              </Alert>

              <Alert
                type={type}
                statusIconAriaLabel={type}
                dismissAriaLabel="Dismiss"
                header="Header"
                action={<Button>Action</Button>}
              >
                {!contentSwapped ? content2 : content1}
              </Alert>
            </SpaceBetween>
          )}
        </ScreenshotArea>
      </SpaceBetween>
    </Box>
  );
}
