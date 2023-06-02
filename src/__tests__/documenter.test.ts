// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getAllComponents, requireComponentDefinition } from './utils';

// Skipping to let documenter format changes through.
// See: https://github.com/cloudscape-design/documenter/pull/21
describe.skip('Documenter', () => {
  test.each<string>(getAllComponents())(`definition for %s matches the snapshot`, (componentName: string) => {
    const definition = requireComponentDefinition(componentName);
    expect(definition).toMatchSnapshot(componentName);
  });
});
