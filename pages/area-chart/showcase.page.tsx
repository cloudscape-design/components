// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SpaceBetween from '~components/space-between';

import Example from './example';
import {
  createCategoricalProps,
  createLinearCloseProps,
  createLinearTimeLatencyProps,
  createLogXYProps,
} from './series';

const linearLatencyProps = createLinearTimeLatencyProps();
const linearCloseAreas = createLinearCloseProps();
const logXProps = createLogXYProps({ xLog: true });
const logYProps = createLogXYProps({ yLog: true });
const categoricalProps = createCategoricalProps();

export default function () {
  return (
    <>
      <h1>Area charts showcase</h1>
      <SpaceBetween direction="vertical" size="xl">
        <Example name="Linear time-scale chart" {...linearLatencyProps} />

        <Example name="Linear chart with close areas" {...linearCloseAreas} />

        <Example name="Log X chart" {...logXProps} />

        <Example name="Log Y chart" {...logYProps} />

        <Example name="Categorical chart" {...categoricalProps} />
      </SpaceBetween>
    </>
  );
}
