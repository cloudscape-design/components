// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { GridNavigationProcessor } from '../../../../lib/components/table/table-role/grid-navigation';

describe('GridNavigationProcessor', () => {
  test('does not throw when not initialized', () => {
    const navigation = new GridNavigationProcessor({
      current: {
        updateFocusTarget: () => {},
        getFocusTarget: () => null,
        isRegistered: () => false,
      },
    });
    expect(() => navigation.getNextFocusTarget()).not.toThrow();
    expect(() => navigation.isElementSuppressed(null)).not.toThrow();
    expect(() => navigation.isElementSuppressed(document.createElement('div'))).not.toThrow();
    expect(() => navigation.onRegisterFocusable(document.createElement('div'))).not.toThrow();
    expect(() => navigation.onUnregisterActive()).not.toThrow();
    expect(() => navigation.refresh()).not.toThrow();
    expect(() => navigation.update({ pageSize: 10 })).not.toThrow();
    expect(() => navigation.cleanup()).not.toThrow();
  });
});
