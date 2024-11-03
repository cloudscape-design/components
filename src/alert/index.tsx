// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { useAlertFunnel } from './analytics/funnel';
import { GeneratedAnalyticsMetadataAlertComponent } from './analytics-metadata/interfaces';
import { AlertProps } from './interfaces';
import InternalAlert from './internal';

import analyticsSelectors from './analytics-metadata/styles.css.js';

export { AlertProps };

const Alert = React.forwardRef(
  ({ type = 'info', visible = true, ...props }: AlertProps, ref: React.Ref<AlertProps.Ref>) => {
    const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
    const baseComponentProps = useBaseComponent<HTMLDivElement>(
      'Alert',
      {
        props: { type, visible, dismissible: props.dismissible },
      },
      analyticsMetadata
    );

    const componentAnalyticsMetadata: GeneratedAnalyticsMetadataAlertComponent = {
      name: 'awsui.Alert',
      label: `.${analyticsSelectors.header}`,
      properties: {
        type,
      },
    };

    useAlertFunnel({ rootRef: baseComponentProps.__internalRootRef, type });

    return (
      <InternalAlert
        ref={ref}
        type={type}
        visible={visible}
        {...props}
        {...baseComponentProps}
        {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
      />
    );
  }
);

applyDisplayName(Alert, 'Alert');
export default Alert;
