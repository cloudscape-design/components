// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Select from '~components/select';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';

import labels from './utils/labels';

const items: SideNavigationProps.Item[] = new Array(50).fill(null).map((_, index) => ({
  type: 'link',
  text: `Link to page ${index + 1} with long enough text to wrap`,
  href: '#',
}));

const itemsControl = (
  <Select
    options={[
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ]}
    selectedOption={{ value: 'option1', label: 'Option 1' }}
    onChange={() => null}
  />
);

export default function SideNavigationPage() {
  const [open, setOpen] = React.useState(true);

  return (
    <AppLayout
      navigationOpen={open}
      onNavigationChange={({ detail }) => {
        setOpen(detail.open);
      }}
      ariaLabels={labels}
      navigation={
        <SideNavigation
          header={{
            href: '#/',
            text: 'Header title',
          }}
          items={items}
          itemsControl={itemsControl}
        />
      }
      content={
        <>
          <h1>App Layout with scrollable Side navigation</h1>
        </>
      }
    />
  );
}
