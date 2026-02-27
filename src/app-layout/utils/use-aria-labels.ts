// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useInternalI18n } from '../../i18n/context';
import { AppLayoutProps } from '../interfaces';

export function useAriaLabels(ariaLabelsOverride: AppLayoutProps.Labels | undefined): AppLayoutProps.Labels {
  const i18n = useInternalI18n('app-layout');
  return {
    navigation: i18n('ariaLabels.navigation', ariaLabelsOverride?.navigation),
    navigationClose: i18n('ariaLabels.navigationClose', ariaLabelsOverride?.navigationClose),
    navigationToggle: i18n('ariaLabels.navigationToggle', ariaLabelsOverride?.navigationToggle),
    notifications: i18n('ariaLabels.notifications', ariaLabelsOverride?.notifications),
    tools: i18n('ariaLabels.tools', ariaLabelsOverride?.tools),
    toolsClose: i18n('ariaLabels.toolsClose', ariaLabelsOverride?.toolsClose),
    toolsToggle: i18n('ariaLabels.toolsToggle', ariaLabelsOverride?.toolsToggle),
    drawers: i18n('ariaLabels.drawers', ariaLabelsOverride?.drawers),
    drawersOverflow: i18n('ariaLabels.drawersOverflow', ariaLabelsOverride?.drawersOverflow),
    drawersOverflowWithBadge: i18n('ariaLabels.drawersOverflowWithBadge', ariaLabelsOverride?.drawersOverflowWithBadge),
  };
}
