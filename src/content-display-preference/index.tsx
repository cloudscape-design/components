// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ContentDisplayPreferenceProps } from './interfaces';
import InternalContentDisplayPreference from './internal';

export { ContentDisplayPreferenceProps };

export default function ContentDisplayPreference(props: ContentDisplayPreferenceProps) {
  const baseComponentProps = useBaseComponent('ContentDisplayPreference', {
    props: { enableColumnFiltering: props.enableColumnFiltering },
  });
  return <InternalContentDisplayPreference {...props} {...baseComponentProps} />;
}

applyDisplayName(ContentDisplayPreference, 'ContentDisplayPreference');
