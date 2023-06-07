/* eslint-env node */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'path';
import fs from 'fs';
import React from 'react';
import { SplitPanelContextProvider } from '../../lib/components/internal/context/split-panel-context';
import { defaultSplitPanelContextProps } from './required-props-for-components';

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
        name !== 'i18n' &&
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

type WrapperComponent = React.ComponentType<{ children: React.ReactNode }>;

const WrappedSplitPanel: WrapperComponent = ({ children }) => (
  <SplitPanelContextProvider value={defaultSplitPanelContextProps}>{children}</SplitPanelContextProvider>
);

function wrap({ default: Component }: { default: React.ComponentType }, Wrapper: WrapperComponent) {
  const Wrapped = (props: any) => {
    return (
      <Wrapper>
        <Component {...props} />
      </Wrapper>
    );
  };
  Wrapped.displayName = Component.displayName;
  return { default: Wrapped };
}

export function requireComponent(componentName: string): any {
  if (componentName === 'split-panel') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return wrap(require(path.join(componentsDir, 'split-panel')), WrappedSplitPanel);
  }
  return require(path.join(componentsDir, componentName));
}

export function requireComponentDefinition(componentName: string): any {
  return require(path.join(definitionsDir, componentName));
}
