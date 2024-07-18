// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { lazy, Suspense } from 'react';

import pagesContext from '../pages-context';
import ErrorBoundary from './error-boundary';

const pagesComponents: Record<string, ReturnType<typeof lazy>> = {};

export default function PageView({ pageId }: { pageId: string }) {
  if (!pagesComponents[pageId]) {
    pagesComponents[pageId] = lazy(() => pagesContext(`./${pageId}.page.tsx`));
  }
  const Page = pagesComponents[pageId];
  return (
    <ErrorBoundary key={pageId}>
      <Suspense fallback={<span>Loading...</span>}>
        <Page />
      </Suspense>
    </ErrorBoundary>
  );
}
