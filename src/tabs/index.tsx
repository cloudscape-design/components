// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import InternalContainer from '../container/internal';
import { TabsProps } from './interfaces';
import clsx from 'clsx';
import styles from './styles.css.js';
import { getTabElementId, TabHeaderBar } from './tab-header-bar';
import { useControllable } from '../internal/hooks/use-controllable';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { checkSafeUrl } from '../internal/utils/check-safe-url';

export { TabsProps };

let lastGeneratedId = 0;
export const nextGeneratedId = () => `awsui-tabs-${lastGeneratedId++}-${Math.round(Math.random() * 10000)}`;

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
  ...rest
}: TabsProps) {
  for (const tab of tabs) {
    checkSafeUrl('Tabs', tab.href);
  }

  const [idNamespace] = useState(() => nextGeneratedId());

  const [activeTabId, setActiveTabId] = useControllable(controlledTabId, onChange, firstEnabledTab(tabs)?.id ?? '', {
    componentName: 'Tabs',
    controlledProp: 'activeTabId',
    changeHandler: 'onChange',
  });

  const { __internalRootRef } = useBaseComponent('Tabs', { tabs, activeTabId });

  const baseProps = getBaseProps(rest);

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
      >
        {content()}
      </InternalContainer>
    );
  }

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root, styles.tabs)} ref={__internalRootRef}>
      {header}
      {content()}
    </div>
  );
}

applyDisplayName(Tabs, 'Tabs');
