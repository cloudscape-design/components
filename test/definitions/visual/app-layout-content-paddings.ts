// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'Content paddings',
  componentName: 'app-layout',
  tests: [
    ...(['true', 'false'] as const).flatMap(toolsEnabled =>
      (['true', 'false'] as const).flatMap(splitPanelEnabled =>
        (['bottom', 'side'] as const).map(splitPanelPosition => ({
          description: `toolsEnabled=${toolsEnabled} splitPanelEnabled=${splitPanelEnabled} splitPanelPosition=${splitPanelPosition}`,
          path: 'app-layout/with-split-panel',
          screenshotType: 'viewport' as const,
          queryParams: { toolsEnabled, splitPanelEnabled, splitPanelPosition },
        }))
      )
    ),
    ...[1500, 600].map(width => ({
      description: `with split panel and disabled content paddings - width=${width}`,
      path: 'app-layout/disable-paddings-with-split-panel',
      screenshotType: 'viewport' as const,
      configuration: { width },
      queryParams: { splitPanelOpen: 'true', splitPanelPosition: 'side' },
    })),
  ],
};

export default suite;
