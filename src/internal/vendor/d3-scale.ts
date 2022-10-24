// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// This is because d3-scale and its transitive dependencies are using ESM format which will cause
// issues for clients using jest and do not have the associated jest-preset package installed.
export { scaleLinear, scaleLog, scaleTime, scaleBand } from 'd3-scale';
