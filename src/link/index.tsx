// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { GeneratedAnalyticsMetadataLinkFragment } from './analytics-metadata/interfaces.js';
import { LinkProps } from './interfaces.js';
import InternalLink from './internal.js';

export { LinkProps };

const Link = React.forwardRef(
  ({ fontSize = 'body-m', color = 'normal', external = false, ...props }: LinkProps, ref: React.Ref<LinkProps.Ref>) => {
    const baseComponentProps = useBaseComponent('Link', {
      props: { color, external, fontSize, rel: props.rel, target: props.target, variant: props.variant },
    });

    const analyticsMetadata: GeneratedAnalyticsMetadataLinkFragment = {
      action: 'click',
      detail: {
        label: { root: 'self' },
        external: `${external}`,
      },
      component: {
        name: 'awsui.Link',
        label: { root: 'self' },
        properties: { variant: props.variant || 'secondary' },
      },
    };

    if (props.href) {
      analyticsMetadata.detail.href = props.href;
    }

    return (
      <InternalLink
        fontSize={fontSize}
        color={color}
        external={external}
        {...props}
        {...baseComponentProps}
        ref={ref}
        {...getAnalyticsMetadataAttribute(analyticsMetadata)}
      />
    );
  }
);

applyDisplayName(Link, 'Link');
export default Link;
