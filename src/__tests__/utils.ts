/* eslint-env node */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'path';
import fs from 'fs';

const componentsDir = path.resolve(__dirname, '../../lib/components');
const definitionsDir = path.resolve(__dirname, '../../lib/components-definitions/components');

export function getAllComponents(): string[] {
  return fs
    .readdirSync(componentsDir)
    .filter(
      name =>
        name !== 'internal' &&
        name !== 'test-utils' &&
        name !== 'theming' &&
        name !== 'contexts' &&
        name !== 'calendar' &&
        name !== 'date-input' &&
        !name.includes('.') &&
        !name.includes('LICENSE')
    );
}

/**
 * Some components do not render any DOM elements on their own (e.g. if they only
 * provide a React context), and thus cannot render any properties to the DOM.
 *
 * This function indicates whether a specific component supports properties
 * that can be rendered to the DOM.
 *
 * @param componentName the name of the component in kebap-case
 */
export function supportsDOMProperties(componentName: string) {
  const componentsWithoutDOMPropertiesSupport = ['annotation-context'];
  return !componentsWithoutDOMPropertiesSupport.includes(componentName);
}

export function requireComponent(componentName: string): any {
  return require(path.join(componentsDir, componentName));
}

export function requireComponentDefinition(componentName: string): any {
  return require(path.join(definitionsDir, componentName));
}
