// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dropdown from '~components/internal/components/dropdown';
import { DropdownOption } from '~components/internal/components/option/interfaces';
import PlainList from '~components/select/parts/plain-list';
import VirtualList from '~components/select/parts/virtual-list';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';

type DemoContext = React.Context<
  AppContextType<{
    expandToViewport?: boolean;
    manyOptions?: boolean;
    virtualScroll?: boolean;
    withHeader?: boolean;
    withGroups?: boolean;
  }>
>;

export default function MultiselectPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const [open, setOpen] = useState(false);

  const ListComponent = urlParams.virtualScroll ? VirtualList : PlainList;
  const ref = useRef(null);

  const numberOfOptions = urlParams.manyOptions ? 50 : 5;
  const options: DropdownOption[] = new Array(numberOfOptions).fill(undefined).map((_, index) => ({
    option: { label: `Option ${index}`, value: index.toString() },
    afterHeader: urlParams.withHeader,
  }));

  return (
    <article>
      <h1>Multiselect with &quot;Select all&quot;</h1>
      <Box padding={{ horizontal: 'l' }}>
        <SpaceBetween size="xxl">
          <SpaceBetween direction="horizontal" size="l">
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.withHeader}
                onChange={e => setUrlParams({ withHeader: e.target.checked })}
              />{' '}
              With header
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.expandToViewport}
                onChange={e => setUrlParams({ expandToViewport: e.target.checked })}
              />{' '}
              Expand to viewport
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.virtualScroll}
                onChange={e => setUrlParams({ virtualScroll: e.target.checked })}
              />{' '}
              Virtual scroll
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!urlParams.manyOptions}
                onChange={e => setUrlParams({ manyOptions: e.target.checked })}
              />{' '}
              Many options
            </label>
          </SpaceBetween>

          <div>
            <Dropdown
              trigger={<Button onClick={() => setOpen(!open)}>Open dropdown</Button>}
              open={open}
              onDropdownClose={() => setOpen(false)}
              expandToViewport={urlParams.expandToViewport}
              header={
                urlParams.withHeader ? (
                  <Box padding="m" fontWeight="bold">
                    Header
                  </Box>
                ) : null
              }
            >
              <ListComponent
                menuProps={{ statusType: 'finished', ref, open }}
                getOptionProps={(option, index) => ({ option: { ...option }, key: index, open })}
                filteredOptions={options}
                filteringValue={''}
                firstOptionSticky={true}
                highlightType={{ type: 'mouse', moveFocus: false }}
                useInteractiveGroups={true}
              />
            </Dropdown>
          </div>
        </SpaceBetween>
      </Box>
    </article>
  );
}
