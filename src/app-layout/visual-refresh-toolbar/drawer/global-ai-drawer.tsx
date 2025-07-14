// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { usePrevious } from '../../../internal/hooks/use-previous';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import { AppLayoutInternals, InternalDrawer } from '../interfaces';
import { useResize } from './use-resize';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface AppLayoutGlobalAiDrawerImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  show: boolean;
  activeAiDrawer: InternalDrawer | null;
}

export function AppLayoutGlobalAiDrawerImplementation({
  appLayoutInternals,
  show,
  activeAiDrawer,
}: AppLayoutGlobalAiDrawerImplementationProps) {
  const {
    activeAiDrawerSize,
    minAiDrawerSize,
    maxAiDrawerSize,
    ariaLabels,
    aiDrawerFocusControl,
    isMobile,
    verticalOffsets,
    drawersOpenQueue,
    onActiveAiDrawerChange,
    onActiveDrawerResize,
    expandedDrawerId,
    setExpandedDrawerId,
  } = appLayoutInternals;
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeDrawerId = activeAiDrawer?.id;

  const computedAriaLabels = {
    closeButton: activeAiDrawer ? activeAiDrawer.ariaLabels?.closeButton : ariaLabels?.toolsClose,
    content: activeAiDrawer ? activeAiDrawer.ariaLabels?.drawerName : ariaLabels?.tools,
  };

  const resizeProps = useResize({
    currentWidth: activeAiDrawerSize,
    minWidth: minAiDrawerSize,
    maxWidth: maxAiDrawerSize,
    panelRef: drawerRef,
    handleRef: aiDrawerFocusControl.refs.slider,
    onResize: size => onActiveDrawerResize({ id: activeDrawerId!, size }),
    position: 'side-start',
  });
  const size = getLimitedValue(minAiDrawerSize, activeAiDrawerSize, maxAiDrawerSize);
  const lastOpenedDrawerId = drawersOpenQueue?.length ? drawersOpenQueue[0] : activeDrawerId;
  const isExpanded = activeAiDrawer?.isExpandable && expandedDrawerId === activeDrawerId;
  const wasExpanded = usePrevious(isExpanded);
  const animationDisabled =
    (activeAiDrawer?.defaultActive && !drawersOpenQueue.includes(activeAiDrawer.id)) || (wasExpanded && !isExpanded);
  const drawerHeight = `calc(100vh - ${verticalOffsets.toolbar}}px)`;

  return (
    <Transition nodeRef={drawerRef} in={!!activeAiDrawer || isExpanded} appear={true} timeout={0}>
      {state => (
        <aside
          id={activeAiDrawer?.id}
          aria-hidden={!activeAiDrawer}
          aria-label={computedAriaLabels.content}
          className={clsx(
            styles.drawer,
            styles['ai-drawer'],
            !animationDisabled && isExpanded && styles['with-expanded-motion'],
            !show && styles['drawer-hidden'],
            {
              [sharedStyles['with-motion-horizontal']]: !animationDisabled,
              [styles['last-opened']]: lastOpenedDrawerId === activeDrawerId || isExpanded,
              [testutilStyles['active-drawer']]: activeDrawerId,
              [styles['drawer-hidden']]: !activeAiDrawer,
              [testutilStyles['drawer-closed']]: !activeAiDrawer,
              [styles['drawer-expanded']]: isExpanded,
            }
          )}
          ref={drawerRef}
          onBlur={e => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
              aiDrawerFocusControl.loseFocus();
            }
          }}
          style={{
            blockSize: drawerHeight,
            ...(!isMobile && {
              [customCssProps.drawerSize]: `${['entering', 'entered'].includes(state) ? size : 0}px`,
            }),
          }}
          data-testid={activeDrawerId && `awsui-app-layout-drawer-${activeDrawerId}`}
        >
          {!isMobile && activeAiDrawer?.resizable && !isExpanded && (
            <div className={styles['drawer-slider']}>
              <PanelResizeHandle
                ref={aiDrawerFocusControl.refs.slider}
                position="side-start"
                className={clsx(testutilStyles['drawers-slider'], styles['ai-drawer-slider-handle'])}
                ariaLabel={activeAiDrawer?.ariaLabels?.resizeHandle}
                tooltipText={activeAiDrawer?.ariaLabels?.resizeHandleTooltipText}
                ariaValuenow={resizeProps.relativeSize}
                onKeyDown={resizeProps.onKeyDown}
                onPointerDown={resizeProps.onPointerDown}
                onDirectionClick={resizeProps.onDirectionClick}
              />
            </div>
          )}
          <div className={clsx(styles['drawer-content-container'], sharedStyles['with-motion-horizontal'])}>
            <div className={styles['drawer-content']}>
              <header className={styles['drawer-content-header']}>
                <div className={styles['drawer-content-header-content']}>
                  <svg focusable="true" width="95" height="24" viewBox="0 0 95 24" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.8558 11.5099V12.3724L12.1338 12.8195L11.4016 12.3714V11.5109L12.1338 11.0659L12.8558 11.5099ZM12.3719 18.919C12.2192 19.0015 12.0379 19.0015 11.8851 18.919L6.28415 15.8761C6.1202 15.7875 6.01836 15.6164 6.01836 15.4291V8.56631C6.01836 8.37995 6.12122 8.20887 6.28517 8.11925L11.8872 5.08148C11.9625 5.03972 12.045 5.01936 12.1285 5.01936C12.212 5.01936 12.2945 5.03972 12.3709 5.08148L17.9719 8.11925C18.1369 8.20887 18.2387 8.37995 18.2387 8.56631V15.1144L13.874 12.376V11.2253C13.874 11.0481 13.7824 10.8841 13.6316 10.7914L12.4015 10.0358C12.2395 9.93703 12.0338 9.93601 11.8699 10.0348L10.6275 10.7904C10.4757 10.8831 10.3831 11.047 10.3831 11.2253V12.6571C10.3831 12.8343 10.4757 12.9982 10.6275 13.0909L11.8689 13.8516C11.9503 13.9025 12.042 13.927 12.1346 13.927C12.2273 13.927 12.321 13.9015 12.4025 13.8506L13.3628 13.2569L17.7397 16.0034L12.3719 18.919ZM18.4577 7.22363L12.8577 4.18687C12.4004 3.93737 11.8566 3.93839 11.4004 4.18585L5.79941 7.22363C5.30653 7.49146 5 8.00573 5 8.56583V15.4286C5 15.9897 5.30653 16.504 5.7984 16.7708L11.3994 19.8136C11.6275 19.9379 11.878 20 12.1285 20C12.3791 20 12.6296 19.9379 12.8577 19.8136L18.4587 16.7708C18.9505 16.504 19.2571 15.9897 19.2571 15.4286V8.56583C19.2571 8.00573 18.9505 7.49146 18.4577 7.22363Z"
                      fill="url(#paint0_radial_298_56201)"
                    />
                    <path
                      d="M32.944 17L32.258 14.788H28.94L28.282 17H26.084L29.5 7.298H31.81L35.226 17H32.944ZM29.388 13.276H31.824L30.592 9.216L29.388 13.276ZM45.1525 17V12.156C45.1525 11.5213 44.8679 11.204 44.2985 11.204C43.7945 11.204 43.2859 11.3253 42.7725 11.568V11.708V17H40.7285V12.156C40.7285 11.5213 40.4439 11.204 39.8745 11.204C39.3519 11.204 38.8385 11.33 38.3345 11.582V17H36.2905V9.846H37.9705L38.1525 10.532C38.6472 10.2053 39.0905 9.97667 39.4825 9.846C39.8839 9.706 40.2945 9.636 40.7145 9.636C41.5545 9.636 42.1472 9.93467 42.4925 10.532C42.9685 10.2147 43.4165 9.986 43.8365 9.846C44.2565 9.706 44.6905 9.636 45.1385 9.636C45.7919 9.636 46.2959 9.818 46.6505 10.182C47.0145 10.546 47.1965 11.0547 47.1965 11.708V17H45.1525ZM53.2304 17L53.0624 16.37C52.7731 16.6313 52.4371 16.8413 52.0544 17C51.6811 17.1493 51.3171 17.224 50.9624 17.224C50.2718 17.224 49.7164 17.028 49.2964 16.636C48.8858 16.244 48.6804 15.7213 48.6804 15.068C48.6804 14.62 48.7924 14.228 49.0164 13.892C49.2404 13.5467 49.5624 13.276 49.9824 13.08C50.4024 12.884 50.8971 12.786 51.4664 12.786C51.9144 12.786 52.4091 12.8467 52.9504 12.968V12.268C52.9504 11.8387 52.8618 11.5447 52.6844 11.386C52.5071 11.2273 52.1804 11.148 51.7044 11.148C50.9391 11.148 50.0944 11.2927 49.1704 11.582V10.224C49.5158 10.0467 49.9498 9.90667 50.4724 9.804C50.9951 9.692 51.5271 9.636 52.0684 9.636C53.0298 9.636 53.7298 9.832 54.1684 10.224C54.6164 10.6067 54.8404 11.2133 54.8404 12.044V17H53.2304ZM51.5364 15.852C51.7698 15.852 52.0078 15.8007 52.2504 15.698C52.5024 15.5953 52.7358 15.4553 52.9504 15.278V14.06C52.5398 13.9947 52.1711 13.962 51.8444 13.962C51.0324 13.962 50.6264 14.2887 50.6264 14.942C50.6264 15.2313 50.7058 15.4553 50.8644 15.614C51.0231 15.7727 51.2471 15.852 51.5364 15.852ZM56.239 17V15.544L59.921 11.358H56.379V9.846H62.175V11.302L58.451 15.488H62.245V17H56.239ZM66.7166 17.21C65.6059 17.21 64.7379 16.8787 64.1126 16.216C63.4873 15.544 63.1746 14.6107 63.1746 13.416C63.1746 12.2307 63.4873 11.3067 64.1126 10.644C64.7379 9.972 65.6059 9.636 66.7166 9.636C67.8273 9.636 68.6953 9.972 69.3206 10.644C69.9459 11.3067 70.2586 12.2307 70.2586 13.416C70.2586 14.6107 69.9459 15.544 69.3206 16.216C68.6953 16.8787 67.8273 17.21 66.7166 17.21ZM66.7166 15.642C67.6966 15.642 68.1866 14.9 68.1866 13.416C68.1866 11.9413 67.6966 11.204 66.7166 11.204C65.7366 11.204 65.2466 11.9413 65.2466 13.416C65.2466 14.9 65.7366 15.642 66.7166 15.642ZM76.4431 17V12.31C76.4431 11.9273 76.3591 11.6473 76.1911 11.47C76.0231 11.2927 75.7664 11.204 75.4211 11.204C74.9078 11.204 74.3991 11.3627 73.8951 11.68V17H71.8511V9.846H73.5311L73.7271 10.616C74.5671 9.96267 75.4631 9.636 76.4151 9.636C77.0778 9.636 77.5864 9.818 77.9411 10.182C78.3051 10.5367 78.4871 11.0453 78.4871 11.708V17H76.4431ZM83.9474 12.142C83.9474 11.1153 84.1294 10.2193 84.4934 9.454C84.8668 8.68867 85.4081 8.10067 86.1174 7.69C86.8361 7.27 87.6901 7.06 88.6794 7.06C89.6408 7.06 90.4761 7.26067 91.1854 7.662C91.8948 8.06333 92.4408 8.64667 92.8234 9.412C93.2154 10.168 93.4114 11.078 93.4114 12.142C93.4114 13.3833 93.1454 14.424 92.6134 15.264C92.0908 16.104 91.3441 16.678 90.3734 16.986C90.7654 17.2007 91.1854 17.364 91.6334 17.476C92.0814 17.5973 92.6088 17.6813 93.2154 17.728V19.436C92.3754 19.3427 91.5401 19.1 90.7094 18.708C89.8881 18.3253 89.1508 17.8307 88.4974 17.224C87.0788 17.1867 85.9634 16.72 85.1514 15.824C84.3488 14.9187 83.9474 13.6913 83.9474 12.142ZM86.1034 12.142C86.1034 13.2433 86.3228 14.0833 86.7614 14.662C87.2001 15.2407 87.8394 15.53 88.6794 15.53C89.5194 15.53 90.1588 15.2407 90.5974 14.662C91.0361 14.0833 91.2554 13.2433 91.2554 12.142C91.2554 11.0407 91.0361 10.2053 90.5974 9.636C90.1588 9.05733 89.5194 8.768 88.6794 8.768C87.8394 8.768 87.2001 9.05733 86.7614 9.636C86.3228 10.2053 86.1034 11.0407 86.1034 12.142Z"
                      fill="#7300E5"
                    />
                    <defs>
                      <radialGradient
                        id="paint0_radial_298_56201"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(20.5296 2.57191) rotate(131.703) scale(25.256 32.1012)"
                      >
                        <stop stopColor="#B8E7FF" />
                        <stop offset="0.3" stopColor="#0099FF" />
                        <stop offset="0.45" stopColor="#5C7FFF" />
                        <stop offset="0.6" stopColor="#8575FF" />
                        <stop offset="0.8" stopColor="#962EFF" />
                      </radialGradient>
                    </defs>
                  </svg>
                  <div className={styles['drawer-actions']}>
                    {!isMobile && activeAiDrawer?.isExpandable && (
                      <div className={styles['drawer-expanded-mode-button']}>
                        <InternalButton
                          ariaLabel={activeAiDrawer?.ariaLabels?.expandedModeButton}
                          className={testutilStyles['active-drawer-expanded-mode-button']}
                          formAction="none"
                          ariaExpanded={isExpanded}
                          iconName={isExpanded ? 'shrink' : 'expand'}
                          onClick={() => setExpandedDrawerId(isExpanded ? null : activeDrawerId!)}
                          variant="icon"
                          analyticsAction={isExpanded ? 'expand' : 'collapse'}
                        />
                      </div>
                    )}
                    <div className={clsx(styles['drawer-close-button'])}>
                      <InternalButton
                        ariaLabel={computedAriaLabels.closeButton}
                        className={clsx({
                          [testutilStyles['active-drawer-close-button']]: activeDrawerId,
                        })}
                        formAction="none"
                        iconName={isMobile ? 'close' : 'angle-left'}
                        onClick={() => onActiveAiDrawerChange(null, { initiatedByUserAction: true })}
                        ref={aiDrawerFocusControl.refs.close}
                        variant="icon"
                        analyticsAction="close"
                      />
                    </div>
                  </div>
                </div>
                {!isMobile && isExpanded && activeAiDrawer?.ariaLabels?.exitExpandedModeButton && (
                  <div className={styles['drawer-back-to-console-button']}>
                    <InternalButton
                      ariaLabel={activeAiDrawer?.ariaLabels?.exitExpandedModeButton}
                      formAction="none"
                      onClick={() => setExpandedDrawerId(null)}
                      variant="expanded-mode-dismiss"
                    >
                      {activeAiDrawer?.ariaLabels?.exitExpandedModeButton}
                    </InternalButton>
                  </div>
                )}
              </header>
              {activeAiDrawer?.content}
            </div>
          </div>
        </aside>
      )}
    </Transition>
  );
}

export const createWidgetizedGlobalAppLayoutAiDrawer = createWidgetizedComponent(AppLayoutGlobalAiDrawerImplementation);
