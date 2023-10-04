// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import InternalContainer, { InternalContainerProps } from '../container/internal';
import React from 'react';
import { ExpandableSectionProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

export interface ExpandableSectionContainerProps extends InternalBaseComponentProps {
  className?: string;
  header: React.ReactNode;
  children?: React.ReactNode;
  variant: ExpandableSectionProps.Variant;
  expanded: boolean | undefined;
  disableContentPaddings: boolean | undefined;
  __funnelSubStepProps?: InternalContainerProps['__funnelSubStepProps'];
  __subStepRef?: InternalContainerProps['__subStepRef'];
}

export const ExpandableSectionContainer = ({
  className,
  children,
  header,
  variant,
  expanded,
  disableContentPaddings,
  __internalRootRef,
  __funnelSubStepProps,
  __subStepRef,
  ...rest
}: ExpandableSectionContainerProps) => {
  if (variant === 'container' || variant === 'stacked') {
    return (
      <InternalContainer
        {...rest}
        className={className}
        header={header}
        variant={variant === 'stacked' ? 'stacked' : 'default'}
        disableContentPaddings={disableContentPaddings || !expanded}
        disableHeaderPaddings={true}
        __hiddenContent={!expanded}
        __internalRootRef={__internalRootRef}
        __funnelSubStepProps={__funnelSubStepProps}
        __subStepRef={__subStepRef}
      >
        {children}
      </InternalContainer>
    );
  }

  return (
    <div className={className} {...rest} ref={__internalRootRef}>
      {header}
      {children}
    </div>
  );
};
