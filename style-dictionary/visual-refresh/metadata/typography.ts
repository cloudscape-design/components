// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';

const metadata: StyleDictionary.MetadataIndex = {
  fontChartDetailSize: {
    description: 'Used for secondary chart text, e.g. mixed chart axes and pie chart label descriptions.',
  },
  fontFamilyBase: {
    description: 'The default font family that will be applied globally to the product interface. ',
    themeable: true,
    public: true,
  },
  fontFamilyMonospace: {
    description: 'The monospace font family that will be applied globally to the product interface.',
    themeable: true,
    public: true,
  },
  fontHeaderH2DescriptionLineHeight: { sassName: '$font-header-h2-description-line-height' },
  fontHeaderH2DescriptionSize: { sassName: '$font-header-h2-description-size' },
};

export default metadata;
