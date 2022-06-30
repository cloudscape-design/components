// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';

const metadata: StyleDictionary.MetadataIndex = {
  shadowContainer: { description: 'Shadow for containers and cards.' },
  shadowDropup: {
    description:
      'Shadow for dropdown elements that pop up above the trigger, for example a dropdown at the bottom of the screen.',
  },
  shadowPanel: { description: 'Shadow for global elements like app layout panels and top navigation.' },
  shadowPanelToggle: { description: 'Shadow for circular toggles in visual refresh.' },
  shadowSplitBottom: {
    description:
      'Adjustment to the panel shadow so it displays the same for panels positioned at the bottom of the screen.',
  },
  shadowSplitSide: {
    description: 'Adjustment to the panel shadow so it does not bleed onto adjacent panels to the right of it.',
  },
  shadowSticky: { description: 'Shadow for sticky elements or inner elements that already have shadow around.' },
};

export default metadata;
