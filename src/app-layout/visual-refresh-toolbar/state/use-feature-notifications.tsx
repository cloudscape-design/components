// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject, useMemo, useRef, useState } from 'react';

import { useMergeRefs, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../../../i18n/context';
import FeaturePrompt, { FeaturePromptProps } from '../../../internal/do-not-use/feature-prompt';
import { persistFeatureNotifications, retrieveFeatureNotifications } from '../../../internal/persistence';
import {
  Feature,
  FeatureNotificationsPayload,
  FeatureNotificationsPersistenceConfig,
  WidgetMessage,
} from '../../../internal/plugins/widget/interfaces';
import { useMountRefPromise } from '../../../internal/utils/promises';
import { AppLayoutProps } from '../../interfaces';
import RuntimeFeaturesNotificationDrawer, { RuntimeContentPart } from '../drawer/feature-notifications-drawer-content';

const DEFAULT_PERSISTENCE_CONFIG = {
  uniqueKey: 'awsui-feature-notifications',
};

interface RenderLatestFeaturePromptProps {
  triggerRef: RefObject<HTMLElement>;
}
export interface FeatureNotificationsProps {
  renderLatestFeaturePrompt: RenderLatestFeaturePrompt;
  drawer?: AppLayoutProps.Drawer | null;
}
export type RenderLatestFeaturePrompt = (props: RenderLatestFeaturePromptProps) => JSX.Element | null;
interface FeatureNotifications extends FeatureNotificationsPayload<unknown> {
  badge?: boolean;
}
type FeatureId = string;
type FeatureReleaseDateString = string;
export type PersistedFeaturesDict = Record<FeatureId, FeatureReleaseDateString>;

const FEATURE_NOTIFICATIONS_RETENTION_DAYS = 180;

function subtractDaysFromDate(currentDate: Date, daysToSubtract: number) {
  daysToSubtract = daysToSubtract || 0;
  const pastDate = new Date(currentDate);
  pastDate.setDate(pastDate.getDate() - daysToSubtract);

  return pastDate;
}

function filterOutdatedFeatures(features: PersistedFeaturesDict): PersistedFeaturesDict {
  const cutoffDate = subtractDaysFromDate(new Date(), FEATURE_NOTIFICATIONS_RETENTION_DAYS);

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

export function useFeatureNotifications() {
  const i18n = useInternalI18n('features-notification-drawer');
  const [featurePromptDismissed, setFeaturePromptDismissed] = useState(false);
  const [featureNotificationsData, setFeatureNotificationsData] = useState<FeatureNotifications | null>(null);
  const [seenFeatures, setSeenFeatures] = useState<PersistedFeaturesDict>({});
  const featurePromptRef = useRef<FeaturePromptProps.Ref>(null);
  const { ref: featurePromptMountRef, promise: featurePromptMountPromise } = useMountRefPromise();
  const featurePromptMergedRef = useMergeRefs(featurePromptRef, featurePromptMountRef);
  const allNotificationsSeen = useMemo(() => {
    return featureNotificationsData?.features.every(feature => !!seenFeatures[feature.id]);
  }, [featureNotificationsData, seenFeatures]);

  const defaultFeaturesFilter = (feature: Feature<unknown>) => {
    return feature.releaseDate >= subtractDaysFromDate(new Date(), 90);
  };

  const getFeaturesToDisplay = (payload: FeatureNotificationsPayload<unknown>): Array<Feature<unknown>> => {
    return payload.features
      .slice()
      .filter(payload.filterFeatures ? payload.filterFeatures : defaultFeaturesFilter)
      .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());
  };

  const mapPayloadToDrawer = (payload: FeatureNotifications): AppLayoutProps.Drawer => {
    return {
      id: payload.id,
      content: (
        <RuntimeFeaturesNotificationDrawer
          features={payload.features}
          featuresPageLink={payload.featuresPageLink}
          mountItem={payload.mountItem}
        />
      ),
      trigger: {
        iconName: 'suggestions',
      },
      ariaLabels: {
        closeButton: i18n('ariaLabels.closeButton', undefined),
        drawerName: i18n('ariaLabels.content', undefined) ?? '',
        triggerButton: i18n('ariaLabels.triggerButton', undefined),
        resizeHandle: i18n('ariaLabels.resizeHandle', undefined),
      },
      resizable: true,
      defaultSize: 320,
      badge: payload.badge,
    };
  };

  function featureNotificationsMessageHandler(event: WidgetMessage) {
    if (event.type === 'registerFeatureNotifications') {
      warnOnce('feature notifications', 'Feature notifications drawer is overriding the tools panel');
      const { payload } = event;
      const features = getFeaturesToDisplay(payload);
      if (features.length === 0) {
        return;
      }

      setFeatureNotificationsData({ ...payload, features });

      const persistenceConfig = payload.persistenceConfig ?? DEFAULT_PERSISTENCE_CONFIG;
      const __retrieveFeatureNotifications:
        | ((persistenceConfig: FeatureNotificationsPersistenceConfig) => Promise<PersistedFeaturesDict>)
        | undefined = (payload as any)?.__retrieveFeatureNotifications;

      // Retrieve previously seen feature notifications from persistence to determine
      // which features the user has already viewed
      (__retrieveFeatureNotifications || retrieveFeatureNotifications)(persistenceConfig).then(
        seenFeatureNotifications => {
          setSeenFeatures(seenFeatureNotifications);
          const hasUnseenFeatures = features.some(feature => !seenFeatureNotifications[feature.id]);
          if (hasUnseenFeatures) {
            if (!payload.suppressFeaturePrompt && !featurePromptDismissed) {
              featurePromptMountPromise.then(() => {
                featurePromptRef.current?.show();
              });
            }
            setFeatureNotificationsData(data => (data ? { ...data, badge: true } : data));
          }
        }
      );
      return;
    }

    if (event.type === 'showFeaturePromptIfPossible') {
      if (allNotificationsSeen) {
        return;
      }
      featurePromptRef.current?.show();
      return;
    }

    if (event.type === 'clearFeatureNotifications') {
      setFeatureNotificationsData(null);
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
        ref={featurePromptMergedRef}
        onShow={() => {
          triggerRef.current!.dataset!.awsuiSuppressTooltip = 'true';
        }}
        onDismiss={event => {
          if (event.detail?.method !== 'blur') {
            triggerRef?.current!.focus();
          }
          setFeaturePromptDismissed(true);
          Promise.resolve().then(() => {
            if (triggerRef.current?.dataset) {
              triggerRef.current!.dataset!.awsuiSuppressTooltip = 'false';
            }
          });
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

  const onOpenFeatureNotificationsDrawer = () => {
    if (!featureNotificationsData || allNotificationsSeen) {
      return;
    }
    const persistenceConfig = featureNotificationsData.persistenceConfig ?? DEFAULT_PERSISTENCE_CONFIG;
    const featuresMap = featureNotificationsData.features.reduce((acc, feature) => {
      return {
        ...acc,
        [feature.id]: feature.releaseDate,
      };
    }, {});
    const filteredSeenFeaturesMap = filterOutdatedFeatures(seenFeatures);
    const allFeaturesMap = { ...featuresMap, ...filteredSeenFeaturesMap };
    const __persistFeatureNotifications:
      | ((persistenceConfig: FeatureNotificationsPersistenceConfig) => Promise<PersistedFeaturesDict>)
      | undefined = (featureNotificationsData as any)?.__persistFeatureNotifications;
    (__persistFeatureNotifications ?? persistFeatureNotifications)(persistenceConfig, allFeaturesMap).then(() => {
      setSeenFeatures(allFeaturesMap);
      setFeatureNotificationsData(data => (data ? { ...data, badge: false } : data));
    });
  };

  const featureNotificationsProps: FeatureNotificationsProps = {
    renderLatestFeaturePrompt,
    drawer: featureNotificationsData && mapPayloadToDrawer(featureNotificationsData),
  };

  return {
    featureNotificationsProps,
    onOpenFeatureNotificationsDrawer,
    featureNotificationsMessageHandler,
  };
}
