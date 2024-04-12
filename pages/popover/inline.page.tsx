// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import AppContext, { AppContextType } from '../app/app-context';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';

type NestedPopoversContext = React.Context<
  AppContextType<{
    renderWithPortal: boolean;
  }>
>;

export default function () {
  const {
    urlParams: { renderWithPortal = true },
    setUrlParams,
  } = useContext(AppContext as NestedPopoversContext);

  return (
    <article>
      <h1>Inline popover</h1>
      <SpaceBetween size="m">
        <label>
          <input
            id="renderWithPortal"
            type="checkbox"
            checked={renderWithPortal}
            onChange={e => setUrlParams({ renderWithPortal: !!e.target.checked })}
          />{' '}
          renderWithPortal
        </label>
        <ScreenshotArea>
          There is a{' '}
          <Popover
            header="Popover header"
            content="Popover content"
            dismissAriaLabel="Close"
            renderWithPortal={renderWithPortal}
          >
            popover
          </Popover>{' '}
          in the middle of a sentence.
        </ScreenshotArea>
      </SpaceBetween>
    </article>
  );
}
