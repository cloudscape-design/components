// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalContainer from '../container/internal';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { GeneratedAnalyticsMetadataTabsComponent } from './analytics-metadata/interfaces';
import { TabsProps } from './interfaces';
import { getTabElementId, TabHeaderBar } from './tab-header-bar';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export { TabsProps };

function firstEnabledTab(tabs: ReadonlyArray<TabsProps.Tab>) {
  const enabledTabs = tabs.filter(tab => !tab.disabled);
  if (enabledTabs.length > 0) {
    return enabledTabs[0];
  }
  return null;
}

export default function Tabs({
  tabs,
  variant = 'default',
  onChange,
  activeTabId: controlledTabId,
  ariaLabel,
  ariaLabelledby,
  disableContentPaddings = false,
  i18nStrings,
  fitHeight,
  keyboardActivationMode = 'automatic',
  ...rest
}: TabsProps) {
  for (const tab of tabs) {
    checkSafeUrl('Tabs', tab.href);
  }
  const { __internalRootRef } = useBaseComponent('Tabs', {
    props: { disableContentPaddings, variant, fitHeight, keyboardActivationMode },
    metadata: {
      hasActions: tabs.some(tab => !!tab.action),
      hasDisabledReasons: tabs.some(tab => !!tab.disabledReason),
    },
  });
  const idNamespace = useUniqueId('awsui-tabs-');

  const [activeTabId, setActiveTabId] = useControllable(controlledTabId, onChange, firstEnabledTab(tabs)?.id ?? '', {
    componentName: 'Tabs',
    controlledProp: 'activeTabId',
    changeHandler: 'onChange',
  });

  const baseProps = getBaseProps(rest);

  const analyticsComponentMetadata: GeneratedAnalyticsMetadataTabsComponent = {
    name: 'awsui.Tabs',
    label: `.${analyticsSelectors['tabs-header-list']}`,
  };

  if (activeTabId) {
    analyticsComponentMetadata.properties = {
      activeTabId,
      activeTabLabel: `.${analyticsSelectors['active-tab-header']} .${analyticsSelectors['tab-label']}`,
      activeTabPosition: `${tabs.findIndex(tab => tab.id === activeTabId) + 1}`,
      tabsCount: `${tabs.length}`,
    };
  }

  const content = () => {
    const selectedTab = tabs.filter(tab => tab.id === activeTabId)[0];
    const renderContent = (tab: TabsProps.Tab) => {
      const isTabSelected = tab === selectedTab;

      const classes = clsx({
        [styles['tabs-content']]: true,
        [styles['tabs-content-active']]: isTabSelected,
      });

      const contentAttributes: JSX.IntrinsicElements['div'] = {
        className: classes,
        role: 'tabpanel',
        id: `${idNamespace}-${tab.id}-panel`,
        key: `${idNamespace}-${tab.id}-panel`,
        tabIndex: 0,
        'aria-labelledby': getTabElementId({ namespace: idNamespace, tabId: tab.id }),
      };

      const isContentShown = isTabSelected && !selectedTab.disabled;
      return <div {...contentAttributes}>{isContentShown && selectedTab.content}</div>;
    };

    return (
      <div
        className={clsx(
          variant === 'container' || variant === 'stacked'
            ? styles['tabs-container-content-wrapper']
            : styles['tabs-content-wrapper'],
          {
            [styles['with-paddings']]: !disableContentPaddings,
          }
        )}
      >
        {tabs.map(renderContent)}
      </div>
    );
  };

  const header = (
    <TabHeaderBar
      activeTabId={activeTabId}
      variant={variant}
      idNamespace={idNamespace}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      tabs={tabs}
      onChange={changeDetail => {
        setActiveTabId(changeDetail.activeTabId);
        fireNonCancelableEvent(onChange, changeDetail);
      }}
      i18nStrings={i18nStrings}
      keyboardActivationMode={keyboardActivationMode}
    />
  );

  if (variant === 'container' || variant === 'stacked') {
    return (
      <InternalContainer
        header={header}
        disableHeaderPaddings={true}
        {...baseProps}
        className={clsx(baseProps.className, styles.root)}
        __internalRootRef={__internalRootRef}
        disableContentPaddings={true}
        variant={variant === 'stacked' ? 'stacked' : 'default'}
        fitHeight={fitHeight}
        {...getAnalyticsMetadataAttribute({ component: analyticsComponentMetadata })}
      >
        {content()}
      </InternalContainer>
    );
  }

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root, styles.tabs, { [styles['fit-height']]: fitHeight })}
      ref={__internalRootRef}
      {...getAnalyticsMetadataAttribute({ component: analyticsComponentMetadata })}
    >
      {header}
      {content()}
    </div>
  );
}

applyDisplayName(Tabs, 'Tabs');
