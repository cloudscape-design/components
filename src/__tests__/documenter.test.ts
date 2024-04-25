// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getAllComponents, requireComponentDefinition } from './utils';

describe('Documenter', () => {
  test.each<string>(getAllComponents())(`definition for %s matches the snapshot`, (componentName: string) => {
    if (componentName === 'expandable-section') {
      return;
    }
    const definition = requireComponentDefinition(componentName);

    expect(definition).toMatchSnapshot(componentName);
  });
});
