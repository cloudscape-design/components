// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Box, Button, ButtonDropdown, ButtonGroup, Header } from '~components';

export default function ButtonGroupPage() {
  return (
    <Box margin={'m'}>
      <Header variant="h1">ButtonGroup composition API</Header>
      <input data-testid="focus-before" aria-label="Focus helper" />
      <br />

      <ButtonGroup variant="children" ariaLabel="Actions">
        <Button data-itemid="one">Normal button</Button>
        <Button data-itemid="two">Another button</Button>
        <Button data-itemid="three" variant="icon" iconName="ticket" ariaLabel="Icon button" />
        <ButtonDropdown
          nativeTriggerAttributes={{ 'data-itemid': 'dropdown' }}
          ariaLabel="Icon button dropdown"
          items={[
            { id: 'four', text: 'Button dropdown item' },
            { id: 'another', text: 'Item 2' },
          ]}
          variant="icon"
        />
      </ButtonGroup>
    </Box>
  );
}
