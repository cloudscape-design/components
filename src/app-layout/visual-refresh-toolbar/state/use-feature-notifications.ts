// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef, useState } from 'react';

import { FeaturePromptProps } from '../../../internal/do-not-use/feature-prompt';
import awsuiPlugins from '../../../internal/plugins';
import { WidgetMessage } from '../../../internal/plugins/widget/interfaces';
import { InternalDrawer } from '../interfaces';

interface UseFeatureNotificationsProps {
  drawers: Array<InternalDrawer>;
  activeDrawersIds: Array<string>;
}

// TODO replace with a real continuum request
const delay = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, 200);
  });

export function useFeatureNotifications({ drawers, activeDrawersIds }: UseFeatureNotificationsProps) {
  const [markAllAsRead, setMarkAllAsRead] = useState(false);
  const [suppressedFeaturePrompt, setSuppressedFeaturePrompt] = useState(false);
  const featureNotificationsDrawer = drawers.find(drawer => !!drawer.__features);
  const featurePromptRef = useRef<FeaturePromptProps.Ref>(null);

  useEffect(() => {
    if (!featureNotificationsDrawer || markAllAsRead) {
      return;
    }
    const id = featureNotificationsDrawer.id;
    if (activeDrawersIds.includes(id)) {
      // TODO make a request to continuum and mark all notifications as read
      awsuiPlugins.appLayout.updateDrawer({ id, badge: false });
      setMarkAllAsRead(true);
      return;
    }

    // const features = featureNotificationsDrawer?.__features;
    // call continuum to determine if all notifications were read, if not, show the badge and trigger the feature prompt
    delay().then(() => {
      if (!suppressedFeaturePrompt) {
        featurePromptRef.current?.show();
      }
      if (!featureNotificationsDrawer.badge) {
        awsuiPlugins.appLayout.updateDrawer({ id, badge: true });
      }
    });
  }, [featureNotificationsDrawer, activeDrawersIds, markAllAsRead, suppressedFeaturePrompt]);

  function featureNotificationsMessageHandler(event: WidgetMessage) {
    if (event.type === 'registerFeatureNotifications') {
      const payload = event.payload;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const features = payload.features
        .slice()
        .filter(
          payload.filterFeatures
            ? payload.filterFeatures
            : feature => {
                return feature.releaseDate >= thirtyDaysAgo;
              }
        )
        .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());
      setSuppressedFeaturePrompt(payload.suppressFeaturePrompt ?? false);
      // TODO pass correct properties
      awsuiPlugins.appLayout.registerDrawer({
        id: payload.id,
        defaultActive: false,
        resizable: true,
        defaultSize: 320,

        ariaLabels: {
          closeButton: 'Close button',
          content: 'Content',
          triggerButton: 'Trigger button',
          resizeHandle: 'Resize handle',
        },

        trigger: { __iconName: 'suggestions' },
        mountContent: () => {},
        unmountContent: () => {},

        __features: features,
        __mountFeatureItem: payload.mountItem,
        __featuresPageLink: payload.featuresPageLink,
      });
      return;
    }

    if (event.type === 'showFeaturePromptIfPossible') {
      if (markAllAsRead) {
        return;
      }
      featurePromptRef.current?.show();
      return;
    }
  }

  return {
    featurePromptRef,
    featureNotificationsMessageHandler,
  };
}
