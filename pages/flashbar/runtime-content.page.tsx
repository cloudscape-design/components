// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ReactNode, useContext, useState } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import flattenChildren from 'react-keyed-flatten-children';

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

const nodeAsString = (node: ReactNode) =>
  flattenChildren(node)
    .map(node => (typeof node === 'object' ? node.props.children : node))
    .filter(node => typeof node === 'string')
    .join('');

awsuiPlugins.flashContent.registerContentReplacer({
  id: 'awsui/flashbar-test-action',
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
  initialCheck(context) {
    return context.type === 'error' && !!nodeAsString(context.content).match('Access denied');
  },
});

const messageTypeOptions = ['error', 'warning', 'info', 'success'].map(type => ({ value: type }));

const content = (
  <>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
    <p>There was an error: Access denied because of XYZ</p>
  </>
);

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
                  content: loading ? 'Loading...' : content,
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
