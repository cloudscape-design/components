// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonDropdown, { ButtonDropdownProps } from '~components/button-dropdown';
import { PlaygroundPage } from '../app/helpers/playground-page';
import { useState } from 'react';

export default function ButtonDropdownPlaygroundPage() {
  const [settings, setSettings] = useState<ButtonDropdownProps>({
    children: 'Instance actions',
    expandableGroups: true,
    items: [
      {
        id: 'connect',
        text: 'Connect',
      },
      {
        id: 'states',
        text: 'Instance State',
        items: [
          {
            id: 'start',
            text: 'Start',
          },
          {
            id: 'stop',
            text: 'Stop',
            disabled: true,
            disabledReason: 'The instance is stopped',
          },
          {
            id: 'reboot',
            text: 'Reboot',
            disabled: true,
            disabledReason: 'The instance is stopped',
          },
          {
            id: 'external',
            text: 'Root Page',
            external: true,
            href: '/#/light/',
          },
        ],
      },
    ],
  });

  return (
    <PlaygroundPage title="ButtonDropdown playground" settings={settings} onChangeSettings={setSettings}>
      <ButtonDropdown {...settings} />
    </PlaygroundPage>
  );
}
