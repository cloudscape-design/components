// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import ProgressBar from '~components/progress-bar';
import SpaceBetween from '~components/space-between';
import Header from '~components/header';
import Button from '~components/button';
import Box from '~components/box';

export default function ProgressBarWithUpdates() {
  const [progressStep1, setProgressStep1] = useState(0);
  const [progressStep10, setProgressStep10] = useState(0);
  const timeoutRef1 = useRef<ReturnType<typeof setTimeout>>();
  const timeoutRef10 = useRef<ReturnType<typeof setTimeout>>();

  const activateTimerStep1 = () => {
    resetTimeoutStep1();
    function step(i: number) {
      setProgressStep1(i + 1);
      timeoutRef1.current = setTimeout(() => i < 99 && step(i + 1), 100);
    }
    step(0);
  };
  const resetTimeoutStep1 = () => {
    setProgressStep1(0);
    if (timeoutRef1.current !== undefined) {
      clearTimeout(timeoutRef1.current);
      timeoutRef1.current = undefined;
    }
  };

  const activateTimerStep10 = () => {
    resetTimeoutStep10();
    function step(i: number) {
      setProgressStep10(i * 10);
      timeoutRef10.current = setTimeout(() => i < 10 && step(i + 1), 500);
    }
    step(0);
  };

  const resetTimeoutStep10 = () => {
    setProgressStep10(0);
    if (timeoutRef10.current !== undefined) {
      clearTimeout(timeoutRef10.current);
      timeoutRef10.current = undefined;
    }
  };

  return (
    <div>
      <Header variant={'h1'}>Dynamic progress bar</Header>
      <SpaceBetween direction={'vertical'} size={'s'}>
        <div>
          <Box variant={'div'} fontWeight={'bold'}>
            High granularity (step == 1)
          </Box>
          <ProgressBar
            status={progressStep1 < 100 ? 'in-progress' : 'success'}
            value={progressStep1}
            variant={'standalone'}
            label={'Tea'}
            description={'We will make a nice cup of tea ...'}
            additionalInfo={'Take some cookie as a desert'}
            resultText={'Your tea is ready!'}
          />
          <div style={{ display: 'flex' }}>
            <Button onClick={activateTimerStep1}>Start</Button>
            <Button onClick={resetTimeoutStep1}>Reset</Button>
          </div>
        </div>
        <div>
          <Box variant={'div'} fontWeight={'bold'}>
            Low granularity (step == 10)
          </Box>
          <ProgressBar
            status={progressStep10 < 100 ? 'in-progress' : 'success'}
            value={progressStep10}
            variant={'standalone'}
            label={
              <span>
                Tea <i>- optional</i>
              </span>
            }
            description={'We will make a nice cup of tea ...'}
            additionalInfo={'Take some cookie as a desert'}
            resultText={'Your tea is ready!'}
          />
          <div style={{ display: 'flex' }}>
            <Button onClick={activateTimerStep10}>Start</Button>
            <Button onClick={resetTimeoutStep10}>Reset</Button>
          </div>
        </div>
      </SpaceBetween>
    </div>
  );
}
