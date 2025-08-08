// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Suspense } from 'react';

import { AppLayout, Spinner } from '~components';
import { ErrorBoundariesProvider } from '~components/error-boundary/context';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';

import ScreenshotArea from '../utils/screenshot-area';

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
    <ScreenshotArea gutters={false}>
      <I18nProvider messages={[messages]} locale="en">
        <ErrorBoundariesProvider value={{ feedbackLink: '/#' }}>
          {/* AppLayout remains synchronous */}
          <AppLayout
            navigationHide={true}
            toolsHide={true}
            content={
              <Suspense fallback={<Fallback />}>
                <AsyncFailingPage />
              </Suspense>
            }
          />
        </ErrorBoundariesProvider>
      </I18nProvider>
    </ScreenshotArea>
  );
}

function Fallback() {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Spinner size="large" />
    </div>
  );
}
