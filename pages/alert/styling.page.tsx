// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, Checkbox } from '~components';
import InternalAlert from '~components/alert/internal';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import SpaceBetween from '~components/space-between';

import { i18nStrings } from './common';

export default function AlertStyling() {
  const [stylesOn, setStylesOn] = useState(true);
  return (
    <I18nProvider messages={[messages]} locale="en">
      <Box margin="m">
        <SpaceBetween size="s">
          <Checkbox checked={stylesOn} onChange={({ detail }) => setStylesOn(detail.checked)}>
            Styles on
          </Checkbox>
          <Box>Changing colors hover</Box>
          <InternalAlert
            type="info"
            header="Header text"
            i18nStrings={i18nStrings}
            dismissible={true}
            style={
              stylesOn
                ? {
                    alert: { css: { backgroundColor: 'lightpink', borderColor: 'deeppink', color: 'deeppink' } },
                    icon: { css: { color: 'deeppink' } },
                    dismissButton: { css: { color: 'deeppink' } },
                    ['alert:hover']: {
                      css: { backgroundColor: 'deeppink', color: 'white' },
                      icon: { css: { color: 'white' } },
                      dismissButton: { css: { color: 'white' } },
                    },
                  }
                : undefined
            }
          >
            Body text
          </InternalAlert>
        </SpaceBetween>
      </Box>
    </I18nProvider>
  );
}
