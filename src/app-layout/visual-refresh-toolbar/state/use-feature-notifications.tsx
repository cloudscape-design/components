// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject, useEffect, useRef, useState } from 'react';

import { useInternalI18n } from '../../../i18n/context';
import FeaturePrompt, { FeaturePromptProps } from '../../../internal/do-not-use/feature-prompt';
import { persistFeatureNotifications, retrieveFeatureNotifications } from '../../../internal/persistence';
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

function filterOutdatedFeatures(features: Record<string, string>): Record<string, string> {
  const cutoffDate = subtractDaysFromDate(new Date(), 180);

  return Object.keys(features).reduce((acc, key) => {
    const featureDate = new Date(features[key]);

    if (featureDate && featureDate >= cutoffDate) {
      return {
        ...acc,
        [key]: features[key],
      };
    }

    return acc;
  }, {});
}

export function useFeatureNotifications({ activeDrawersIds }: UseFeatureNotificationsProps) {
  const i18n = useInternalI18n('features-notification-drawer');
  const [markAllAsRead, setMarkAllAsRead] = useState(false);
  const [featurePromptDismissed, setFeaturePromptDismissed] = useState(false);
  const [featureNotificationsData, setFeatureNotificationsData] = useState<FeatureNotificationsPayload<unknown> | null>(
    null
  );
  const [seenFeatures, setSeenFeatures] = useState<Record<string, string>>({});
  const featurePromptRef = useRef<FeaturePromptProps.Ref>(null);

  useEffect(() => {
    if (!featureNotificationsData || markAllAsRead) {
      return;
    }
    const id = featureNotificationsData?.id;
    if (activeDrawersIds.includes(id) && !markAllAsRead) {
      const featuresMap = featureNotificationsData.features.reduce((acc, feature) => {
        return {
          ...acc,
          [feature.id]: feature.releaseDate.toString(),
        };
      }, {});
      const filteredSeenFeaturesMap = filterOutdatedFeatures(seenFeatures);
      const allFeaturesMap = { ...featuresMap, ...filteredSeenFeaturesMap };
      persistFeatureNotifications(persistenceConfig, allFeaturesMap).then(() => {
        awsuiPlugins.appLayout.updateDrawer({ id, badge: false });
        setMarkAllAsRead(true);
      });
    }
  }, [featureNotificationsData, activeDrawersIds, markAllAsRead, featurePromptDismissed, seenFeatures]);

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
      if (features.length === 0) {
        return;
      }
      setFeatureNotificationsData({ ...payload, features });
      awsuiPlugins.appLayout.registerDrawer({
        id: payload.id,
        defaultActive: false,
        resizable: true,
        defaultSize: 320,

        ariaLabels: {
          closeButton: i18n('ariaLabels.closeButton', undefined),
          content: i18n('ariaLabels.content', undefined),
          triggerButton: i18n('ariaLabels.triggerButton', undefined),
          resizeHandle: i18n('ariaLabels.resizeHandle', undefined),
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

      retrieveFeatureNotifications(persistenceConfig).then(seenFeatureNotifications => {
        setSeenFeatures(seenFeatureNotifications);
        const hasUnseenFeatures = features.some(feature => !seenFeatureNotifications[feature.id]);
        if (hasUnseenFeatures) {
          if (!payload.suppressFeaturePrompt && !featurePromptDismissed) {
            featurePromptRef.current?.show();
          }
          awsuiPlugins.appLayout.updateDrawer({ id: payload.id, badge: true });
        } else {
          setMarkAllAsRead(true);
        }
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

  function getLatestUnseenFeature(): Feature<unknown> | null {
    if (!featureNotificationsData) {
      return null;
    }

    // Features array is already sorted in reverse chronological order (most recent first)
    // Find the first feature that hasn't been seen
    for (const feature of featureNotificationsData.features) {
      if (!seenFeatures[feature.id]) {
        return feature;
      }
    }

    return null;
  }

  function renderLatestFeaturePrompt({ triggerRef }: RenderLatestFeaturePromptProps) {
    const latestFeature = getLatestUnseenFeature();
    if (!(triggerRef?.current && featureNotificationsData && latestFeature)) {
      return null;
    }
    return (
      <FeaturePrompt
        ref={featurePromptRef}
        onShow={() => {
          triggerRef.current!.dataset!.awsuiSuppressTooltip = 'true';
        }}
        onDismiss={() => {
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
