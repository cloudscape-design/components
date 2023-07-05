// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import ProgressBar, { ProgressBarProps } from '~components/progress-bar';
import SpaceBetween from '~components/space-between';
import Header from '~components/header';
import Button from '~components/button';
import Box from '~components/box';

export default function ProgressBarWithUpdates() {
  return (
    <div>
      <Header variant={'h1'}>Dynamic progress bar</Header>
      <div>
        <Header variant={'h2'}>Percentage</Header>
        <SpaceBetween direction={'vertical'} size={'s'}>
          <div>
            <Box variant={'div'} fontWeight={'bold'}>
              High granularity (step == 1)
            </Box>
            <ProgressBarFactory interval={1} />
          </div>
          <div>
            <Box variant={'div'} fontWeight={'bold'}>
              Low granularity (step == 10)
            </Box>
            <ProgressBarFactory interval={10} />
          </div>
        </SpaceBetween>
        <div />
      </div>

      <div>
        <Header variant={'h2'}>Ratio</Header>
        <SpaceBetween direction={'vertical'} size={'s'}>
          <div>
            <Box variant={'div'} fontWeight={'bold'}>
              High granularity (step == 1)
            </Box>
            <ProgressBarFactory interval={1} type="ratio" />
          </div>
          <div>
            <Box variant={'div'} fontWeight={'bold'}>
              Low granularity (step == 10)
            </Box>
            <ProgressBarFactory interval={10} type="ratio" />
          </div>
        </SpaceBetween>
      </div>
    </div>
  );
}

const ProgressBarFactory = ({ type, interval }: ProgressBarProps & { interval: number }) => {
  const [progressStep, setProgressStep] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const activateTimerStep = () => {
    resetTimeoutStep();
    function step(i: number) {
      setProgressStep(i + interval);
      timeoutRef.current = setTimeout(() => i < 99 && step(i + interval), 100);
    }
    step(0);
  };
  const resetTimeoutStep = () => {
    setProgressStep(0);
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  return (
    <>
      <ProgressBar
        status={progressStep < 100 ? 'in-progress' : 'success'}
        value={progressStep}
        type={type}
        variant={'standalone'}
        label={'Tea'}
        description={'We will make a nice cup of tea ...'}
        additionalInfo={'Take some cookie as a desert'}
        resultText={'Your tea is ready!'}
      />
      <Buttons activate={activateTimerStep} reset={resetTimeoutStep} />
    </>
  );
};

type VoidFunction = () => void;
const Buttons = ({ activate, reset }: { activate: VoidFunction; reset: VoidFunction }) => (
  <div style={{ display: 'flex' }}>
    <Button onClick={activate}>Start</Button>
    <Button onClick={reset}>Reset</Button>
  </div>
);
