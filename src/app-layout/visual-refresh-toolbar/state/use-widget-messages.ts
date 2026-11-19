// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { getAppLayoutInitialMessages, registerAppLayoutHandler } from '../../../internal/plugins/widget/core';
import { WidgetMessage } from '../../../internal/plugins/widget/interfaces';

export function useWidgetMessages(isEnabled: boolean, handler: (message: WidgetMessage) => void) {
  const appLayoutMessageHandler = useStableCallback(handler);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    for (const message of getAppLayoutInitialMessages()) {
      appLayoutMessageHandler(message);
    }

    return registerAppLayoutHandler(appLayoutMessageHandler);
  }, [isEnabled, appLayoutMessageHandler]);
}
