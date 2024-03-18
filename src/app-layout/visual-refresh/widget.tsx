// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef, useState } from 'react';
import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { AppLayoutRefreshInternal } from './internal';
import { PrimaryRegistration, SecondaryRegistration } from '../../internal/plugins/controllers/app-layout-widget';
import { AppLayoutProps } from '../interfaces';

interface AppLayoutWidgetPrimaryProps extends AppLayoutProps {
  primaryHandle: PrimaryRegistration;
}

const AppLayoutWidgetPrimary = React.forwardRef<AppLayoutProps.Ref, AppLayoutWidgetPrimaryProps>(
  function AppLayoutWidgetPrimary({ primaryHandle, ...ownProps }, ref) {
    const [discoveredProps, setDiscoveredProps] = useState<AppLayoutProps>({});
    console.log('primaryHandle', primaryHandle);
    useLayoutEffect(() => {
      return primaryHandle.onPropsChange(props => setDiscoveredProps(props));
    }, [primaryHandle]);

    return <AppLayoutRefreshInternal ref={ref} {...ownProps} {...discoveredProps}></AppLayoutRefreshInternal>;
  }
);

const AppLayoutWidgetSecondary = React.forwardRef<AppLayoutProps.Ref, AppLayoutProps>(function AppLayoutWidgetSecondary(
  { content, ...props },
  // TODO: propagate ref functions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ref
) {
  const secondaryRef = useRef<SecondaryRegistration>();
  if (secondaryRef.current === undefined) {
    secondaryRef.current = awsuiPluginsInternal.appLayoutWidget.registerSecondary();
  }
  useLayoutEffect(() => {
    secondaryRef.current!.setProps(props);
  });
  useLayoutEffect(() => {
    return () => secondaryRef.current!.cleanup();
  }, []);

  return <>{content}</>;
});

export const AppLayoutWidget = React.forwardRef<AppLayoutProps.Ref, AppLayoutProps>((props, ref) => {
  const [primaryHandle, setPrimaryHandle] = useState<any>();

  useLayoutEffect(() => {
    const primaryHandle = awsuiPluginsInternal.appLayoutWidget.registerPrimary();
    setPrimaryHandle(primaryHandle);
    return () => {
      console.log('effect exit');
      primaryHandle?.cleanup();
    };
  }, []);

  if (primaryHandle === undefined) {
    return null;
  } else if (primaryHandle) {
    return <AppLayoutWidgetPrimary ref={ref} primaryHandle={primaryHandle} {...props} />;
  } else {
    return <AppLayoutWidgetSecondary ref={ref} {...props} />;
  }
});
