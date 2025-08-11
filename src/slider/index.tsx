// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { SliderProps } from './interfaces.js';
import InternalSlider from './internal.js';

export { SliderProps };

export default function Slider({ tickMarks, hideFillLine, ...props }: SliderProps) {
  const baseComponentProps = useBaseComponent('Slider', {
    props: { tickMarks, hideFillLine, readOnly: props.readOnly },
  });
  return <InternalSlider tickMarks={tickMarks} hideFillLine={hideFillLine} {...props} {...baseComponentProps} />;
}
applyDisplayName(Slider, 'Slider');
