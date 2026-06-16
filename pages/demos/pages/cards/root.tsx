// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useRef, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Cards from '@cloudscape-design/components/cards';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import Flashbar, { FlashbarProps } from '@cloudscape-design/components/flashbar';
import Pagination from '@cloudscape-design/components/pagination';
import SplitPanel from '@cloudscape-design/components/split-panel';
import TextFilter from '@cloudscape-design/components/text-filter';

import { Distribution } from '../../fake-server/types';
import {
  distributionCardsAriaLabels,
  getHeaderCounterText,
  getTextFilterCounterText,
  renderDistributionCardsAriaLive,
} from '../../i18n-strings';
import { FullPageHeader } from '../commons';
import {
  CustomAppLayout,
  DemoTopNavigation,
  GlobalSplitPanelContent,
  Navigation,
  TableEmptyState,
  TableNoMatchState,
  useGlobalSplitPanel,
} from '../commons/common-components';
import DataProvider from '../commons/data-provider';
import { useLocalStorage } from '../commons/use-local-storage';
import { CARD_DEFINITIONS, DEFAULT_PREFERENCES, PAGE_SIZE_OPTIONS, VISIBLE_CONTENT_OPTIONS } from './cards-config';
import { Breadcrumbs, ToolsContent } from './common-components';

import '../../styles/base.scss';
import '../../styles/top-navigation.scss';

function StackedNotifications() {
  const [items, setItems] = useState<FlashbarProps.MessageDefinition[]>([
    {
      type: 'success',
      dismissible: true,
      dismissLabel: 'Dismiss message',
      content: 'This is a success flash message',
      id: 'message_5',
      onDismiss: () => setItems(items => items.filter(item => item.id !== 'message_5')),
    },
    {
      type: 'warning',
      dismissible: true,
      dismissLabel: 'Dismiss message',
      content: 'This is a warning flash message',
      id: 'message_4',
      onDismiss: () => setItems(items => items.filter(item => item.id !== 'message_4')),
    },
    {
      type: 'error',
      dismissible: true,
      dismissLabel: 'Dismiss message',
      header: 'Failed to update instance id-4890f893e',
      content: 'This is a dismissible error message',
      id: 'message_3',
      onDismiss: () => setItems(items => items.filter(item => item.id !== 'message_3')),
    },
  ]);

  return (
    <Flashbar
      items={items}
      stackItems={true}
      i18nStrings={{
        ariaLabel: 'Notifications',
        notificationBarAriaLabel: 'View all notifications',
        notificationBarText: 'Notifications',
        errorIconAriaLabel: 'Error',
        warningIconAriaLabel: 'Warning',
        successIconAriaLabel: 'Success',
        infoIconAriaLabel: 'Info',
        inProgressIconAriaLabel: 'In progress',
      }}
    />
  );
}

interface DetailsCardsProps {
  loadHelpPanelContent: () => void;
}

function DetailsCards({ loadHelpPanelContent }: DetailsCardsProps) {
  const [loading, setLoading] = useState(true);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [preferences, setPreferences] = useLocalStorage('React-Cards-Preferences', DEFAULT_PREFERENCES);
  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    distributions,
    {
      filtering: {
        empty: <TableEmptyState resourceName="Distribution" />,
        noMatch: <TableNoMatchState onClearFilter={() => actions.setFiltering('')} />,
      },
      pagination: { pageSize: preferences?.pageSize },
      selection: {},
    }
  );

  useEffect(() => {
    new DataProvider().getDataWithDates<Distribution>('distributions').then(distributions => {
      setDistributions(distributions);
      setLoading(false);
    });
  }, []);

  return (
    <Cards
      {...collectionProps}
      stickyHeader={true}
      cardDefinition={CARD_DEFINITIONS}
      visibleSections={preferences?.visibleContent}
      loading={loading}
      loadingText="Loading distributions"
      items={items}
      selectionType="multi"
      variant="full-page"
      ariaLabels={distributionCardsAriaLabels}
      renderAriaLive={renderDistributionCardsAriaLive}
      header={
        <FullPageHeader
          selectedItemsCount={collectionProps.selectedItems?.length ?? 0}
          counter={!loading ? getHeaderCounterText(distributions, collectionProps.selectedItems) : undefined}
          onInfoLinkClick={loadHelpPanelContent}
        />
      }
      filter={
        <TextFilter
          {...filterProps}
          filteringAriaLabel="Filter distributions"
          filteringPlaceholder="Find distributions"
          filteringClearAriaLabel="Clear"
          countText={getTextFilterCounterText(filteredItemsCount)}
          disabled={loading}
        />
      }
      pagination={<Pagination {...paginationProps} disabled={loading} />}
      preferences={
        <CollectionPreferences
          title="Preferences"
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          disabled={loading}
          preferences={preferences}
          onConfirm={({ detail }) => setPreferences(detail)}
          pageSizePreference={{
            title: 'Page size',
            options: PAGE_SIZE_OPTIONS,
          }}
          visibleContentPreference={{
            title: 'Select visible columns',
            options: VISIBLE_CONTENT_OPTIONS,
          }}
        />
      }
    />
  );
}

export function App() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();
  const appLayout = useRef<AppLayoutProps.Ref>(null);
  return (
    <>
      <DemoTopNavigation />
      <CustomAppLayout
        ref={appLayout}
        navigation={<Navigation activeHref="#/distributions" />}
        notifications={<StackedNotifications />}
        breadcrumbs={<Breadcrumbs />}
        content={
          <DetailsCards
            loadHelpPanelContent={() => {
              setToolsOpen(true);
              appLayout.current?.focusToolsClose();
            }}
          />
        }
        contentType="cards"
        tools={<ToolsContent />}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={onSplitPanelToggle}
        splitPanelSize={splitPanelSize}
        onSplitPanelResize={onSplitPanelResize}
        splitPanelPreferences={splitPanelPreferences}
        splitPanel={
          <SplitPanel header="Design exploration">
            <GlobalSplitPanelContent />
          </SplitPanel>
        }
        stickyNotifications={true}
      />
    </>
  );
}
