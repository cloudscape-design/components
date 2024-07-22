// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Container, Header } from '~components';
import ButtonDropdown from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';
import Tabs, { TabsProps } from '~components/tabs';

export default function TabsDemoPage() {
  const [tabsDismissibles, setTabDismissibles] = useState([
    {
      label: 'First tab',
      id: 'first',
      dismissible: true,
      dismissLabel: 'Dismiss first tab (dismissibles variant)',
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
      dismissLabel: 'Dismiss second tab (dismissibles variant)',
      onDismiss: () => setTabDismissibles(prevTabs => prevTabs.filter(tab => tab.id !== 'second')),
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

  const tabsNoActions: Array<TabsProps.Tab> = [
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
  ];
  const [tabsXORActions, setTabsXORActions] = useState([
    {
      label: 'First tab',
      id: 'first',
      dismissible: true,
      dismissLabel: 'Dismiss first tab (xor actions variant)',
      onDismiss: () => setTabsXORActions(prevTabs => prevTabs.slice(1)),
      content: (
        <>
          Diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
          accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
          dolor sit ameta.,
        </>
      ),
    },
    {
      label: 'Second tab',
      id: 'second',
      action: <Button iconName="copy" variant="icon" ariaLabel="Action button for the Second tab" />,
      content:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    },
  ]);

  const [tabsBoth, setTabsBoth] = useState([
    {
      id: 'first',
      label: 'Tab w/ action',
      action: (
        <ButtonDropdown
          variant="icon"
          ariaLabel="Query actions for first tab (Hybrid component)"
          items={[
            { id: 'save', text: 'Save', disabled: true },
            { id: 'saveAs', text: 'Save as' },
            { id: 'rename', text: 'Rename', disabled: true },
            { id: 'delete', text: 'Delete', disabled: true },
          ]}
          expandToViewport={true}
        />
      ),
      content: <p>First tab content</p>,
    },
    {
      id: 'second',
      label: 'Second tab label',
      content: <p>Second tab content</p>,
    },
    {
      id: 'third',
      label: 'Athena-like tab',
      dismissible: true,
      dismissLabel: 'Dismiss third button (combined tabs variant)',
      onDismiss: () => setTabsBoth(prevTabs => prevTabs.slice(0, 2)),
      action: (
        <ButtonDropdown
          variant="icon"
          ariaLabel="Query actions for third tab (Hybrid component)"
          items={[
            { id: 'save', text: 'Save', disabled: true },
            { id: 'saveAs', text: 'Save as' },
            { id: 'rename', text: 'Rename', disabled: true },
            { id: 'delete', text: 'Delete', disabled: true },
          ]}
          expandToViewport={true}
        />
      ),
      content: (
        <Container
          header={
            <Header variant="h2" description="Container description">
              Container title
            </Header>
          }
        >
          Container content
        </Container>
      ),
    },
  ]);

  return (
    <>
      <h1>Tabs</h1>

      <SpaceBetween size="xs">
        <div>
          <h2>Tabs with dismissibles</h2>
          <Tabs
            tabs={tabsDismissibles}
            i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
          />
        </div>
        <div>
          <h2>Tabs with no actions</h2>
          <Tabs
            tabs={tabsNoActions}
            i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
          />
        </div>
        <div>
          <h2>Tabs with action or dismissible</h2>
          <Tabs
            tabs={tabsXORActions}
            i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
          />
        </div>
        <div>
          <h2>Tabs with actions and dismissibles</h2>
          <Tabs
            tabs={tabsBoth}
            i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
          />
        </div>
      </SpaceBetween>
    </>
  );
}
