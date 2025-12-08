// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef, useState } from 'react';

import { FeaturePromptProps } from '../../../internal/do-not-use/feature-prompt';
import awsuiPlugins from '../../../internal/plugins';
import { InternalDrawer } from '../interfaces';

interface UseFeatureNotificationsProps {
  drawers: Array<InternalDrawer>;
  activeDrawersIds: Array<string>;
}

const delay = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, 200);
  });

export function useFeatureNotifications({ drawers, activeDrawersIds }: UseFeatureNotificationsProps) {
  const [markAllAsRead, setMarkAllAsRead] = useState(false);
  const featureNotificationsDrawer = drawers.find(drawer => !!drawer.__features);
  const featurePromptRef = useRef<FeaturePromptProps.Ref>(null);

  useEffect(() => {
    if (!featureNotificationsDrawer || markAllAsRead) {
      return;
    }
    const id = featureNotificationsDrawer.id;
    if (activeDrawersIds.includes(id)) {
      // make a request to continuum and mark all notifications as read
      awsuiPlugins.appLayout.updateDrawer({ id, badge: false });
      setMarkAllAsRead(true);
      return;
    }

    // const features = featureNotificationsDrawer?.__features;
    // call continuum to determine if all notifications were read, if not, show the badge and trigger the feature prompt
    delay().then(() => {
      if (!featureNotificationsDrawer.__suppressFeaturePrompt) {
        // TODO show the feature prompt
        featurePromptRef.current?.show();
      }
      if (!featureNotificationsDrawer.badge) {
        awsuiPlugins.appLayout.updateDrawer({ id, badge: true });
      }
    });
  }, [featureNotificationsDrawer, activeDrawersIds, markAllAsRead]);

  return {
    featurePromptRef,
  };
}
