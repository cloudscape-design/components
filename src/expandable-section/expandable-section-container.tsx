// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import InternalContainer from '../container/internal';
import React from 'react';
import { ExpandableSectionProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

interface ExpandableSectionContainerProps extends InternalBaseComponentProps {
  className?: string;
  header: React.ReactNode;
  children?: React.ReactNode;
  variant: ExpandableSectionProps.Variant;
  expanded: boolean | undefined;
  disableContentPaddings: boolean | undefined;
}

export const ExpandableSectionContainer = ({
  className,
  children,
  header,
  variant,
  expanded,
  disableContentPaddings,
  __internalRootRef,
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
