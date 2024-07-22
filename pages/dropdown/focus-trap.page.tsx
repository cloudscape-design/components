// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import { useState } from 'react';

import { Box, Button, SpaceBetween } from '~components';
import Dropdown from '~components/internal/components/dropdown';

import AppContext, { AppContextType } from '../app/app-context';

type PageContext = React.Context<
  AppContextType<{
    expandToViewport: boolean;
    loopFocus: boolean;
    disableHeader: boolean;
    disableContent: boolean;
    disableFooter: boolean;
  }>
>;

export default function DropdownScenario() {
  const {
    urlParams: {
      expandToViewport = true,
      loopFocus = true,
      disableHeader = false,
      disableContent = false,
      disableFooter = false,
    },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <article>
      <h1>Dropdown focus-trap tests</h1>

      <Box margin="m">
        <SpaceBetween direction="vertical" size="m">
          <label>
            <input
              type="checkbox"
              checked={expandToViewport}
              onChange={event => setUrlParams({ expandToViewport: event.target.checked })}
            />
            expandToViewport
          </label>

          <label>
            <input
              type="checkbox"
              checked={loopFocus}
              onChange={event => setUrlParams({ loopFocus: event.target.checked })}
            />
            loopFocus
          </label>

          <label>
            <input
              type="checkbox"
              checked={disableHeader}
              onChange={event => setUrlParams({ disableHeader: event.target.checked })}
            />
            disableHeader
          </label>

          <label>
            <input
              type="checkbox"
              checked={disableFooter}
              onChange={event => setUrlParams({ disableFooter: event.target.checked })}
            />
            disableFooter
          </label>

          <label>
            <input
              type="checkbox"
              checked={disableContent}
              onChange={event => setUrlParams({ disableContent: event.target.checked })}
            />
            disableContent
          </label>

          <div id="test-target">
            <Dropdown
              trigger={
                <Button className="trigger" onClick={() => setIsOpen(!isOpen)}>
                  Trigger
                </Button>
              }
              open={isOpen}
              onDropdownClose={() => setIsOpen(false)}
              header={
                <div style={{ padding: 8 }}>
                  <Button disabled={disableHeader}>header-1</Button>
                  <Button disabled={disableHeader}>header-2</Button>
                </div>
              }
              footer={
                <div style={{ padding: 8 }}>
                  <Button disabled={disableFooter}>footer-1</Button>
                  <Button disabled={disableFooter}>footer-2</Button>
                </div>
              }
              expandToViewport={expandToViewport}
              loopFocus={loopFocus}
            >
              <div style={{ padding: 8 }}>
                <Button disabled={disableContent}>content-1</Button>
                <Button disabled={disableContent}>content-2</Button>
              </div>
            </Dropdown>
          </div>
        </SpaceBetween>
      </Box>
    </article>
  );
}
