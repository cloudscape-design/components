// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Suspense } from 'react';

import { AppLayout, ContentLayout, ErrorBoundary, Header, Link, Spinner } from '~components';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';

function createDelayedResource(ms: number, error: Error) {
  let done = false;
  const promise = new Promise<void>(resolve =>
    setTimeout(() => {
      done = true;
      resolve();
    }, ms)
  );
  return {
    read() {
      if (!done) {
        throw promise;
      }
      throw error;
    },
  };
}

const resource = createDelayedResource(2000, new Error('Async page load failed'));

function AsyncFailingPage() {
  resource.read();
  return <div>Loaded page</div>;
}

export default function ErrorBoundaryAsyncDemo() {
  return (
    <I18nProvider messages={[messages]} locale="en">
      <ErrorBoundary
        onError={({ error }) => console.log(`Error "${error.message.slice(0, 20)}… reported."`)}
        i18nStrings={{ components: { Feedback: Link } }}
      >
        <AppLayout
          navigationHide={false}
          toolsHide={false}
          content={
            <Suspense
              fallback={
                <ContentLayout header={<Header variant="h1">Error boundaries async</Header>}>
                  <Spinner size="large" />
                </ContentLayout>
              }
            >
              <AsyncFailingPage />
            </Suspense>
          }
        />
      </ErrorBoundary>
    </I18nProvider>
  );
}
