// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Button from '~components/button';
import Header from '~components/header';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';

import { Containers, Navigation } from './utils/content-blocks';
import labels from './utils/labels';

export const DEMO_CONTENT = (
  <div>
    <Popover
      content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
    magna aliqua. Augue neque gravida in fermentum."
    >
      Launch popover
    </Popover>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Augue neque gravida in fermentum. Suspendisse sed nisi lacus sed viverra tellus in hac. Nec sagittis
      aliquam malesuada bibendum arcu vitae elementum. Lectus proin nibh nisl condimentum id venenatis. Penatibus et
      magnis dis parturient montes nascetur ridiculus mus mauris. Nisi porta lorem mollis aliquam ut porttitor leo a.
      Facilisi morbi tempus iaculis urna. Odio tempor orci dapibus ultrices in iaculis nunc.
    </p>
    <div data-testid="scroll-me">The end</div>
    <p>
      Ut diam quam nulla porttitor massa id neque. Duis at tellus at urna condimentum mattis pellentesque id nibh. Metus
      vulputate eu scelerisque felis imperdiet proin fermentum.
    </p>
    <p>
      Orci porta non pulvinar neque laoreet suspendisse interdum consectetur libero. Varius quam quisque id diam vel.
      Risus viverra adipiscing at in. Orci sagittis eu volutpat odio facilisis mauris. Mauris vitae ultricies leo
      integer malesuada nunc. Sem et tortor consequat id porta nibh. Semper auctor neque vitae tempus quam pellentesque.
    </p>
    <p>Ante in nibh mauris cursus mattis molestie.</p>
    <p>
      Pharetra et ultrices neque ornare. Bibendum neque egestas congue quisque egestas diam in arcu cursus. Porttitor
      eget dolor morbi non arcu risus quis. Integer quis auctor elit sed vulputate mi sit. Mauris nunc congue nisi vitae
      suscipit tellus mauris a diam. Diam donec adipiscing tristique risus nec feugiat in. Arcu felis bibendum ut
      tristique et egestas quis. Nulla porttitor massa id neque aliquam vestibulum morbi blandit. In hac habitasse
      platea dictumst quisque sagittis. Sollicitudin tempor id eu nisl nunc mi ipsum. Ornare aenean euismod elementum
      nisi quis. Elementum curabitur vitae nunc sed velit dignissim sodales. Amet tellus cras adipiscing enim eu. Id
      interdum velit laoreet id donec ultrices tincidunt. Ullamcorper eget nulla facilisi etiam. Sodales neque sodales
      ut etiam sit amet nisl purus. Auctor urna nunc id cursus metus aliquam eleifend mi in. Urna condimentum mattis
      pellentesque id. Porta lorem mollis aliquam ut porttitor leo a. Lectus quam id leo in vitae turpis massa sed.
      Pharetra pharetra massa massa ultricies mi.
    </p>
  </div>
);

export default function () {
  const [resetNeeded, setResetNeeded] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [navigationHide, setNavigationHide] = useState(false);
  const [navigationEmpty, setNavigationEmpty] = useState(true);

  const Content = (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <Header variant="h1" description="Basic demo with split panel">
          Demo page
        </Header>
      </div>

      <SpaceBetween size="l">
        <SpaceBetween size="s" direction="horizontal">
          <Toggle
            id="control-navigation-empty"
            checked={navigationEmpty}
            onChange={e => setNavigationEmpty(e.detail.checked)}
          >
            Navigation Empty
          </Toggle>
          <Toggle
            id="control-navigation-open"
            checked={navigationOpen}
            onChange={e => setNavigationOpen(e.detail.checked)}
          >
            Navigation Open
          </Toggle>
          <Toggle
            id="control-navigation-hide"
            checked={navigationHide}
            onChange={e => setNavigationHide(e.detail.checked)}
          >
            Navigation Hide
          </Toggle>
          <Button
            id="reset-button"
            onClick={() => setResetNeeded(true)}
            disabled={resetNeeded}
            loading={resetNeeded}
            data-testid="reset-app-layout"
          >
            Force rerender
          </Button>
        </SpaceBetween>

        <Containers />

        <Box>{DEMO_CONTENT}</Box>
      </SpaceBetween>
    </>
  );

  useEffect(() => {
    if (resetNeeded) {
      setTimeout(() => {
        setResetNeeded(false);
      }, 200);
    }
  }, [resetNeeded]);

  return (
    <>
      {resetNeeded ? (
        <></>
      ) : (
        <AppLayout
          data-testid="main-layout"
          ariaLabels={labels}
          navigationHide={navigationHide}
          navigation={navigationEmpty ? <></> : <Navigation />}
          navigationOpen={navigationOpen}
          onNavigationChange={() => setNavigationOpen(!navigationOpen)}
          content={Content}
        />
      )}
    </>
  );
}
