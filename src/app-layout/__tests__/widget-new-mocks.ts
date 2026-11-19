// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export const renderedProps = new Map();
function createWidgetizedComponentMock(Implementation: React.ComponentType) {
  return () => {
    return function Widgetized(props: any) {
      renderedProps.set(Implementation.name, props);
      return null;
    };
  };
}

jest.mock('../../../lib/components/internal/widgets', () => ({
  createWidgetizedComponent: createWidgetizedComponentMock,
}));
