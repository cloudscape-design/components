// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// This file is only for the compiler. The artifacts will contain the generated bundle instead.
// `d3-scale` and its transitive dependencies are using ESM format which causes
// issues during unit tests at clients using jest and do not have the associated
// jest-preset package installed.
// eslint-disable-next-line no-restricted-imports
export { scaleLinear, scaleLog, scaleTime, scaleBand, ScaleContinuousNumeric, ScaleTime, ScaleBand } from 'd3-scale';
