// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject, useMemo, useRef, useState } from 'react';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../../../i18n/context';
import FeaturePrompt, { FeaturePromptProps } from '../../../internal/do-not-use/feature-prompt';
import { metrics } from '../../../internal/metrics';
import { persistFeatureNotifications, retrieveFeatureNotifications } from '../../../internal/persistence';
import {
  Feature,
  FeatureNotificationsPayload,
  PersistedFeaturesDict,
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

const FEATURE_NOTIFICATIONS_RETENTION_DAYS = 180;
const DEFAULT_FEATURE_FILTER_DAYS = 90;

function subtractDaysFromDate(currentDate: Date, daysToSubtract: number = 0): Date {
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
    return feature.releaseDate >= subtractDaysFromDate(new Date(), DEFAULT_FEATURE_FILTER_DAYS);
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
          i18nStrings={payload.i18nStrings}
        />
      ),
      trigger: {
        iconSvg: (
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
            <path d="M7 4L14.3244 1.25334C14.6513 1.13076 15 1.3724 15 1.7215V13.2785C15 13.6276 14.6513 13.8692 14.3244 13.7467L7 11" />
            <path d="M1 6C1 4.89543 1.89543 4 3 4H7V11H3C1.89543 11 1 10.1046 1 9V6Z" />
            <path d="M9.93649 12.1466C9.66614 13.4393 8.51989 14.4102 7.14687 14.4102C5.57286 14.4102 4.29688 13.1342 4.29688 11.5602C4.29688 11.3685 4.31579 11.1813 4.35187 11.0002" />
          </svg>
        ),
      },
      ariaLabels: {
        closeButton: i18n('ariaLabels.closeButton', payload.i18nStrings?.closeButtonAriaLabel),
        drawerName: i18n('ariaLabels.content', payload.i18nStrings?.contentAriaLabel) ?? '',
        triggerButton: i18n('ariaLabels.triggerButton', payload.i18nStrings?.triggerButtonAriaLabel),
        resizeHandle: i18n('ariaLabels.resizeHandle', payload.i18nStrings?.resizeHandleAriaLabel),
      },
      resizable: true,
      defaultSize: 320,
      badge: payload.badge,
    };
  };

  function featureNotificationsMessageHandler(event: WidgetMessage) {
    if (event.type === 'registerFeatureNotifications') {
      const { payload } = event;
      metrics.logComponentUsed('feature-notifications', {
        props: {
          featuresPageLink: payload.featuresPageLink,
          suppressFeaturePrompt: payload.suppressFeaturePrompt,
        },
        metadata: {
          featuresLength: payload.features.length,
          hasMountItem: !!payload.mountItem,
          hasFilterFeatures: !!payload.filterFeatures,
          hasPersistenceConfig: !!payload.persistenceConfig,
        },
      });
      const features = getFeaturesToDisplay(payload);
      if (features.length === 0) {
        return;
      }

      setFeatureNotificationsData({ ...payload, features });

      const persistenceConfig = payload.persistenceConfig ?? DEFAULT_PERSISTENCE_CONFIG;
      // Retrieve previously seen feature notifications from persistence to determine
      // which features the user has already viewed
      (payload?.__retrieveFeatureNotifications || retrieveFeatureNotifications)(persistenceConfig).then(
        seenFeatureNotifications => {
          setSeenFeatures(seenFeatureNotifications);
          const hasUnseenFeatures = features.some(feature => !seenFeatureNotifications[feature.id]);
          if (hasUnseenFeatures) {
            const latestFeature = features.find(feature => !seenFeatureNotifications[feature.id]) ?? null;
            if (
              !payload.suppressFeaturePrompt &&
              !featurePromptDismissed &&
              !seenFeatureNotifications[getFeaturePromptPersistenceId(latestFeature)]
            ) {
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

    if (event.type === 'showFeaturePromptIfPossible' && !allNotificationsSeen) {
      featurePromptRef.current?.show();
      return;
    }

    if (event.type === 'clearFeatureNotifications') {
      setFeatureNotificationsData(null);
      return;
    }
  }

  function getLatestUnseenFeature() {
    return featureNotificationsData?.features.find(feature => !seenFeatures[feature.id]) ?? null;
  }

  function renderLatestFeaturePrompt({ triggerRef }: RenderLatestFeaturePromptProps) {
    const latestFeature = getLatestUnseenFeature();
    if (!triggerRef.current || !latestFeature) {
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
          persistFeaturePromptDismiss(latestFeature);
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

  const setFeaturesToSeenAndPersist = () => {
    const persistenceConfig = featureNotificationsData?.persistenceConfig ?? DEFAULT_PERSISTENCE_CONFIG;
    const featuresMap = featureNotificationsData?.features.reduce((acc, feature) => {
      return {
        ...acc,
        [feature.id]: feature.releaseDate,
      };
    }, {});
    const filteredSeenFeaturesMap = filterOutdatedFeatures(seenFeatures);
    const allFeaturesMap = { ...featuresMap, ...filteredSeenFeaturesMap };
    (featureNotificationsData?.__persistFeatureNotifications ?? persistFeatureNotifications)(
      persistenceConfig,
      allFeaturesMap
    ).then(() => {
      setSeenFeatures(allFeaturesMap);
      setFeatureNotificationsData(data => (data ? { ...data, badge: false } : data));
    });
  };

  const getFeaturePromptPersistenceId = (feature?: Feature<unknown> | null) => `${feature?.id}_feature-prompt`;

  const persistFeaturePromptDismiss = (feature: Feature<unknown>) => {
    const persistenceConfig = featureNotificationsData?.persistenceConfig ?? DEFAULT_PERSISTENCE_CONFIG;
    const featuresMap = { [getFeaturePromptPersistenceId(feature)]: feature.releaseDate?.toString() };
    const filteredSeenFeaturesMap = filterOutdatedFeatures(seenFeatures);
    const allFeaturesMap = { ...featuresMap, ...filteredSeenFeaturesMap };
    (featureNotificationsData?.__persistFeatureNotifications ?? persistFeatureNotifications)(
      persistenceConfig,
      allFeaturesMap
    ).then(() => {
      setSeenFeatures(allFeaturesMap);
    });
  };

  const onOpenFeatureNotificationsDrawer = () => {
    if (!featureNotificationsData || allNotificationsSeen) {
      return;
    }

    setFeaturesToSeenAndPersist();
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
