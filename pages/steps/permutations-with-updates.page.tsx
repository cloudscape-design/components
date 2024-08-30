// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Steps from '~components/steps';

import ScreenshotArea from '../utils/screenshot-area';
import {
  blockedStepsInteractive,
  failedStepsInteractive,
  failedStepsWithRetryButtonInteractive,
  initialStepsInteractive,
  loadingSteps2Interactive,
  loadingSteps3Interactive,
  loadingStepsInteractive,
  successfulStepsInteractive,
} from './permutationts-utils';

export default function StepsPermutationsWithUpdates() {
  const [stepIndex1, setStepIndex1] = useState(0);
  const timeoutRef1 = useRef<ReturnType<typeof setTimeout>>();
  const stepsExecution1 = [
    initialStepsInteractive,
    loadingStepsInteractive,
    loadingSteps2Interactive,
    loadingSteps3Interactive,
    successfulStepsInteractive,
  ];

  const [stepIndex2, setStepIndex2] = useState(0);
  const timeoutRef2 = useRef<ReturnType<typeof setTimeout>>();
  const stepsExecution2 = [
    initialStepsInteractive,
    loadingStepsInteractive,
    loadingSteps2Interactive,
    blockedStepsInteractive,
  ];

  const [stepIndex3, setStepIndex3] = useState(0);
  const timeoutRef3 = useRef<ReturnType<typeof setTimeout>>();
  const stepsExecution3 = [initialStepsInteractive, loadingStepsInteractive, failedStepsInteractive];

  const [stepIndex4, setStepIndex4] = useState(0);
  const timeoutRef4 = useRef<ReturnType<typeof setTimeout>>();
  const stepsExecution4 = [initialStepsInteractive, loadingStepsInteractive, failedStepsWithRetryButtonInteractive];

  const activateTimerStep1 = () => {
    resetTimeoutStep1();
    function step(i: number) {
      setStepIndex1(i + 1);
      timeoutRef1.current = setTimeout(() => i < stepsExecution1.length - 2 && step(i + 1), 2000);
    }
    step(0);
  };
  const resetTimeoutStep1 = () => {
    setStepIndex1(0);
    if (timeoutRef1.current !== undefined) {
      clearTimeout(timeoutRef1.current);
      timeoutRef1.current = undefined;
    }
  };

  const activateTimerStep2 = () => {
    resetTimeoutStep2();
    function step(i: number) {
      setStepIndex2(i + 1);
      timeoutRef2.current = setTimeout(() => i < stepsExecution2.length - 2 && step(i + 1), 2000);
    }
    step(0);
  };
  const resetTimeoutStep2 = () => {
    setStepIndex2(0);
    if (timeoutRef2.current !== undefined) {
      clearTimeout(timeoutRef2.current);
      timeoutRef2.current = undefined;
    }
  };

  const activateTimerStep3 = () => {
    resetTimeoutStep3();
    function step(i: number) {
      setStepIndex3(i + 1);
      timeoutRef3.current = setTimeout(() => i < stepsExecution3.length - 2 && step(i + 1), 2000);
    }
    step(0);
  };
  const resetTimeoutStep3 = () => {
    setStepIndex3(0);
    if (timeoutRef3.current !== undefined) {
      clearTimeout(timeoutRef3.current);
      timeoutRef3.current = undefined;
    }
  };

  const activateTimerStep4 = () => {
    resetTimeoutStep4();
    function step(i: number) {
      setStepIndex4(i + 1);
      timeoutRef4.current = setTimeout(() => i < stepsExecution4.length - 2 && step(i + 1), 2000);
    }
    step(0);
  };
  const resetTimeoutStep4 = () => {
    setStepIndex4(0);
    if (timeoutRef4.current !== undefined) {
      clearTimeout(timeoutRef1.current);
      timeoutRef4.current = undefined;
    }
  };

  return (
    <ScreenshotArea disableAnimations={false}>
      <article>
        <h1>Steps permutations with updates</h1>
        <Box margin={{ bottom: 'xl' }}>
          <Box variant={'div'} fontWeight={'bold'} margin={'s'}>
            Successful Execution
          </Box>
          <Steps steps={stepsExecution1[stepIndex1]} />
          <div style={{ display: 'flex' }}>
            <Button onClick={activateTimerStep1}>Start</Button>
            <Button onClick={resetTimeoutStep1}>Reset</Button>
          </div>
        </Box>
        <Box margin={{ bottom: 'xl' }}>
          <Box variant={'div'} fontWeight={'bold'} margin={'s'}>
            Blocked Execution
          </Box>
          <Steps steps={stepsExecution2[stepIndex2]} />
          <div style={{ display: 'flex' }}>
            <Button onClick={activateTimerStep2}>Start</Button>
            <Button onClick={resetTimeoutStep2}>Reset</Button>
          </div>
        </Box>
        <Box margin={{ bottom: 'xl' }}>
          <Box variant={'div'} fontWeight={'bold'} margin={'s'}>
            Failed Execution
          </Box>
          <Steps steps={stepsExecution3[stepIndex3]} />
          <div style={{ display: 'flex' }}>
            <Button onClick={activateTimerStep3}>Start</Button>
            <Button onClick={resetTimeoutStep3}>Reset</Button>
          </div>
        </Box>
        <Box margin={{ bottom: 'xl' }}>
          <Box variant={'div'} fontWeight={'bold'} margin={'s'}>
            Failed Execution with Retry
          </Box>
          <Steps steps={stepsExecution4[stepIndex4]} />
          <div style={{ display: 'flex' }}>
            <Button onClick={activateTimerStep4}>Start</Button>
            <Button onClick={resetTimeoutStep4}>Reset</Button>
          </div>
        </Box>
      </article>
    </ScreenshotArea>
  );
}
