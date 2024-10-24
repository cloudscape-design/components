// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Navigation } from './utils/content-blocks';
import labels from './utils/labels';

type ControlledNavigationDemoContext = React.Context<
  AppContextType<{
    navigationOpen: AppLayoutProps['navigationOpen'];
    navigationHide: AppLayoutProps['navigationHide'];
    navOpenOverrideValue?: boolean;
    navHideOverrideValue?: boolean;
    applyNavOverrides: boolean;
  }>
>;

export default function () {
  const {
    urlParams: {
      navigationOpen = true,
      navigationHide = false,
      navOpenOverrideValue = false,
      navHideOverrideValue = false,
      applyNavOverrides = false,
    },
    setUrlParams,
  } = useContext(AppContext as ControlledNavigationDemoContext);
  const [resetNeeded, setResetNeeded] = useState(false);
  const [navigationEmpty, setNavigationEmpty] = useState(false);
  const resolvedNavOpen = applyNavOverrides ? navOpenOverrideValue : navigationOpen;
  const resolvedNavHide = applyNavOverrides ? navHideOverrideValue : navigationHide;

  const Content = (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <Header variant="h1" description="Basic demo with split panel">
          AppLayout where NavigationHide resolves to {resolvedNavHide.toString()}
        </Header>
      </div>

      <SpaceBetween size="l">
        <SpaceBetween size="s" direction="horizontal">
          <Toggle
            id="control-navigation-open"
            checked={navigationOpen}
            onChange={e => setUrlParams({ navigationOpen: e.detail.checked })}
          >
            Navigation Open
          </Toggle>
          <Toggle
            id="control-navigation-hide"
            checked={navigationHide}
            onChange={e => setUrlParams({ navigationHide: e.detail.checked })}
          >
            Navigation Hide
          </Toggle>
          <Toggle
            id="control-navigation-empty"
            checked={navigationEmpty}
            onChange={e => setNavigationEmpty(e.detail.checked)}
          >
            Navigation Empty
          </Toggle>
        </SpaceBetween>
        <SpaceBetween size="s" direction="horizontal">
          <Checkbox onChange={e => setUrlParams({ applyNavOverrides: e.detail.checked })} checked={applyNavOverrides}>
            Apply override
          </Checkbox>
          <Toggle
            id="override-nav-open"
            checked={!!navOpenOverrideValue}
            disabled={!applyNavOverrides}
            onChange={e => setUrlParams({ navOpenOverrideValue: e.detail.checked })}
          >
            Navigation Open Override
          </Toggle>
          <Toggle
            id="override-nav-open"
            checked={!!navHideOverrideValue}
            disabled={!applyNavOverrides}
            onChange={e => setUrlParams({ navHideOverrideValue: e.detail.checked })}
          >
            Navigation Hide Override
          </Toggle>
        </SpaceBetween>
        <Button
          id="reset-button"
          onClick={() => setResetNeeded(true)}
          disabled={resetNeeded}
          loading={resetNeeded}
          data-testid="reset-app-layout"
        >
          Reset - Force rerender
        </Button>

        <Containers />
      </SpaceBetween>
    </>
  );

  useEffect(() => {
    if (resetNeeded) {
      setUrlParams({ applyNavOverrides: false, navOpenOverrideValue: false, navHideOverrideValue: false });
      setTimeout(() => {
        setResetNeeded(false);
      }, 200);
    }
  }, [resetNeeded, setUrlParams]);

  return (
    <ScreenshotArea gutters={false}>
      {resetNeeded ? (
        <></>
      ) : (
        <AppLayout
          data-testid="main-layout"
          ariaLabels={labels}
          navigationHide={resolvedNavHide}
          navigation={navigationEmpty ? <></> : <Navigation />}
          navigationOpen={resolvedNavOpen}
          onNavigationChange={e => setUrlParams({ navigationOpen: e.detail.open })}
          content={Content}
        />
      )}
    </ScreenshotArea>
  );
}
