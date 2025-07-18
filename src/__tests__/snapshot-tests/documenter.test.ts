// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import definitions from '../../../lib/components-definitions/components';
// @ts-expect-error no typings
import testUtilDomDefinitions from '../../../lib/components-definitions/test-utils-doc/dom';
// @ts-expect-error no typings
import testUtilSelectorsDefinitions from '../../../lib/components-definitions/test-utils-doc/selectors';
import { getAllComponents } from '../utils';

function requireComponentDefinition(componentName: string) {
  return definitions[componentName];
}

describe('Components', () => {
  test.each<string>(getAllComponents())(`definition for %s matches the snapshot`, (componentName: string) => {
    const definition = requireComponentDefinition(componentName);
    expect(definition).toMatchSnapshot(componentName);
  });
});

describe('Test-utils', () => {
  test('dom definitions match the snapshot' + '', () => {
    expect(testUtilDomDefinitions).toMatchSnapshot();
  });

  test('selectors definitions match the snapshot', () => {
    expect(testUtilSelectorsDefinitions).toMatchSnapshot();
  });
});
