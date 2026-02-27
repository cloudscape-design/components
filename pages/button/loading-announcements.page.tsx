// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { Input, LiveRegion } from '~components';
import Button from '~components/button';

export default function ButtonIntegrationPage() {
  const [loadingState, setLoadingState] = useState<'initial' | 'loading' | 'success'>('initial');
  const [loadingTime, setLoadingTime] = useState(2000);
  const [lastReloadTime, setLastReloadTime] = useState<Date | null>(null);
  useEffect(() => {
    if (loadingState === 'loading') {
      const timer = setTimeout(() => {
        setLoadingState('success');
        setLastReloadTime(new Date());
      }, loadingTime);
      return () => clearTimeout(timer);
    }
  }, [loadingState, loadingTime]);
  return (
    <article>
      <h1>Button with loading text and result</h1>
      <Input value={loadingTime.toString()} onChange={e => setLoadingTime(parseInt(e.detail.value) || 0)} />
      Click to reload:
      <Button
        ariaLabel="Reload"
        iconName="refresh"
        loading={loadingState === 'loading'}
        loadingText="Loading"
        onClick={() => setLoadingState('loading')}
      />
      <LiveRegion>
        {loadingState === 'success' && (
          <div data-testid="success-message">
            Successfully reloaded at {lastReloadTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </LiveRegion>
    </article>
  );
}
