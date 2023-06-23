// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useLayoutEffect, useMemo } from 'react';
import { Box, Button, SpaceBetween } from '~components';
import AsyncStore, { useSelector } from '~components/internal/async-store';

interface ExtendedWindow extends Window {
  renders: Record<string, number>;
}
declare const window: ExtendedWindow;

window.renders = {
  west: 0,
  east: 0,
  westwest: 0,
  westeast: 0,
};

interface SidesState {
  west: number;
  east: number;
}

export default function AsyncStoreTestPage() {
  const store = useMemo(() => new AsyncStore({ west: 0, east: 0 }), []);

  return (
    <Box padding="m">
      <SpaceBetween direction="horizontal" size="m">
        <Button data-testid="west" onClick={() => store.set(prev => ({ ...prev, west: prev.west + 1 }))}>
          Increment west
        </Button>

        <Button data-testid="east" onClick={() => store.set(prev => ({ ...prev, east: prev.east + 1 }))}>
          Increment east
        </Button>

        <Button
          data-testid="westeast"
          onClick={() => {
            store.set(prev => ({ ...prev, west: prev.west + 1 }));
            store.set(prev => ({ ...prev, east: prev.east + 1 }));
          }}
        >
          Increment west, east
        </Button>
      </SpaceBetween>

      <Box margin={{ top: 'm' }}>
        <WestComponent store={store} />
        <EastComponent store={store} />
        <WestWestComponent store={store} />
        <WestEastComponent store={store} />
      </Box>
    </Box>
  );
}

function WestComponent({ store }: { store: AsyncStore<SidesState> }) {
  useLayoutEffect(() => {
    window.renders.west++;
  });
  const value = useSelector(store, state => state.west);
  return <Box>West: {value}</Box>;
}

function EastComponent({ store }: { store: AsyncStore<SidesState> }) {
  useLayoutEffect(() => {
    window.renders.east++;
  });
  const value = useSelector(store, state => state.east);
  return <Box>East: {value}</Box>;
}

function WestWestComponent({ store }: { store: AsyncStore<SidesState> }) {
  useLayoutEffect(() => {
    window.renders.westwest++;
  });
  const value1 = useSelector(store, state => state.west);
  const value2 = useSelector(store, state => state.west);
  return (
    <Box>
      West, west: {value1}, {value2}
    </Box>
  );
}

function WestEastComponent({ store }: { store: AsyncStore<SidesState> }) {
  useLayoutEffect(() => {
    window.renders.westeast++;
  });
  const value1 = useSelector(store, state => state.west);
  const value2 = useSelector(store, state => state.east);
  return (
    <Box>
      West, east: {value1}, {value2}
    </Box>
  );
}
