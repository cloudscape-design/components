// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';

import { Button, Header, NonCancelableCustomEvent, SpaceBetween, Tabs } from '~components';
import AnnotationContext from '~components/annotation-context';
import AppLayout, { AppLayoutProps } from '~components/app-layout';
import TutorialPanel, { TutorialPanelProps } from '~components/tutorial-panel';
import ScreenshotArea from '../utils/screenshot-area';
import tutorialData from './tutorials';

import { PageOne } from './pages/page1';
import { PageTwo } from './pages/page2';
import { PageThree } from './pages/page3';
import { PageFour } from './pages/page4';

import labels from '../app-layout/utils/labels';

import { annotationContextStrings, tutorialPanelStrings } from './i18n';

function useAvailableTutorials(showToolsPanel: () => void) {
  const [tutorials, setTutorials] = useState(() => tutorialData(showToolsPanel));
  const setCompleted = useCallback((tutorial: TutorialPanelProps.Tutorial, completed: boolean) => {
    setTutorials(tutorials => {
      return tutorials.map(t => {
        if (t.id === (tutorial as TutorialPanelProps.Tutorial & { id: number }).id) {
          return { ...t, completed };
        }
        return t;
      });
    });
  }, []);

  return [tutorials, setCompleted] as const;
}

function useRouter() {
  const [currentPage, setCurrentPage] = useState(0);
  const loadNextPage = useCallback(() => setCurrentPage(page => page + 1), []);
  const loadPreviousPage = useCallback(() => setCurrentPage(page => page - 1), []);
  return [currentPage, loadNextPage, loadPreviousPage, setCurrentPage] as const;
}

export default function OnboardingDemoPage() {
  const [toolsPanelVisible, setToolsPanelVisible] = useState(true);

  const showToolsPanel = useCallback(() => {
    setToolsPanelVisible(true);
  }, []);

  const [tutorials, setCompleted] = useAvailableTutorials(showToolsPanel);
  const [currentTutorial, setCurrentTutorial] = useState<TutorialPanelProps.Tutorial | null>(null);

  // Fake router
  const [currentPage, loadNextPage, loadPreviousPage] = useRouter();

  const routingContent = (function () {
    switch (currentPage) {
      case 0:
        return <PageOne onCreate={loadNextPage} showToolsPanel={showToolsPanel} />;
      case 1:
        return <PageTwo onFollowLink={loadNextPage} />;
      case 2:
        return <PageThree onProceed={loadNextPage} />;
      case 3:
        return <PageFour />;

      default:
        return <Header variant="h2">404 - Page no. {currentPage + 1} not found</Header>;
    }
  })();

  const onFinish = useCallback(() => {
    if (!currentTutorial) {
      return;
    }
    setCompleted(currentTutorial, true);
    // In this demo, the current tutorial and the one in storage are two separate instances, so we have to set this manually here.
    setCurrentTutorial({ ...currentTutorial, completed: true });
  }, [currentTutorial, setCompleted]);

  const onStartTutorial = useCallback(
    (event: NonCancelableCustomEvent<TutorialPanelProps.TutorialDetail>) => {
      const tutorial = event.detail.tutorial as TutorialPanelProps.Tutorial & { id: number };

      setCompleted(tutorial, false);
      setCurrentTutorial({ ...tutorial, completed: false });
    },
    [setCompleted]
  );

  const onExitTutorial = useCallback(() => {
    setCurrentTutorial(null);
  }, []);

  const onToolsChange = useCallback((event: NonCancelableCustomEvent<AppLayoutProps.ChangeDetail>) => {
    setToolsPanelVisible(event.detail.open);
  }, []);

  const onFeedbackClick = useCallback(() => {
    window.prompt('Please enter your feedback here:');
  }, []);

  return (
    <AnnotationContext
      currentTutorial={currentTutorial}
      onStartTutorial={onStartTutorial}
      onExitTutorial={onExitTutorial}
      onFinish={onFinish}
      i18nStrings={annotationContextStrings}
    >
      <ScreenshotArea gutters={false}>
        <AppLayout
          ariaLabels={labels}
          navigationHide={true}
          toolsOpen={toolsPanelVisible}
          onToolsChange={onToolsChange}
          toolsWidth={330}
          tools={
            <Tabs
              activeTabId="tutorials-panel"
              tabs={[
                { id: 'help-panel', label: 'Info', content: null },
                {
                  id: 'tutorials-panel',
                  label: 'Tutorials',
                  content: (
                    <TutorialPanel
                      i18nStrings={tutorialPanelStrings}
                      tutorials={tutorials}
                      onFeedbackClick={onFeedbackClick}
                      downloadUrl={window.location.href}
                    />
                  ),
                },
              ]}
              i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
            />
          }
          content={
            <SpaceBetween size="l">
              {currentPage > 0 && <Button onClick={loadPreviousPage}>Back to page {currentPage}</Button>}
              {routingContent}
            </SpaceBetween>
          }
        />
      </ScreenshotArea>
    </AnnotationContext>
  );
}
