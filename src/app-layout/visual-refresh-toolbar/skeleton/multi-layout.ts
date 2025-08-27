// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useLayoutEffect, useState } from 'react';

import { metrics } from '../../../internal/metrics';
import { awsuiPluginsInternal } from '../../../internal/plugins/api';
import { RegistrationState } from '../../../internal/plugins/controllers/app-layout-widget';
import { useAppLayoutFlagEnabled } from '../../utils/feature-flags';
import { MergeProps, SharedProps } from '../state/interfaces';
import { ToolbarProps } from '../toolbar';

export type DeduplicationType = 'primary' | 'secondary' | 'suspended' | 'off';

export function useMultiAppLayout(
  forceDeduplicationType: DeduplicationType,
  isEnabled: boolean,
  props: SharedProps,
  mergeProps: MergeProps
): { registered: boolean; toolbarProps: ToolbarProps | null } {
  const [registration, setRegistration] = useState<RegistrationState<SharedProps> | null>(null);
  const isToolbar = useAppLayoutFlagEnabled();

  useLayoutEffect(() => {
    if (!isEnabled || forceDeduplicationType === 'suspended' || !isToolbar) {
      return;
    }
    if (forceDeduplicationType === 'off') {
      setRegistration({ type: 'primary', discoveredProps: [] });
      return;
    }
    const unregister = awsuiPluginsInternal.appLayoutWidget.register(forceDeduplicationType, props =>
      setRegistration(props as RegistrationState<SharedProps>)
    );
    return () => {
      unregister();
      setRegistration({ type: 'suspended' });
    };
  }, [forceDeduplicationType, isEnabled, isToolbar]);

  useLayoutEffect(() => {
    if (registration?.type === 'secondary') {
      registration.update(props);
    }
  });

  useEffect(() => {
    if (registration) {
      reportMultiLayoutMetric(registration);
    }
  }, [registration]);

  if (!isToolbar) {
    return {
      registered: true,
      // mergeProps is needed here because the toolbar's behavior depends on reconciliation logic
      // in this function. For example, navigation trigger visibility
      toolbarProps: mergeProps(props, []),
    };
  }

  return {
    registered: !!registration?.type,
    toolbarProps: registration?.type === 'primary' ? mergeProps(props, registration.discoveredProps) : null,
  };
}

function reportMultiLayoutMetric(registration: RegistrationState<SharedProps>) {
  if (registration.type === 'primary' && registration.discoveredProps.length > 0) {
    metrics.sendOpsMetricObject('awsui-multi-layout-usage-primary', {
      // temporary workaround for missing typings
      // https://github.com/cloudscape-design/component-toolkit/pull/153
      instancesCount: registration.discoveredProps.length as any,
    });
  } else if (registration.type === 'suspended') {
    metrics.sendOpsMetricObject('awsui-multi-layout-usage-suspended', {});
  }
}
