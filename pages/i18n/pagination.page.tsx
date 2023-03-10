// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Pagination from '~components/pagination';
import ScreenshotArea from '../utils/screenshot-area';

import { I18nProvider } from '~components/internal/i18n';
import i18nMessages from '~components/internal/i18n/messages/all.en-US.js';

export default function PaginationPermutations() {
  return (
    <I18nProvider value={i18nMessages}>
      <h1>Pagination with i18n</h1>
      <ScreenshotArea>
        <Pagination currentPageIndex={1} pagesCount={3} />
      </ScreenshotArea>
    </I18nProvider>
  );
}
