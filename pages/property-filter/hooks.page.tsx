// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import PropertyFilter from '~components/property-filter';
import Table from '~components/table';
import Button from '~components/button';
import Box from '~components/box';
import Header from '~components/header';
import ScreenshotArea from '../utils/screenshot-area';
import { allItems, TableItem } from './table.data';
import { columnDefinitions, i18nStrings, filteringProperties } from './common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';

export default function () {
  const [tokenLimit, setTokenLimit] = useState<number>();
  const [hideOperations, setHideOperations] = useState<boolean>(false);
  const [disableFreeTextFiltering, setDisableFreeText] = useState<boolean>(false);
  const { items, collectionProps, actions, propertyFilterProps } = useCollection(allItems, {
    propertyFiltering: {
      empty: 'empty',
      noMatch: (
        <Box textAlign="center" color="inherit">
          <Box variant="strong" textAlign="center" color="inherit">
            No matches
          </Box>
          <Box variant="p" padding={{ bottom: 's' }} color="inherit">
            We can’t find a match.
          </Box>
          <Button
            onClick={() => actions.setPropertyFiltering({ tokens: [], operation: propertyFilterProps.query.operation })}
          >
            Clear filter
          </Button>
        </Box>
      ),
      filteringProperties,
    },
    sorting: {},
  });

  return (
    <ScreenshotArea disableAnimations={true}>
      <ul>
        <li>
          <label>
            Token limit
            <input
              type="number"
              value={tokenLimit === undefined ? '' : tokenLimit}
              onChange={e => setTokenLimit(parseInt(e.target.value))}
            />
          </label>
        </li>
        <li>
          <label>
            Toggle hideOperations
            <input type="checkbox" checked={hideOperations} onChange={() => setHideOperations(!hideOperations)} />
          </label>
        </li>
        <li>
          <label>
            Toggle disableFreeTextFiltering
            <input
              type="checkbox"
              checked={disableFreeTextFiltering}
              onChange={() => setDisableFreeText(!disableFreeTextFiltering)}
            />
          </label>
        </li>
      </ul>
      <Table<TableItem>
        header={<Header headingTagOverride={'h1'}>Instances</Header>}
        items={items}
        {...collectionProps}
        filter={
          <PropertyFilter
            {...propertyFilterProps}
            virtualScroll={true}
            countText={`${items.length} matches`}
            i18nStrings={i18nStrings}
            tokenLimit={tokenLimit}
            hideOperations={hideOperations}
            disableFreeTextFiltering={disableFreeTextFiltering}
          />
        }
        columnDefinitions={columnDefinitions}
      />
    </ScreenshotArea>
  );
}
