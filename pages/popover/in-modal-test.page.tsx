// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Popover from '~components/popover';
import AppContext, { AppContextType } from '../app/app-context';
import SpaceBetween from '~components/space-between';
import Button from '~components/button';
import Modal from '~components/modal';

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

  const [isModalOpened, setModalOpened] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  return (
    <article>
      <h1>Expandable dropdown scenarios</h1>
      <SpaceBetween size="m" direction="horizontal">
        <label>
          <input
            type="checkbox"
            checked={renderWithPortal}
            onChange={e => setUrlParams({ renderWithPortal: !!e.target.checked })}
          />{' '}
          renderWithPortal
        </label>

        <>
          <Button id="show-modal" onClick={() => setModalOpened(true)}>
            Show modal
          </Button>
          <Modal
            header="Sample modal"
            visible={isModalOpened}
            onDismiss={() => setModalOpened(false)}
            closeAriaLabel="Close modal"
            footer="Modal footer"
          >
            <Popover
              id="popover"
              header={buttonClicked ? 'Clicked' : 'Click'}
              content={
                <Button id="inside-button" onClick={() => setButtonClicked(true)}>
                  button
                </Button>
              }
              dismissAriaLabel="Close"
              renderWithPortal={renderWithPortal}
            >
              Show popover
            </Popover>
          </Modal>
        </>
      </SpaceBetween>
    </article>
  );
}
