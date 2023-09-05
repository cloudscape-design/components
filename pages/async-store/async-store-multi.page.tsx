// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo } from 'react';
import { Box, Button, SpaceBetween } from '~components';
import AsyncStore, { useSelector } from '~components/internal/async-store';

export default function AsyncStoreMultiPage() {
  const storeWest = useMemo(() => new AsyncStore(0), []);
  const storeEast = useMemo(() => new AsyncStore(0), []);

  useEffect(() => {
    const unsubscribe = storeWest.subscribe(
      state => state,
      () => storeEast.set(prev => prev + 1)
    );
    return unsubscribe;
  }, [storeWest, storeEast]);

  return (
    <Box padding="m">
      <Box variant="h1">Async store multiple stores demo page</Box>

      <SpaceBetween direction="horizontal" size="m">
        <Button data-testid="west" onClick={() => storeWest.set(prev => prev + 1)}>
          Increment west
        </Button>

        <Button data-testid="east" onClick={() => storeEast.set(prev => prev + 1)}>
          Increment east
        </Button>

        <Button
          data-testid="westeast"
          onClick={() => {
            storeWest.set(prev => prev + 1);
            storeEast.set(prev => prev + 1);
          }}
        >
          Increment west, east
        </Button>
      </SpaceBetween>

      <Box margin={{ top: 'm' }}>
        <WestComponent store={storeWest} />
        <EastComponent store={storeEast} />
      </Box>
    </Box>
  );
}

function WestComponent({ store }: { store: AsyncStore<number> }) {
  const value = useSelector(store, state => state);
  return <Box>West: {value}</Box>;
}

function EastComponent({ store }: { store: AsyncStore<number> }) {
  const value = useSelector(store, state => state);
  return <Box>East: {value}</Box>;
}
