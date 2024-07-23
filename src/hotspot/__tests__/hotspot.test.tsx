// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  HotspotContext as HotspotContextType,
  hotspotContext as HotspotContext,
} from '../../../lib/components/annotation-context/context';
import Hotspot from '../../../lib/components/hotspot';

function getContext(props?: Partial<HotspotContextType>): HotspotContextType {
  return {
    registerHotspot: jest.fn(),
    unregisterHotspot: jest.fn(),
    currentStepIndex: 0,
    currentTutorial: null,
    onStartTutorial: jest.fn(),
    onExitTutorial: jest.fn(),
    getContentForId: jest.fn(),
    ...props,
  };
}

test('registers and unregisters at the correct times', () => {
  const context = getContext();

  const { unmount } = render(
    <HotspotContext.Provider value={context}>
      <Hotspot hotspotId="a-random-id" />
    </HotspotContext.Provider>
  );

  expect(context.registerHotspot).toBeCalledTimes(1);
  expect(context.unregisterHotspot).not.toBeCalled();

  unmount();

  expect(context.registerHotspot).toBeCalledTimes(1);
  expect(context.unregisterHotspot).toBeCalledTimes(1);
});

test('renders content from the context', () => {
  const context = getContext({
    getContentForId: jest.fn(() => <div className="test-content"></div>),
  });

  const { container } = render(
    <HotspotContext.Provider value={context}>
      <Hotspot hotspotId="a-random-id" />
    </HotspotContext.Provider>
  );

  expect(container.getElementsByClassName('test-content')[0]).toBeInTheDocument();
});
