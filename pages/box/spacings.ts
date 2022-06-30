// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BoxProps } from '~components/box';
const sizes: Array<BoxProps.SpacingSize> = ['n', 'xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];
const sides = ['top', 'right', 'bottom', 'left', 'horizontal', 'vertical'];
const spacings: Array<BoxProps.SpacingSize | BoxProps.Spacing> = [...sizes];
sides.forEach(side =>
  sizes.forEach(size => {
    spacings.push({ [side]: [size] });
  })
);

export default spacings;
