// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

import { getTextFilterCounterText } from '../../../i18n-strings';
import { TagsResource } from '../../../resources/types';
import { InfoLink } from '../../commons';
import { useAsyncData } from '../../commons/use-async-data';
import { TAGS_COLUMN_DEFINITIONS } from '../details-config';

export function TagsTable({ loadHelpPanelContent }: { loadHelpPanelContent: (value: number) => void }) {
  const [tags, tagsLoading] = useAsyncData<TagsResource['resourceTags'][number]>(async () => {
    const { ResourceTagMappingList } = await window.FakeServer.GetResources();

    return ResourceTagMappingList.reduce(
      (allTags: { key: string; value: string }[], resourceTagMapping: { Tags: { key: string; value: string }[] }) => [
        ...allTags,
        ...resourceTagMapping.Tags,
      ],
      []
    );
  });

  const { items, collectionProps, filteredItemsCount, filterProps, actions } = useCollection(tags, {
    filtering: {
      noMatch: (
        <Box textAlign="center" color="inherit">
          <Box variant="strong" textAlign="center" color="inherit">
            No matches
          </Box>
          <Box variant="p" padding={{ bottom: 's' }} color="inherit">
            No tags matched the search text.
          </Box>
          <Button onClick={() => actions.setFiltering('')}>Clear filter</Button>
        </Box>
      ),
    },
    sorting: {},
  });

  return (
    <Table
      enableKeyboardNavigation={true}
      id="tags-panel"
      columnDefinitions={TAGS_COLUMN_DEFINITIONS}
      items={items}
      {...collectionProps}
      loading={tagsLoading}
      loadingText="Loading tags"
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder="Find tags"
          filteringAriaLabel="Filter tags"
          countText={getTextFilterCounterText(filteredItemsCount!)}
        />
      }
      header={
        <Header
          variant="h2"
          counter={!tagsLoading ? `(${tags.length})` : undefined}
          info={<InfoLink onFollow={() => loadHelpPanelContent(2)} />}
          actions={<Button>Manage tags</Button>}
          description={
            <>
              A tag is a label that you assign to an AWS resource. Each tag consists of a key and an optional value. You
              can use tags to search and filter your resources or track your AWS costs.
            </>
          }
        >
          Tags
        </Header>
      }
    />
  );
}
