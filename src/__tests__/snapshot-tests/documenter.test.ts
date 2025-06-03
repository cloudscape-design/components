// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import definitions from '../../../lib/components-definitions/components';
import { getAllComponents } from '../utils';

function requireComponentDefinition(componentName: string) {
  return definitions[componentName];
}

describe('Documenter', () => {
  test.each<string>(getAllComponents())(`definition for %s matches the snapshot`, (componentName: string) => {
    const definition = requireComponentDefinition(componentName);
    expect(definition).toMatchSnapshot(componentName);
  });
});
