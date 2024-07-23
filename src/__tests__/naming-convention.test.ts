// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { pascalCase } from 'change-case';

import { getAllComponents, requireComponent } from './utils';

describe('component displayName matches import directory name', () => {
  getAllComponents().forEach(componentName => {
    const { default: Component } = requireComponent(componentName);
    test(componentName, () => {
      expect(Component.displayName).toBe(pascalCase(componentName));
    });
  });
});
