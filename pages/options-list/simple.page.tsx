// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import OptionsList from '~components/internal/components/options-list';
import Dropdown from '~components/internal/components/dropdown';
import Button from '~components/button';
import { useCallback, useState } from 'react';

interface ExtendedWindow extends Window {
  __loadMoreCalls?: number;
}
declare const window: ExtendedWindow;

const handleLoadMore = () => {
  window.__loadMoreCalls = window.__loadMoreCalls ? window.__loadMoreCalls + 1 : 1;
};

export default function OptionsListScenario() {
  const [open, setOpen] = useState(false);
  const toggleDropdown = useCallback(() => setOpen(!open), [open]);
  return (
    <article>
      <h1>Options list</h1>
      <ul>
        <li>renders the list of options in a scrollable container</li>
        <li>
          fires an <code>onLoadMore</code> event when the content gets scrolled to the end
        </li>
      </ul>
      <Dropdown
        open={open}
        trigger={
          <Button onClick={toggleDropdown} id={'trigger'}>
            Dropdown trigger
          </Button>
        }
        onDropdownClose={toggleDropdown}
      >
        <OptionsList onLoadMore={handleLoadMore} id={'list'} open={open} statusType="pending">
          {[...Array(50)].map((_, index) => (
            <li key={index}>{`Option ${index}`}</li>
          ))}
        </OptionsList>
      </Dropdown>
    </article>
  );
}
