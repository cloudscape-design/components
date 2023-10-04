// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { LinkProps } from './interfaces';
import InternalLink from './internal';

export { LinkProps };

const Link = React.forwardRef(
  ({ fontSize = 'body-m', color = 'normal', external = false, ...props }: LinkProps, ref: React.Ref<LinkProps.Ref>) => {
    const baseComponentProps = useBaseComponent('Link');
    return (
      <InternalLink
        fontSize={fontSize}
        color={color}
        external={external}
        {...props}
        {...baseComponentProps}
        ref={ref}
      />
    );
  }
);

applyDisplayName(Link, 'Link');
export default Link;
