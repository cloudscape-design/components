// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { NonCancelableEventHandler } from '../../internal/events';
import TriggerButton, { TriggerButtonProps } from './trigger-button';
import { useAppLayoutInternals } from './context';
import splitPanelStyles from '../../split-panel/styles.css.js';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export interface DrawersProps {
  activeDrawerId: string;
  items: ReadonlyArray<DrawersProps.Drawer>;
  onChange: NonCancelableEventHandler<DrawersProps.ChangeDetail>;
}

export namespace DrawersProps {
  export interface Drawer {
    content: React.ReactNode;
    id: string;
    trigger: TriggerButtonProps;
  }

  export interface ChangeDetail {
    activeDrawerId: string | null;
  }
}

/**
 *
 */
function Container({ children }: any) {
  const { drawers } = useAppLayoutInternals();

  if (!drawers) {
    return null;
  }

  return <div className={styles['drawers-container']}>{children}</div>;
}

/**
 *
 */
function Items() {
  return <></>;
}

/**
 *
 */
function Triggers() {
  const {
    ariaLabels,
    drawers,
    handleSplitPanelClick,
    // handleToolsClick,
    isMobile,
    isSplitPanelOpen,
    // isToolsOpen,
    splitPanel,
    splitPanelDisplayed,
    splitPanelPosition,
    splitPanelRefs,
    splitPanelToggle,
    toolsHide,
    toolsRefs,
  } = useAppLayoutInternals();

  if (isMobile) {
    return null;
  }

  const hasSplitPanel = splitPanel && splitPanelDisplayed && splitPanelPosition === 'side' ? true : false;
  const hasOpenDrawer = hasSplitPanel && isSplitPanelOpen;

  return (
    <aside
      className={clsx(styles['drawers-triggers'], {
        [styles['has-open-drawer']]: hasOpenDrawer,
      })}
    >
      {!toolsHide && (
        <TriggerButton
          ariaLabel={ariaLabels?.toolsToggle}
          className={testutilStyles['tools-toggle']}
          iconName="status-info"
          onClick={() => console.log('trigger click')}
          // onClick={() => handleToolsClick(!isToolsOpen)}
          ref={toolsRefs.toggle}
          // selected={hasToolsForm && isToolsOpen}
        />
      )}

      {drawers.items.map((item: any) => (
        <TriggerButton
          ariaLabel={item.trigger.ariaLabel}
          iconName={item.trigger.iconName}
          iconSvg={item.trigger.iconSvg}
          key={item.id}
          onClick={() => console.log('trigger click')}
          /*
          onClick={() => {
            const activeDrawerId = item.id !== drawers.activeDrawerId ? item.id : null;

            if (activeDrawerId && isToolsOpen) {
              handleToolsClick(!isToolsOpen);
            }

            drawers.onChange(activeDrawerId);
          }}
          */
          selected={item.id === drawers.activeDrawerId}
        />
      ))}

      {hasSplitPanel && splitPanelToggle.displayed && (
        <TriggerButton
          ariaLabel={splitPanelToggle.ariaLabel}
          className={splitPanelStyles['open-button']}
          iconName="view-vertical"
          onClick={() => handleSplitPanelClick()}
          selected={hasSplitPanel && isSplitPanelOpen}
          ref={splitPanelRefs.toggle}
        />
      )}
    </aside>
  );
}

export default {
  Container: Container,
  Items: Items,
  Triggers: Triggers,
};
