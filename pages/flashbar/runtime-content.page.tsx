// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import {
  Box,
  Button,
  Checkbox,
  ExpandableSection,
  Flashbar,
  FlashbarProps,
  FormField,
  Select,
  SpaceBetween,
} from '~components';
import awsuiPlugins from '~components/internal/plugins';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type PageContext = React.Context<
  AppContextType<{ loading: boolean; hidden: boolean; stackItems: boolean; type: FlashbarProps.Type }>
>;

awsuiPlugins.flashContent.registerContentReplacer({
  id: 'awsui/flashbar-test-action',
  runReplacer(context, registerReplacement) {
    console.log('mount');

    const doReplace = () => {
      registerReplacement('header', 'original');
      registerReplacement('content', 'original');
      if (context.type === 'error' && context.contentRef.current?.textContent?.match('Access denied')) {
        registerReplacement('header', 'remove');
        registerReplacement('content', container => {
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

const messageTypeOptions = ['error', 'warning', 'info', 'success'].map(type => ({ value: type }));

export default function () {
  const {
    urlParams: { loading = false, hidden = false, stackItems = false, type = 'error' },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const [unrelatedState, setUnrelatedState] = useState(false);

  return (
    <Box margin="m">
      <h1>Flashbar runtime actions</h1>
      <SpaceBetween size="m">
        <SpaceBetween size="s">
          <Checkbox onChange={e => setUrlParams({ loading: e.detail.checked })} checked={loading}>
            Content loading
          </Checkbox>
          <Checkbox onChange={e => setUrlParams({ hidden: e.detail.checked })} checked={hidden}>
            Unmount all
          </Checkbox>
          <Checkbox onChange={e => setUrlParams({ stackItems: e.detail.checked })} checked={stackItems}>
            Stack items
          </Checkbox>
          <Checkbox onChange={e => setUnrelatedState(e.detail.checked)} checked={unrelatedState}>
            Unrelated state
          </Checkbox>
          <FormField label="Message type">
            <Select
              options={messageTypeOptions}
              selectedOption={messageTypeOptions.find(option => option.value === type) ?? messageTypeOptions[0]}
              onChange={e => setUrlParams({ type: e.detail.selectedOption.value as FlashbarProps.Type })}
            />
          </FormField>
        </SpaceBetween>

        <hr />

        <ScreenshotArea gutters={false}>
          {hidden ? null : (
            <Flashbar
              stackItems={stackItems}
              items={[
                {
                  type,
                  statusIconAriaLabel: type,
                  header: 'Header',
                  content: loading ? 'Loading...' : 'Content',
                  action: <Button>Action</Button>,
                },
                {
                  type,
                  statusIconAriaLabel: type,
                  header: 'Header',
                  content: loading ? 'Loading...' : 'There was an error: Access denied because of XYZ',
                  action: <Button>Action</Button>,
                },
              ]}
            />
          )}
        </ScreenshotArea>
      </SpaceBetween>
    </Box>
  );
}
