// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AnchorNavigation from '~components/anchor-navigation';

import Box from '~components/box';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import Select, { SelectProps } from '~components/select';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';
import VisualContext from '~components/internal/components/visual-context';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './styles.scss';

export default function ContentHeaderVisualContextDemo() {
  const [value, setValue] = React.useState('second');
  const [activeHref, setActiveHref] = React.useState('#/page1');
  const [selectedOption, setSelectedOption] = React.useState<SelectProps.Option>({ label: 'Option 1', value: '1' });

  return (
    <ScreenshotArea disableAnimations={true} gutters={false}>
      <VisualContext contextName="top-navigation">
        <div className={styles['top-nav-dropdown']}>
          <Box padding="l">
            <SpaceBetween size="l">
              <Box variant="h1">Top Navigation visual context</Box>
              <SideNavigation
                activeHref={activeHref}
                onFollow={event => {
                  if (!event.detail.external) {
                    event.preventDefault();
                    setActiveHref(event.detail.href);
                  }
                }}
                items={[
                  { type: 'link', text: 'Page 1', href: '#/page1' },
                  { type: 'link', text: 'Page 2', href: '#/page2' },
                  { type: 'link', text: 'Page 3', href: '#/page3' },
                  { type: 'link', text: 'Page 4', href: '#/page4' },
                  { type: 'divider' },
                  {
                    type: 'link',
                    text: 'Notifications',
                    href: '#/notifications',
                  },
                  {
                    type: 'link',
                    text: 'Documentation',
                    href: 'https://example.com',
                    external: true,
                  },
                ]}
              />
              <AnchorNavigation
                activeHref="#playground"
                anchors={[
                  {
                    text: 'Section 1',
                    href: '#playground',
                    level: 1,
                  },
                  {
                    text: 'Section 2',
                    href: '#section2',
                    level: 1,
                  },
                  {
                    text: 'Section 3',
                    href: '#section3',
                    level: 1,
                  },
                  { text: 'Section 4', href: '#section4', level: 1 },
                ]}
                onFollow={event => {
                  event.preventDefault();
                }}
              />
              <div>
                <Box variant="awsui-key-label">Label for key</Box>
                <div>Key</div>
              </div>
              <FormField label="This is Label">
                <Select
                  selectedOption={selectedOption}
                  onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
                  options={[
                    { label: 'Option 1', value: '1' },
                    { label: 'Option 2', value: '2' },
                    { label: 'Option 3', value: '3' },
                    { label: 'Option 4', value: '4' },
                    { label: 'Option 5', value: '5' },
                  ]}
                />
              </FormField>

              <FormField label="This is Label">
                <RadioGroup
                  onChange={({ detail }) => setValue(detail.value)}
                  value={value}
                  items={[
                    { value: 'first', label: 'First choice' },
                    { value: 'second', label: 'Second choice' },
                    { value: 'third', label: 'Third choice' },
                  ]}
                />
              </FormField>
            </SpaceBetween>
          </Box>
        </div>
      </VisualContext>
    </ScreenshotArea>
  );
}
