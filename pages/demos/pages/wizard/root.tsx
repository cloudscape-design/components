// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useCallback, useRef, useState } from 'react';

import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import HelpPanel from '@cloudscape-design/components/help-panel';
import SplitPanel from '@cloudscape-design/components/split-panel';
import Wizard, { WizardProps } from '@cloudscape-design/components/wizard';

import { ExternalLinkGroup, InfoLink, Notifications } from '../commons';
import { CustomAppLayout, DemoTopNavigation, GlobalSplitPanelContent } from '../commons/common-components';
import { useGlobalSplitPanel } from '../commons/use-global-split-panel';
import { ToolsContent, WizardState } from './interfaces';
import Engine from './stepComponents/step1';
import Details from './stepComponents/step2';
import Advanced from './stepComponents/step3';
import Review from './stepComponents/step4';
import { DEFAULT_STEP_INFO, TOOLS_CONTENT } from './steps-config';
import { Breadcrumbs, Navigation } from './wizard-components';

import '../../styles/wizard.scss';
import '../../styles/top-navigation.scss';

const steps = [
  {
    title: 'Select engine type',
    stateKey: 'engine',
    StepContent: Engine,
  },
  {
    title: 'Specify instance details',
    stateKey: 'details',
    StepContent: Details,
  },
  {
    title: 'Configure settings',
    stateKey: 'advanced',
    StepContent: Advanced,
  },
  {
    title: 'Review and create',
    stateKey: 'review',
    StepContent: Review,
  },
] as const;

const i18nStrings = {
  submitButton: 'Create DB instance',
  stepNumberLabel: (stepNumber: number) => `Step ${stepNumber}`,
  collapsedStepsLabel: (stepNumber: number, stepsCount: number) => `Step ${stepNumber} of ${stepsCount}`,
};

const getDefaultToolsContent = (activeIndex: number) => TOOLS_CONTENT[steps[activeIndex].stateKey].default;

const getFormattedToolsContent = (tools: ToolsContent) => (
  <HelpPanel header={<h2>{tools.title}</h2>} footer={<ExternalLinkGroup items={tools.links} />}>
    {tools.content}
  </HelpPanel>
);

const useTools = () => {
  const [toolsContent, setToolsContent] = useState(getFormattedToolsContent(getDefaultToolsContent(0)));
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const appLayoutRef = useRef<AppLayoutProps.Ref>(null);

  const setFormattedToolsContent = (tools: ToolsContent) => {
    setToolsContent(getFormattedToolsContent(tools));
  };

  const setHelpPanelContent = (tools: ToolsContent) => {
    if (tools) {
      setFormattedToolsContent(tools);
    }
    setIsToolsOpen(true);
    appLayoutRef.current?.focusToolsClose();
  };
  const closeTools = () => setIsToolsOpen(false);

  const onToolsChange: AppLayoutProps['onToolsChange'] = evt => setIsToolsOpen(evt.detail.open);

  return {
    toolsContent,
    isToolsOpen,
    setHelpPanelContent,
    closeTools,
    setFormattedToolsContent,
    onToolsChange,
    appLayoutRef,
  };
};

const useWizard = (closeTools: () => void, setFormattedToolsContent: (tools: ToolsContent) => void) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [stepsInfo, setStepsInfo] = useState<WizardState>(DEFAULT_STEP_INFO);

  const onStepInfoChange = useCallback(
    <T extends keyof WizardState>(stateKey: T, newStepState: Partial<WizardState[T]>) => {
      setStepsInfo({
        ...stepsInfo,
        [stateKey]: {
          ...stepsInfo[stateKey],
          ...newStepState,
        },
      });
    },
    [stepsInfo]
  );

  const setActiveStepIndexAndCloseTools = (index: number) => {
    setActiveStepIndex(index);
    setFormattedToolsContent(getDefaultToolsContent(index));
    closeTools();
  };

  const onNavigate: WizardProps['onNavigate'] = evt => {
    setActiveStepIndexAndCloseTools(evt.detail.requestedStepIndex);
  };

  const onCancel = () => {
    console.log('Cancel');
  };

  const onSubmit = () => {
    console.log(stepsInfo);
  };

  return {
    activeStepIndex,
    stepsInfo,
    setActiveStepIndexAndCloseTools,
    onStepInfoChange,
    onNavigate,
    onCancel,
    onSubmit,
  };
};

const App = () => {
  const {
    toolsContent,
    isToolsOpen,
    setHelpPanelContent,
    closeTools,
    setFormattedToolsContent,
    onToolsChange,
    appLayoutRef,
  } = useTools();
  const {
    activeStepIndex,
    stepsInfo,
    setActiveStepIndexAndCloseTools,
    onStepInfoChange,
    onNavigate,
    onCancel,
    onSubmit,
  } = useWizard(closeTools, setFormattedToolsContent);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();

  const wizardSteps = steps.map(({ title, stateKey, StepContent }) => ({
    title,
    info: <InfoLink onFollow={() => setHelpPanelContent(TOOLS_CONTENT[stateKey].default)} />,
    content: (
      <StepContent
        info={stepsInfo}
        onChange={newStepState => onStepInfoChange(stateKey, newStepState)}
        setHelpPanelContent={setHelpPanelContent}
        setActiveStepIndex={setActiveStepIndexAndCloseTools}
      />
    ),
  }));
  return (
    <>
      <DemoTopNavigation />
      <CustomAppLayout
        ref={appLayoutRef}
        navigation={<Navigation />}
        tools={toolsContent}
        toolsOpen={isToolsOpen}
        onToolsChange={onToolsChange}
        breadcrumbs={<Breadcrumbs />}
        contentType="wizard"
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={onSplitPanelToggle}
        splitPanelSize={splitPanelSize}
        onSplitPanelResize={onSplitPanelResize}
        splitPanelPreferences={splitPanelPreferences}
        splitPanel={
          <SplitPanel header="Design exploration">
            <GlobalSplitPanelContent />
          </SplitPanel>
        }
        content={
          <Wizard
            steps={wizardSteps}
            activeStepIndex={activeStepIndex}
            i18nStrings={i18nStrings}
            onNavigate={onNavigate}
            onCancel={onCancel}
            onSubmit={onSubmit}
          />
        }
        notifications={<Notifications />}
      />
    </>
  );
};

export default App;
