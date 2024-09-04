// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ComponentType, ReactElement, useEffect, useState } from 'react';

import pagesContext from '../pages-context';
import ErrorBoundary from './error-boundary';
import PageLayout, { PageLayoutProps } from './page-layout';

interface PageLoadResult {
  default: ComponentType;
  perms?: PageLayoutProps<unknown>;
}

interface PageLoaderProps {
  path: string;
  fallback: ReactElement;
}

function PageLoader({ path, fallback }: PageLoaderProps) {
  const [element, setElement] = useState<ReactElement | null>(null);
  const [isLoading, setIsLoader] = useState(true);

  useEffect(() => {
    pagesContext(path).then(({ default: Component, perms }: PageLoadResult) => {
      if (perms) {
        setElement(<PageLayout {...perms} />);
      } else {
        setElement(<Component />);
      }

      setIsLoader(false);
    });
  }, [path]);

  if (isLoading) {
    return fallback;
  }

  return element;
}

export default function PageView({ pageId }: { pageId: string }) {
  return (
    <ErrorBoundary key={pageId}>
      <PageLoader fallback={<span>Loading...</span>} path={`./${pageId}.page.tsx`} />
    </ErrorBoundary>
  );
}
