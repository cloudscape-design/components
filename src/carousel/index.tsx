// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { CarouselProps } from './interfaces';
import InternalCarousel from './internal';

export { CarouselProps };

const Carousel = ({ variant = 'single', size = 'large', ...props }: CarouselProps) => {
  const baseProps = getBaseProps(props);
  const baseComponentProps = useBaseComponent('Steps');
  const externalProps = getExternalProps(props);

  return <InternalCarousel {...baseProps} {...baseComponentProps} {...externalProps} variant={variant} size={size} />;
};

applyDisplayName(Carousel, 'Carousel');
export default Carousel;
