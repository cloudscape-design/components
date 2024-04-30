// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { SliderProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalSlider from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { SliderProps };

export default function Slider({ tickMarks, hideFillLine, ...props }: SliderProps) {
  const baseComponentProps = useBaseComponent('Slider', { props: { tickMarks, hideFillLine } });
  return <InternalSlider tickMarks={tickMarks} hideFillLine={hideFillLine} {...props} {...baseComponentProps} />;
}
applyDisplayName(Slider, 'Slider');
