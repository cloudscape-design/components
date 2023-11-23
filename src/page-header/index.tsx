// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { PageHeaderProps } from './interfaces';
import InternalPageHeader from './internal';

export { PageHeaderProps };

const PageHeader = ({ variant = 'h1', colorMode = 'default', ...restProps }: PageHeaderProps) => {
  const baseComponentProps = useBaseComponent('PageHeader');

  return <InternalPageHeader variant={variant} colorMode={colorMode} {...restProps} {...baseComponentProps} />;
};

applyDisplayName(PageHeader, 'PageHeader');
export default PageHeader;
