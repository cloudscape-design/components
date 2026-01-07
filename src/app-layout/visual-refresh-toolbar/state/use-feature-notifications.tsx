// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject, useEffect, useRef, useState } from 'react';

import FeaturePrompt, { FeaturePromptProps } from '../../../internal/do-not-use/feature-prompt';
import { persistSeenFeatureNotifications, retrieveSeenFeatureNotifications } from '../../../internal/persistence';
import awsuiPlugins from '../../../internal/plugins';
import { Feature, FeatureNotificationsPayload, WidgetMessage } from '../../../internal/plugins/widget/interfaces';
import RuntimeFeaturesNotificationDrawer, { RuntimeContentPart } from '../drawer/feature-notifications-drawer-content';
interface UseFeatureNotificationsProps {
  activeDrawersIds: Array<string>;
}
interface RenderLatestFeaturePromptProps {
  triggerRef: RefObject<HTMLElement>;
}
export interface FeatureNotificationsProps {
  renderLatestFeaturePrompt: RenderLatestFeaturePrompt;
  drawerId?: string | null;
}
export type RenderLatestFeaturePrompt = (props: RenderLatestFeaturePromptProps) => JSX.Element | null;

// TODO
// switch focus after closing the feature prompt
const persistenceConfig = {
  uniqueKey: 'feature-notifications',
  crossServicePersistence: false,
};

function subtractDaysFromDate(currentDate: Date, daysToSubtract: number) {
  daysToSubtract = daysToSubtract || 0;
  const pastDate = new Date(currentDate);
  pastDate.setDate(pastDate.getDate() - daysToSubtract);

  return pastDate;
}

export function useFeatureNotifications({ activeDrawersIds }: UseFeatureNotificationsProps) {
  const [markAllAsRead, setMarkAllAsRead] = useState(false);
  const [featurePromptDismissed, setFeaturePromptDismissed] = useState(false);
  const [featureNotificationsData, setFeatureNotificationsData] = useState<FeatureNotificationsPayload<unknown> | null>(
    null
  );
  const [seenFeatureIds, setSeenFeatureIds] = useState<Set<string>>(new Set());
  const featurePromptRef = useRef<FeaturePromptProps.Ref>(null);

  useEffect(() => {
    if (!featureNotificationsData || markAllAsRead) {
      return;
    }
    const id = featureNotificationsData.id;
    if (activeDrawersIds.includes(id) && !markAllAsRead) {
      const allFeaturesIds = [...seenFeatureIds, ...featureNotificationsData.features.map(feature => feature.id)];
      const uniqueAllFeatureIds = [...new Set(allFeaturesIds)];
      persistSeenFeatureNotifications(persistenceConfig, uniqueAllFeatureIds).then(() => {
        awsuiPlugins.appLayout.updateDrawer({ id, badge: false });
        setMarkAllAsRead(true);
      });
      return;
    }
  }, [featureNotificationsData, activeDrawersIds, markAllAsRead, featurePromptDismissed, seenFeatureIds]);

  const defaultFeaturesFilter = (feature: Feature<unknown>) => {
    return feature.releaseDate >= subtractDaysFromDate(new Date(), 90);
  };

  const getFeaturesToDisplay = (payload: FeatureNotificationsPayload<unknown>): Array<Feature<unknown>> => {
    return payload.features
      .slice()
      .filter(payload.filterFeatures ? payload.filterFeatures : defaultFeaturesFilter)
      .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());
  };

  function featureNotificationsMessageHandler(event: WidgetMessage) {
    if (event.type === 'registerFeatureNotifications') {
      const { payload } = event;
      const features = getFeaturesToDisplay(payload);
      setFeatureNotificationsData({ ...payload, features });
      awsuiPlugins.appLayout.registerDrawer({
        id: payload.id,
        defaultActive: false,
        resizable: true,
        defaultSize: 320,

        // TODO Replace with i18n strings
        ariaLabels: {
          closeButton: 'Close button',
          content: 'Content',
          triggerButton: 'Trigger button',
          resizeHandle: 'Resize handle',
        },

        trigger: { __iconName: 'suggestions' },
        mountContent: () => {},
        unmountContent: () => {},

        __content: (
          <RuntimeFeaturesNotificationDrawer
            features={features}
            featuresPageLink={payload.featuresPageLink}
            mountItem={payload.mountItem}
          />
        ),
      });

      retrieveSeenFeatureNotifications(persistenceConfig).then(seenFeatureNotifications => {
        const seenFeatureNotificationsSet = new Set(seenFeatureNotifications);
        setSeenFeatureIds(seenFeatureNotificationsSet);
        const hasUnseenFeatures = features.some(feature => !seenFeatureNotificationsSet.has(feature.id));
        if (hasUnseenFeatures) {
          if (!payload.suppressFeaturePrompt && !featurePromptDismissed) {
            featurePromptRef.current?.show();
          }
          awsuiPlugins.appLayout.updateDrawer({ id: payload.id, badge: true });
        }
      });
      return;
    }

    if (event.type === 'showFeaturePromptIfPossible') {
      console.log('showFeaturePromptIfPossible markAllAsRead: ', markAllAsRead);
      if (markAllAsRead) {
        return;
      }
      featurePromptRef.current?.show();
      return;
    }
  }

  function getLatestUnseenFeature(): Feature<unknown> | null {
    if (!featureNotificationsData) {
      return null;
    }

    // Features array is already sorted in reverse chronological order (most recent first)
    // Find the first feature that hasn't been seen
    for (const feature of featureNotificationsData.features) {
      if (!seenFeatureIds.has(feature.id)) {
        return feature;
      }
    }

    // No unseen features found
    return null;
  }

  function renderLatestFeaturePrompt({ triggerRef }: RenderLatestFeaturePromptProps) {
    const latestFeature = getLatestUnseenFeature();
    if (!(triggerRef && featureNotificationsData && latestFeature)) {
      return null;
    }
    return (
      <FeaturePrompt
        ref={featurePromptRef}
        onShow={() => {
          if (!triggerRef.current) {
            return;
          }
          triggerRef.current!.dataset!.awsuiSuppressTooltip = 'true';
        }}
        onDismiss={() => {
          if (!triggerRef.current) {
            return;
          }
          triggerRef.current!.dataset!.awsuiSuppressTooltip = 'false';
          setFeaturePromptDismissed(true);
        }}
        header={
          <RuntimeContentPart mountContent={featureNotificationsData?.mountItem} content={latestFeature.header} />
        }
        content={
          <RuntimeContentPart mountContent={featureNotificationsData?.mountItem} content={latestFeature.content} />
        }
        trackKey={latestFeature.id}
        position="left"
        getTrack={() => triggerRef.current}
      />
    );
  }

  const featureNotificationsProps: FeatureNotificationsProps = {
    renderLatestFeaturePrompt,
    drawerId: featureNotificationsData?.id,
  };

  return {
    featureNotificationsProps,
    featureNotificationsMessageHandler,
  };
}
