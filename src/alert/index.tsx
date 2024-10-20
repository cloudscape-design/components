// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useFunnelContext } from '../internal/analytics/hooks/use-funnel';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
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

    const funnelContext = useFunnelContext();
    useEffect(() => {
      if (!funnelContext || !funnelContext.controller) {
        return;
      }

      let errorText = '';
      if (type === 'error') {
        errorText =
          baseComponentProps.__internalRootRef.current?.querySelector<HTMLDivElement>(`.${analyticsSelectors.content}`)
            ?.innerText || '';
      }

      const parentSubstepElement = baseComponentProps.__internalRootRef.current?.closest('[data-funnel-substep-id]'); // TODO: Move to helper function
      if (parentSubstepElement) {
        const substepId = parentSubstepElement?.getAttribute('data-funnel-substep-id'); // TODO: Move selectors to own file
        funnelContext?.controller?.currentStep?.substeps.forEach(substep => {
          if (substep.id === substepId) {
            funnelContext?.controller?.currentStep?.currentSubstep?.error({
              errorText,
              scope: { type: 'funnel-substep' },
            });
          }
        });
      } else if (funnelContext?.controller?.currentStep) {
        funnelContext?.controller?.currentStep?.error({ errorText, scope: { type: 'funnel-step' } });
      } else {
        funnelContext?.controller?.error({ errorText, scope: { type: 'funnel' } });
      }
    }, [funnelContext, type, baseComponentProps.__internalRootRef]);

    return (
      <InternalAlert
        type={type}
        visible={visible}
        {...props}
        {...baseComponentProps}
        ref={ref}
        {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
      />
    );
  }
);

applyDisplayName(Alert, 'Alert');
export default Alert;
