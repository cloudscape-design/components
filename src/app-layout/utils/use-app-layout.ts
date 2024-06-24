// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { useMobile } from '../../internal/hooks/use-mobile';
import { useInternalI18n } from '../../i18n/context';
import { applyDefaults } from '../defaults';
import { useControllable } from '../../internal/hooks/use-controllable';
import { NonCancelableCustomEvent } from '../../internal/events';
import { useAppLayoutPlacement } from './use-app-layout-placement';
import { AppLayoutProps, AppLayoutInternalProps, AppLayoutPropsWithDefaults } from '../interfaces';

export function useAppLayout({
  headerSelector,
  footerSelector,
  contentType,
  maxContentWidth,
  minContentWidth,
  navigationOpen: controlledNavigationOpen,
  onNavigationChange: controlledOnNavigationChange,
  ...rest
}: AppLayoutPropsWithDefaults) {
  const isRefresh = useVisualRefresh();
  const isMobile = useMobile();

  const i18n = useInternalI18n('app-layout');
  const ariaLabels = {
    navigation: i18n('ariaLabels.navigation', rest.ariaLabels?.navigation),
    navigationClose: i18n('ariaLabels.navigationClose', rest.ariaLabels?.navigationClose),
    navigationToggle: i18n('ariaLabels.navigationToggle', rest.ariaLabels?.navigationToggle),
    notifications: i18n('ariaLabels.notifications', rest.ariaLabels?.notifications),
    tools: i18n('ariaLabels.tools', rest.ariaLabels?.tools),
    toolsClose: i18n('ariaLabels.toolsClose', rest.ariaLabels?.toolsClose),
    toolsToggle: i18n('ariaLabels.toolsToggle', rest.ariaLabels?.toolsToggle),
    drawers: i18n('ariaLabels.drawers', rest.ariaLabels?.drawers),
    drawersOverflow: i18n('ariaLabels.drawersOverflow', rest.ariaLabels?.drawersOverflow),
    drawersOverflowWithBadge: i18n('ariaLabels.drawersOverflowWithBadge', rest.ariaLabels?.drawersOverflowWithBadge),
  };
  const { navigationOpen: defaultNavigationOpen, ...restDefaults } = applyDefaults(
    contentType,
    { maxContentWidth, minContentWidth },
    isRefresh
  );

  const [navigationOpen = false, setNavigationOpen] = useControllable(
    controlledNavigationOpen,
    controlledOnNavigationChange,
    isMobile ? false : defaultNavigationOpen,
    { componentName: 'AppLayout', controlledProp: 'navigationOpen', changeHandler: 'onNavigationChange' }
  );
  const onNavigationChange = (event: NonCancelableCustomEvent<AppLayoutProps.ChangeDetail>) => {
    setNavigationOpen(event.detail.open);
    controlledOnNavigationChange?.(event);
  };

  const [rootRef, placement] = useAppLayoutPlacement(headerSelector, footerSelector);

  const props: AppLayoutInternalProps = {
    contentType,
    navigationOpen,
    onNavigationChange,
    ...restDefaults,
    ...rest,
    ariaLabels,
    placement,
  };

  return { rootRef, props };
}
