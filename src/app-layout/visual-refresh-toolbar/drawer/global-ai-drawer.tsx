// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { InternalButton } from '../../../button/internal';
import PanelResizeHandle from '../../../internal/components/panel-resize-handle';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { usePrevious } from '../../../internal/hooks/use-previous';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import Toggle from '../../../toggle/internal';
import { AppLayoutInternals } from '../interfaces';
import { useResize } from './use-resize';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface AppLayoutGlobalAiDrawerImplementationProps {
  appLayoutInternals: AppLayoutInternals;
}

export function AppLayoutGlobalAiDrawerImplementation({
  appLayoutInternals,
}: AppLayoutGlobalAiDrawerImplementationProps) {
  const {
    activeAiDrawer,
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
  const [isWhiteHeader, setIsWhiteHeader] = useState(false);

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
            insetBlockStart: verticalOffsets.toolbar,
            ...(!isMobile && {
              [customCssProps.drawerSize]: `${['entering', 'entered'].includes(state) ? size : 0}px`,
            }),
          }}
          data-testid={activeDrawerId && `awsui-app-layout-drawer-${activeDrawerId}`}
        >
          {!isMobile && activeAiDrawer?.resizable && (
            <div className={styles['drawer-slider']}>
              <PanelResizeHandle
                ref={aiDrawerFocusControl.refs.slider}
                position="side-start"
                className={testutilStyles['drawers-slider']}
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
              <header className={clsx(styles['drawer-content-header'], isWhiteHeader && styles['white-header'])}>
                <div>
                  <svg width="113" height="30" viewBox="0 0 113 30" fill="none" focusable="true">
                    <path
                      d="M0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15Z"
                      fill="url(#paint0_linear_562_24682)"
                    />
                    <path
                      d="M21.2099 10.4099L15.8599 7.31986C15.6199 7.17986 15.3099 7.10986 14.9899 7.10986C14.6699 7.10986 14.3599 7.17986 14.1199 7.31986L8.7699 10.4099C8.2899 10.6799 7.8999 11.3599 7.8999 11.9099V18.0899C7.8999 18.6399 8.2899 19.3099 8.7699 19.5899L14.1299 22.6799C14.3699 22.8199 14.6799 22.8899 14.9999 22.8899C15.3199 22.8899 15.6299 22.8199 15.8699 22.6799L21.2299 19.5899C21.7099 19.3099 22.0999 18.6399 22.0999 18.0899V11.9099C22.0999 11.3599 21.7099 10.6799 21.2299 10.4099H21.2099ZM14.9899 20.8799L9.8999 17.9399V12.0599L14.9899 9.11986L20.0799 12.0599V16.7799L16.9899 14.9999V14.2599C16.9899 13.9999 16.8499 13.7699 16.6299 13.6399L15.3499 12.8999C15.2399 12.8399 15.1099 12.7999 14.9899 12.7999C14.8699 12.7999 14.7399 12.8299 14.6299 12.8999L13.3499 13.6399C13.1299 13.7699 12.9899 14.0099 12.9899 14.2599V15.7399C12.9899 15.9999 13.1299 16.2299 13.3499 16.3599L14.6299 17.0999C14.7399 17.1599 14.8699 17.1999 14.9899 17.1999C15.1099 17.1999 15.2399 17.1699 15.3499 17.0999L15.9899 16.7299L19.0799 18.5099L14.9899 20.8699V20.8799Z"
                      fill="white"
                    />
                    <path
                      d="M38.48 21C38.2987 21 38.208 20.9307 38.208 20.792C38.208 20.76 38.2133 20.7227 38.224 20.68C38.2347 20.6373 38.2613 20.5627 38.304 20.456L42.032 10.264C42.0853 10.1253 42.1493 10.0347 42.224 9.992C42.2987 9.93867 42.3947 9.912 42.512 9.912H43.92C44.0373 9.912 44.1333 9.93867 44.208 9.992C44.2933 10.0347 44.3573 10.1253 44.4 10.264L48.112 20.456C48.1547 20.5627 48.1813 20.6373 48.192 20.68C48.2027 20.7227 48.208 20.76 48.208 20.792C48.208 20.9307 48.1173 21 47.936 21H46.544C46.3413 21 46.2027 20.8933 46.128 20.68L45.296 18.216H41.04L40.224 20.68C40.1493 20.8933 40.0107 21 39.808 21H38.48ZM41.504 16.792H44.848L43.168 11.672L41.504 16.792ZM50.7899 21H49.6059C49.3712 21 49.2539 20.8827 49.2539 20.648V13.208C49.2539 12.9733 49.3712 12.856 49.6059 12.856H50.4539C50.6992 12.856 50.8432 12.968 50.8859 13.192L50.9979 13.672C52.0325 12.968 53.0139 12.616 53.9419 12.616C54.4539 12.616 54.8752 12.712 55.2059 12.904C55.5472 13.0853 55.8085 13.3573 55.9899 13.72C57.0565 12.984 58.0805 12.616 59.0619 12.616C59.4779 12.616 59.8672 12.6907 60.2299 12.84C60.5925 12.9787 60.8859 13.224 61.1099 13.576C61.3339 13.928 61.4459 14.408 61.4459 15.016V20.648C61.4459 20.8827 61.3285 21 61.0939 21H59.9099C59.6752 21 59.5579 20.8827 59.5579 20.648V15.48C59.5579 14.9893 59.4619 14.6373 59.2699 14.424C59.0779 14.2107 58.7632 14.104 58.3259 14.104C57.9739 14.104 57.6112 14.1627 57.2379 14.28C56.8645 14.3973 56.5499 14.536 56.2939 14.696V20.648C56.2939 20.8827 56.1765 21 55.9419 21H54.7579C54.5232 21 54.4059 20.8827 54.4059 20.648V15.48C54.4059 14.9893 54.3099 14.6373 54.1179 14.424C53.9259 14.2107 53.6112 14.104 53.1739 14.104C52.8965 14.104 52.5765 14.152 52.2139 14.248C51.8619 14.3333 51.5045 14.4827 51.1419 14.696V20.648C51.1419 20.8827 51.0245 21 50.7899 21ZM65.387 21.24C64.651 21.24 64.0483 21.016 63.579 20.568C63.1097 20.12 62.875 19.5387 62.875 18.824C62.875 18.0347 63.1577 17.4053 63.723 16.936C64.2883 16.4667 65.0563 16.232 66.027 16.232C66.5923 16.232 67.211 16.312 67.883 16.472V15.528C67.883 14.9947 67.7657 14.6213 67.531 14.408C67.307 14.184 66.8963 14.072 66.299 14.072C65.9363 14.072 65.5417 14.1093 65.115 14.184C64.6883 14.2587 64.2883 14.3547 63.915 14.472C63.8083 14.504 63.7177 14.52 63.643 14.52C63.5043 14.52 63.435 14.4187 63.435 14.216V13.624C63.435 13.4533 63.4617 13.3413 63.515 13.288C63.5683 13.224 63.675 13.16 63.835 13.096C64.251 12.936 64.699 12.8187 65.179 12.744C65.659 12.6587 66.1337 12.616 66.603 12.616C67.6483 12.616 68.4163 12.8293 68.907 13.256C69.4083 13.6827 69.659 14.3493 69.659 15.256V20.648C69.659 20.8827 69.5417 21 69.307 21H68.459C68.2243 21 68.091 20.8933 68.059 20.68L67.979 20.216C67.6163 20.536 67.2057 20.7867 66.747 20.968C66.299 21.1493 65.8457 21.24 65.387 21.24ZM65.915 19.896C66.2243 19.896 66.5497 19.8267 66.891 19.688C67.243 19.5493 67.5737 19.3627 67.883 19.128V17.592C67.6483 17.5387 67.3977 17.496 67.131 17.464C66.8643 17.432 66.6137 17.416 66.379 17.416C65.2697 17.416 64.715 17.848 64.715 18.712C64.715 19.0747 64.8163 19.3627 65.019 19.576C65.2323 19.7893 65.531 19.896 65.915 19.896ZM77.2623 21H71.3423C71.1076 21 70.9903 20.8827 70.9903 20.648V20.04C70.9903 19.848 71.0009 19.7147 71.0223 19.64C71.0543 19.5547 71.1396 19.432 71.2783 19.272L75.5343 14.296H71.5023C71.2676 14.296 71.1503 14.1787 71.1503 13.944V13.208C71.1503 12.9733 71.2676 12.856 71.5023 12.856H77.2143C77.4489 12.856 77.5663 12.9733 77.5663 13.208V13.816C77.5663 13.9973 77.5503 14.1307 77.5183 14.216C77.4969 14.3013 77.4169 14.424 77.2783 14.584L73.0223 19.56H77.2623C77.4969 19.56 77.6143 19.6773 77.6143 19.912V20.648C77.6143 20.8827 77.4969 21 77.2623 21ZM82.3608 21.24C81.1341 21.24 80.1688 20.8613 79.4648 20.104C78.7714 19.3467 78.4248 18.2853 78.4248 16.92C78.4248 15.5547 78.7714 14.4987 79.4648 13.752C80.1688 12.9947 81.1341 12.616 82.3608 12.616C83.5874 12.616 84.5474 12.9947 85.2408 13.752C85.9448 14.4987 86.2968 15.5547 86.2968 16.92C86.2968 18.2853 85.9448 19.3467 85.2408 20.104C84.5474 20.8613 83.5874 21.24 82.3608 21.24ZM82.3608 19.752C83.0221 19.752 83.5234 19.5227 83.8648 19.064C84.2061 18.6053 84.3768 17.8907 84.3768 16.92C84.3768 15.9493 84.2061 15.24 83.8648 14.792C83.5234 14.3333 83.0221 14.104 82.3608 14.104C81.7101 14.104 81.2088 14.3333 80.8568 14.792C80.5154 15.24 80.3448 15.9493 80.3448 16.92C80.3448 17.8907 80.5154 18.6053 80.8568 19.064C81.2088 19.5227 81.7101 19.752 82.3608 19.752ZM89.4005 21H88.2165C87.9818 21 87.8645 20.8827 87.8645 20.648V13.208C87.8645 12.9733 87.9818 12.856 88.2165 12.856H89.0645C89.2032 12.856 89.3045 12.8773 89.3685 12.92C89.4325 12.952 89.4752 13.032 89.4965 13.16L89.6245 13.752C90.6272 12.9947 91.6725 12.616 92.7605 12.616C93.5498 12.616 94.1418 12.824 94.5365 13.24C94.9418 13.6453 95.1445 14.2373 95.1445 15.016V20.648C95.1445 20.8827 95.0272 21 94.7925 21H93.6085C93.3738 21 93.2565 20.8827 93.2565 20.648V15.608C93.2565 15.0747 93.1498 14.6907 92.9365 14.456C92.7232 14.2213 92.3818 14.104 91.9125 14.104C91.5605 14.104 91.1978 14.168 90.8245 14.296C90.4618 14.4133 90.1045 14.584 89.7525 14.808V20.648C89.7525 20.8827 89.6352 21 89.4005 21ZM110.751 23.64C110.602 23.64 110.421 23.6133 110.207 23.56C109.333 23.336 108.522 23.032 107.775 22.648C107.039 22.2747 106.351 21.8107 105.711 21.256C104.666 21.224 103.759 20.9733 102.991 20.504C102.234 20.0347 101.647 19.3733 101.231 18.52C100.826 17.6667 100.623 16.648 100.623 15.464C100.623 14.2587 100.837 13.224 101.263 12.36C101.701 11.4853 102.314 10.8187 103.103 10.36C103.893 9.89067 104.831 9.656 105.919 9.656C107.007 9.656 107.946 9.89067 108.735 10.36C109.535 10.8187 110.149 11.4853 110.575 12.36C111.002 13.224 111.215 14.2587 111.215 15.464C111.215 16.9467 110.89 18.1733 110.239 19.144C109.599 20.1147 108.709 20.7547 107.567 21.064C108.037 21.3413 108.511 21.5493 108.991 21.688C109.471 21.8267 110.031 21.9227 110.671 21.976C110.917 21.9973 111.039 22.12 111.039 22.344V23.32C111.039 23.5333 110.943 23.64 110.751 23.64ZM105.919 19.64C106.997 19.64 107.818 19.2827 108.383 18.568C108.949 17.8533 109.231 16.8187 109.231 15.464C109.231 14.0987 108.949 13.064 108.383 12.36C107.818 11.6453 106.997 11.288 105.919 11.288C104.842 11.288 104.021 11.6453 103.455 12.36C102.89 13.064 102.607 14.0987 102.607 15.464C102.607 16.8187 102.89 17.8533 103.455 18.568C104.021 19.2827 104.842 19.64 105.919 19.64Z"
                      fill="#0F141A"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_562_24682"
                        x1="36.7021"
                        y1="5"
                        x2="2.58231"
                        y2="24.2488"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#77FFED" />
                        <stop offset="1" stopColor="#9A28EC" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
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
              </header>
              <Toggle checked={isWhiteHeader} onChange={({ detail }) => setIsWhiteHeader(detail.checked)}>
                White header
              </Toggle>
              {activeAiDrawer?.content}
            </div>
          </div>
          {!isMobile && <div className={styles['drawer-gap']} />}
        </aside>
      )}
    </Transition>
  );
}

export const createWidgetizedGlobalAppLayoutAiDrawer = createWidgetizedComponent(AppLayoutGlobalAiDrawerImplementation);
