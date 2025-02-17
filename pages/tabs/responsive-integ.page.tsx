// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { ButtonDropdown, Select } from '~components';
import Tabs, { TabsProps } from '~components/tabs';

import AppContext, { AppContextType } from '../app/app-context';

import styles from './responsive.scss';

type TabsContext = React.Context<
  AppContextType<{
    keyboardActivationMode: TabsProps['keyboardActivationMode'];
  }>
>;

export default function TabsDemoPage() {
  const {
    urlParams: { keyboardActivationMode = 'automatic' },
    setUrlParams,
  } = useContext(AppContext as TabsContext);

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
      href: '/second',
      content:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      label: 'Third tab',
      id: 'third',
      content:
        'Diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      dismissible: true,
      dismissLabel: 'Dismiss third tab',
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
          ariaLabel="Query actions for Sixth Tab"
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
      dismissLabel: 'Dismiss sixth tab',
      onDismiss: () => console.log('I have been clicked!'),
    },
  ];

  const [tabsDismissibles, setTabDismissibles] = useState([
    {
      label: 'First tab',
      id: 'first',
      dismissible: true,
      dismissLabel: 'Dismiss first tab',
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
      disabled: true,
      dismissible: true,
      dismissLabel: 'Dismiss second tab (disabled)',
      dismissDisabled: true,
      action: (
        <ButtonDropdown
          variant="icon"
          ariaLabel="Query actions for second tab"
          items={[
            { id: 'save', text: 'Save', disabled: true },
            { id: 'saveAs', text: 'Save as' },
            { id: 'rename', text: 'Rename', disabled: true },
            { id: 'delete', text: 'Delete', disabled: true },
          ]}
          expandToViewport={true}
          disabled={true}
        />
      ),
      content:
        'Diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      label: 'Third tab',
      id: 'third',
      dismissible: true,
      dismissLabel: 'Dismiss third tab',
      onDismiss: () => setTabDismissibles(prevTabs => prevTabs.filter(tab => tab.id !== 'third')),
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
      <Select
        options={[{ value: 'automatic' }, { value: 'manual' }]}
        selectedOption={{ value: keyboardActivationMode }}
        onChange={e =>
          setUrlParams({ keyboardActivationMode: e.detail.selectedOption.value as TabsProps['keyboardActivationMode'] })
        }
        inlineLabelText="Activation mode"
      />
      <input type="text" id="before" aria-label="before" />
      <form action="/">
        <Tabs
          ariaLabel="General Tabs"
          tabs={tabs}
          activeTabId={selectedTab}
          onChange={event => setSelectedTab(event.detail.activeTabId)}
          keyboardActivationMode={keyboardActivationMode}
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
        keyboardActivationMode={keyboardActivationMode}
        i18nStrings={{
          scrollLeftAriaLabel: 'Scroll left (Dismissible Tabs)',
          scrollRightAriaLabel: 'Scroll right (Dismissible Tabs)',
        }}
      />
    </div>
  );
}
