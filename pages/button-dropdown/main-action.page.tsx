// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonDropdown from '~components/button-dropdown';

export default function ButtonDropdownPage() {
  return (
    <>
      <h1>Button dropdown with main action</h1>
      <ButtonDropdown
        items={[
          {
            text: 'Launch instance from template',
            id: 'launch-instance-from-template',
          },
        ]}
        mainAction={{ text: 'Launch instance' }}
        ariaLabel="More launch options"
        variant="primary"
      />
    </>
  );
}
