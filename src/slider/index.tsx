// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { SliderProps } from './interfaces';
import InternalSlider from './internal';

export { SliderProps };

export default function Slider({ tickMarks, hideFillLine, style, ...props }: SliderProps) {
  const baseComponentProps = useBaseComponent('Slider', {
    props: { tickMarks, hideFillLine, readOnly: props.readOnly },
  });
  return (
    <InternalSlider
      tickMarks={tickMarks}
      hideFillLine={hideFillLine}
      style={style}
      {...props}
      {...baseComponentProps}
    />
  );
}
applyDisplayName(Slider, 'Slider');
