// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  AnalyticsFunnel,
  AnalyticsFunnelStep,
  AnalyticsFunnelSubStep,
} from '../internal/analytics/components/analytics-funnel';
import { useFunnel } from '../internal/analytics/hooks/use-funnel';
import { DATA_ATTR_MODAL_ID } from '../internal/analytics/selectors';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ModalProps } from './interfaces';
import InternalModal, { InternalModalAsFunnel } from './internal';

import styles from './styles.css.js';

export { ModalProps };

function ModalWithAnalyticsFunnel({
  analyticsMetadata,
  baseComponentProps,
  size = 'medium',
  ...props
}: ModalProps & { analyticsMetadata: any; baseComponentProps: ReturnType<typeof useBaseComponent> }) {
  const modalId = useUniqueId();
  const dataAttributes = {
    [DATA_ATTR_MODAL_ID]: modalId,
  };

  return (
    <AnalyticsFunnel
      mounted={props.visible}
      funnelIdentifier={analyticsMetadata?.instanceIdentifier}
      funnelFlowType={analyticsMetadata?.flowType}
      funnelErrorContext={analyticsMetadata?.errorContext}
      funnelResourceType={analyticsMetadata?.resourceType}
      funnelType="modal"
      optionalStepNumbers={[]}
      totalFunnelSteps={1}
      funnelNameSelectors={[`[${DATA_ATTR_MODAL_ID}="${CSS?.escape(modalId)}"] .${styles['header--text']}`]}
    >
      <AnalyticsFunnelStep
        mounted={props.visible}
        stepIdentifier={analyticsMetadata?.instanceIdentifier}
        stepErrorContext={analyticsMetadata?.errorContext}
        stepNumber={1}
      >
        <AnalyticsFunnelSubStep
          subStepIdentifier={analyticsMetadata?.instanceIdentifier}
          subStepErrorContext={analyticsMetadata?.errorContext}
        >
          <InternalModalAsFunnel
            size={size}
            {...props}
            {...baseComponentProps}
            {...dataAttributes}
            __injectAnalyticsComponentMetadata={true}
          />
        </AnalyticsFunnelSubStep>
      </AnalyticsFunnelStep>
    </AnalyticsFunnel>
  );
}

export default function Modal({ size = 'medium', ...props }: ModalProps) {
  const { isInFunnel } = useFunnel();
  const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
  const baseComponentProps = useBaseComponent(
    'Modal',
    {
      props: { size, disableContentPaddings: props.disableContentPaddings },
      metadata: {
        hasResourceType: Boolean(analyticsMetadata?.resourceType),
        hasInstanceIdentifier: Boolean(analyticsMetadata?.instanceIdentifier),
      },
    },
    analyticsMetadata
  );

  if (!isInFunnel) {
    return (
      <ModalWithAnalyticsFunnel
        analyticsMetadata={analyticsMetadata}
        baseComponentProps={baseComponentProps}
        size={size}
        {...props}
      />
    );
  }

  return <InternalModal size={size} {...props} {...baseComponentProps} __injectAnalyticsComponentMetadata={true} />;
}

applyDisplayName(Modal, 'Modal');
