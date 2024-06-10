// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Tabs, { TabsProps } from '~components/tabs';
import styles from './responsive.scss';
import { ButtonDropdown } from '~components';

export default function TabsDemoPage() {
  const defaultTabs: Array<TabsProps.Tab> = [
    {
      label: 'First tab',
      id: 'first',
      content:
        'Diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      label: 'Second tab',
      id: 'second',
      content:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      label: 'Third tab',
      id: 'third',
      content:
        'Diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      dismissible: true,
      dismissLabel: 'third-tab-dismissible-label',
    },
    {
      label: 'Fourth tab',
      id: 'fourth',
      content:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      label: 'Fifth tab',
      id: 'fifth',
      disabled: true,
      content:
        'Diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      label: 'Sixth tab',
      id: 'sixth',
      content:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      action: (
        <ButtonDropdown
          variant="icon"
          ariaLabel="Query actions"
          items={[
            { id: 'save', text: 'Save', disabled: true },
            { id: 'saveAs', text: 'Save as' },
            { id: 'rename', text: 'Rename', disabled: true },
            { id: 'delete', text: 'Delete', disabled: true },
          ]}
          expandToViewport={true}
        />
      ),
      dismissible: true,
      dismissLabel: 'six-tab-dismissible-label',
    },
  ];

  const [tabsDismissibles, setTabDismissibles] = useState([
    {
      label: 'First tab',
      id: 'first',
      dismissible: true,
      dismissLabel: 'Dismiss message',
      onDismiss: () => setTabDismissibles(prevTabs => prevTabs.slice(1)),
      content: (
        <>
          Diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
          accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
          dolor sit amet.,
        </>
      ),
    },
    {
      label: 'Second tab',
      id: 'second',
      dismissible: true,
      dismissLabel: 'Dismiss message (second tab)',
      onDismiss: () => setTabDismissibles(prevTabs => prevTabs.slice(0, 1)),
      content: (
        <>
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
          dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Stet
          clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.,
        </>
      ),
    },
  ]);

  const extraTab: TabsProps.Tab = {
    label: 'Seventh tab',
    id: 'seventh',
    content:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  };
  const [selectedTab, setSelectedTab] = useState(defaultTabs[0].id);
  const [small, setSmall] = useState(false);
  const [tabs, setTabs] = useState(defaultTabs);

  return (
    <div id="container" className={small ? styles.small : ''}>
      <h1>Tabs</h1>
      <input type="text" id="before" aria-label="before" />
      <form action="/">
        <Tabs
          ariaLabel="General Tabs"
          tabs={tabs}
          activeTabId={selectedTab}
          onChange={event => setSelectedTab(event.detail.activeTabId)}
          i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
        />
      </form>
      <input type="text" id="after" aria-label="after" />
      <button id="size-toggle" onClick={() => setSmall(!small)}>
        Toggle
      </button>
      <button id="add-tab" onClick={() => setTabs(tabs.concat([extraTab]))}>
        Add tab
      </button>
      <Tabs
        id="dismiss-tabs"
        ariaLabel="Dismissible Tabs"
        tabs={tabsDismissibles}
        i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
      />
    </div>
  );
}
