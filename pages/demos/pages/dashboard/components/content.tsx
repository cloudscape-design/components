// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Grid from '@cloudscape-design/components/grid';

import {
  alarms,
  BaseStaticWidget,
  events,
  featuresSpotlight,
  instanceHours,
  instanceLimits,
  networkTraffic,
  serviceHealth,
  serviceOverview,
  zoneStatus,
} from '../widgets';

export function Content() {
  return (
    <Grid
      gridDefinition={[
        { colspan: { l: 8, m: 8, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 6, m: 6, default: 12 } },
        { colspan: { l: 8, m: 8, default: 12 } },
        { colspan: { l: 4, m: 4, default: 12 } },
      ]}
    >
      {[
        serviceOverview,
        serviceHealth,
        instanceHours,
        networkTraffic,
        alarms,
        instanceLimits,
        events,
        zoneStatus,
        featuresSpotlight,
      ].map((widget, index) => (
        <BaseStaticWidget key={index} config={widget.data} />
      ))}
    </Grid>
  );
}
