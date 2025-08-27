// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Box, SpaceBetween } from '~components';
import I18nProvider, { I18nProviderProps } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';

import ScreenshotArea, { ScreenshotAreaProps } from '../utils/screenshot-area';

interface SimplePageProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  settings?: React.ReactNode;
  children: React.ReactNode;
  screenshotArea?: ScreenshotAreaProps;
  i18n?: Partial<I18nProviderProps>;
}

export function SimplePage({ title, subtitle, settings, children, screenshotArea, i18n }: SimplePageProps) {
  const content = (
    <Box margin="m">
      <SpaceBetween size="m">
        <SpaceBetween size="xs">
          <Box variant="h1">{title}</Box>
          {subtitle ? <Box variant="p">{subtitle}</Box> : null}
        </SpaceBetween>

        {settings ? (
          <SpaceBetween size="s">
            <div>{settings}</div>
            <hr />
          </SpaceBetween>
        ) : null}

        {screenshotArea ? (
          <ScreenshotArea gutters={false} {...screenshotArea}>
            <SpaceBetween size="m">{children}</SpaceBetween>
          </ScreenshotArea>
        ) : (
          <Box>{children}</Box>
        )}
      </SpaceBetween>
    </Box>
  );
  return i18n ? (
    <I18nProvider messages={[messages]} locale="en-GB" {...i18n}>
      {content}
    </I18nProvider>
  ) : (
    content
  );
}

export function PermutationsPage({ screenshotArea = {}, ...props }: SimplePageProps) {
  return <SimplePage {...props} screenshotArea={screenshotArea} />;
}
