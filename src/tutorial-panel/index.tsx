// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { useCallback, useContext, useRef } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { hotspotContext } from '../annotation-context/context';
import { getBaseProps } from '../internal/base-component';
import { NonCancelableCustomEvent } from '../internal/events';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import TutorialDetailView from './components/tutorial-detail-view';
import TutorialList from './components/tutorial-list';
import { TutorialPanelProps } from './interfaces';

import styles from './styles.css.js';

export { TutorialPanelProps };

export default function TutorialPanel({
  i18nStrings,
  loading,
  tutorials,
  onFeedbackClick,
  downloadUrl,
  ...restProps
}: TutorialPanelProps) {
  const { __internalRootRef } = useBaseComponent('TutorialPanel');

  const baseProps = getBaseProps(restProps);
  const context = useContext(hotspotContext);

  // should focus on the header (on exiting tutorial, we have to know and
  // focus on header for accessiblity reasons)
  const shouldFocusRef = useRef(false);
  const headerId = useUniqueId('tutorial-header-');

  const headerCallbackRef = useCallback((node: HTMLDivElement | null) => {
    if (node && shouldFocusRef.current) {
      node.focus({ preventScroll: true });
      shouldFocusRef.current = false;
    }
  }, []);

  const handleExitTutorial = useCallback(
    (e: NonCancelableCustomEvent<TutorialPanelProps.TutorialDetail>) => {
      shouldFocusRef.current = true;
      context.onExitTutorial(e);
    },
    [context]
  );

  return (
    <>
      <div {...baseProps} className={clsx(baseProps.className, styles['tutorial-panel'])} ref={__internalRootRef}>
        {context.currentTutorial ? (
          <TutorialDetailView
            i18nStrings={i18nStrings}
            tutorial={context.currentTutorial}
            onExitTutorial={handleExitTutorial}
            currentStepIndex={context.currentStepIndex}
            onFeedbackClick={onFeedbackClick}
          />
        ) : (
          <TutorialList
            i18nStrings={i18nStrings}
            tutorials={tutorials}
            loading={loading}
            onStartTutorial={context.onStartTutorial}
            downloadUrl={downloadUrl}
            headerRef={headerCallbackRef}
            headerId={headerId}
          />
        )}
      </div>
    </>
  );
}

applyDisplayName(TutorialPanel, 'TutorialPanel');
