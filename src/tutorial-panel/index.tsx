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

  // When exiting a tutorial, we need to return focus to the header for accessibility.
  // We cannot directly call ref.current.focus() in handleExitTutorial because at that point
  // the TutorialDetailView is still rendered and TutorialList (which contains the header) hasn't
  // been rendered yet. Instead, we use shouldFocusRef to coordinate: handleExitTutorial sets it to true,
  // and then headerCallbackRef focuses the header once it's actually available in the DOM.
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
