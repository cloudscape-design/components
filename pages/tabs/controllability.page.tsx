// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { CodeEditor, CodeEditorProps } from '~components';
import ButtonDropdown from '~components/button-dropdown';
import SpaceBetween from '~components/space-between';
import Tabs, { TabsProps } from '~components/tabs';

export default function TabsDemoPage() {
  const tabs: Array<TabsProps.Tab> = [
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
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);
  const [preferences, setPreferences] = React.useState<CodeEditorProps.Preferences>();
  const [loading] = React.useState(false);
  const [, setThirdTabClosed] = React.useState(true);
  return (
    <>
      <h1>Tabs</h1>

      <SpaceBetween size="xs">
        <div>
          <h2>Controlled component</h2>
          <Tabs
            tabs={tabs}
            activeTabId={selectedTab}
            onChange={event => setSelectedTab(event.detail.activeTabId)}
            i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
          />
        </div>
        <div>
          <h2>Uncontrolled component</h2>
          <Tabs
            tabs={tabs}
            i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
          />
        </div>
        <div>
          <h2>Tab component with actions</h2>
          <Tabs
            tabs={[
              {
                id: 'first',
                label: 'First tab label',
                dismissible: true,
                onDismiss: () => setThirdTabClosed(false),
                content: <p>First tab content</p>,
              },
              {
                id: 'second',
                label: 'Athena-like tab',
                dismissible: true,
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
                content: (
                  <CodeEditor
                    language="javascript"
                    value="const pi = 3.14;"
                    preferences={preferences}
                    onPreferencesChange={e => setPreferences(e.detail)}
                    loading={loading}
                    themes={{
                      light: ['cloud_editor'],
                      dark: ['cloud_editor_dark'],
                    }}
                    ace={undefined}
                  />
                ),
              },
              {
                id: 'third',
                label: 'Tab w/ action',
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
                content: <p>Third tab content</p>,
              },
            ]}
          />
        </div>
      </SpaceBetween>
    </>
  );
}
