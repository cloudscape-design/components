// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';

const metadata: StyleDictionary.MetadataIndex = {
  borderRadiusActive: { description: 'The border radius of the active tab indicator.' },
  borderActiveWidth: { description: 'The height of the active tab indicator.' },
  borderDividerListWidth: { description: 'Used for divider between repeated items such as dropdowns and tables.' },
  borderDividerSectionWidth: {
    description:
      'The default system divider width - used for dividers between sections of content such as key/value pairs and tabs, for both full width and inset dividers.',
  },
  borderRadiusDropdown: { description: 'Used for dropdown containers.' },
  borderRadiusField: {
    description: 'The border radius of most small elements in the system, e.g. inputs, tiles, alerts, tokens.',
  },
  borderInvalidWidth: { description: 'Used for invalid input left border width.' },
  borderRadiusItem: { description: 'Used for list items that can be selected, e.g. dropdown options, table rows.' },
  borderPanelHeaderWidth: { description: 'The split panel header bottom divider width.' },
  borderPanelTopWidth: { description: 'The split panel top border width.' },
};

export default metadata;
