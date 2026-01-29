// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';
import ExpandableSection from '~components/expandable-section';
import Form from '~components/form';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import localStyles from './with-expandable-section.styles.scss';

interface Step {
  title: string;
  isOptional?: boolean;
}

const steps: Step[] = [
  { title: 'Choose instance type' },
  { title: 'Add storage', isOptional: true },
  { title: 'Review and create' },
];

interface StepNavigationProps {
  steps: Step[];
  activeStepIndex: number;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onStepClick: (index: number) => void;
}

function StepNavigation({ steps, activeStepIndex, expanded, onExpandedChange, onStepClick }: StepNavigationProps) {
  return (
    <ExpandableSection
      headerText={`Step ${activeStepIndex + 1} of ${steps.length}`}
      expanded={expanded}
      onChange={({ detail }) => onExpandedChange(detail.expanded)}
    >
      <ul className={localStyles['step-list']}>
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex;
          const isVisited = index < activeStepIndex;
          const status = isActive ? 'active' : isVisited ? 'visited' : 'unvisited';

          return (
            <li key={index} className={localStyles['step-item']} data-status={status}>
              <div className={localStyles['step-indicator']}>
                <div className={localStyles['step-circle']} data-status={status} />
                {index < steps.length - 1 && <div className={localStyles['step-line']} />}
              </div>
              <div className={localStyles['step-content']}>
                <Box variant="small" color="text-body-secondary">
                  Step {index + 1}
                  {step.isOptional && <i> - optional</i>}
                </Box>
                {isActive ? (
                  <Box fontWeight="bold" color="text-status-info">
                    {step.title}
                  </Box>
                ) : (
                  <Link variant="primary" onFollow={() => onStepClick(index)}>
                    {step.title}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </ExpandableSection>
  );
}

export default function WizardWithExpandableSectionPage() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [navigationExpanded, setNavigationExpanded] = useState(true);

  const currentStep = steps[activeStepIndex];
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === steps.length - 1;

  const handlePrevious = () => {
    if (!isFirstStep) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const renderStepContent = () => {
    switch (activeStepIndex) {
      case 0:
        return (
          <SpaceBetween size="l">
            <ExpandableSection variant="container" headerText="Container title" defaultExpanded={true}>
              <SpaceBetween size="s">
                <Box>Description</Box>
                <Box
                  padding="l"
                  textAlign="center"
                  color="text-body-secondary"
                  variant="div"
                  className={localStyles['placeholder-content']}
                >
                  SWAP WITH CONTENT
                </Box>
              </SpaceBetween>
            </ExpandableSection>
            <ExpandableSection variant="container" headerText="Container title" defaultExpanded={true}>
              <SpaceBetween size="s">
                <Box>Description</Box>
                <Box
                  padding="l"
                  textAlign="center"
                  color="text-body-secondary"
                  variant="div"
                  className={localStyles['placeholder-content']}
                >
                  SWAP WITH CONTENT
                </Box>
              </SpaceBetween>
            </ExpandableSection>
          </SpaceBetween>
        );
      case 1:
        return (
          <Container>
            <Box>Configure storage options for your instance.</Box>
          </Container>
        );
      case 2:
        return (
          <Container>
            <Box>Review your configuration and create the instance.</Box>
          </Container>
        );
      default:
        return null;
    }
  };

  return (
    <div className={localStyles['wizard-layout']}>
      <div className={localStyles['wizard-navigation']}>
        <StepNavigation
          steps={steps}
          activeStepIndex={activeStepIndex}
          expanded={navigationExpanded}
          onExpandedChange={setNavigationExpanded}
          onStepClick={setActiveStepIndex}
        />
      </div>
      <div className={localStyles['wizard-content']}>
        <Form
          header={
            <Header variant="h1">
              {currentStep.title}
              {currentStep.isOptional && <i> - optional</i>}
            </Header>
          }
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link">Cancel</Button>
              {!isFirstStep && <Button onClick={handlePrevious}>Previous</Button>}
              <Button variant="primary" onClick={handleNext}>
                {isLastStep ? 'Create' : 'Next'}
              </Button>
            </SpaceBetween>
          }
        >
          {renderStepContent()}
        </Form>
      </div>
    </div>
  );
}
