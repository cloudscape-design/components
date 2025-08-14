// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useLayoutEffect, useState } from 'react';

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
