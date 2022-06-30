// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, ProviderProps, useLayoutEffect, useRef, useState } from 'react';

function getContextFromElement(element: HTMLElement, contextKey: string) {
  return (element as any)[contextKey];
}

function setContextToElement(element: HTMLElement, contextKey: string, contextValue: any) {
  (element as any)[contextKey] = contextValue;
  const event = document.createEvent('CustomEvent');
  event.initCustomEvent(contextKey, false, false, null);
  element.dispatchEvent(event);
}

function findupContext(contextKey: string, element: HTMLElement) {
  let currentElement: HTMLElement | null = element;
  while (currentElement) {
    if (getContextFromElement(currentElement, contextKey) !== undefined) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }
  return null;
}

export interface RootProviderProps<T> extends React.HTMLAttributes<HTMLDivElement>, ProviderProps<T> {}

export interface IntermediateProviderProps {
  parentElement: HTMLElement;
  children?: React.ReactNode;
}

export interface DomContextDeclaration<T> {
  context: React.Context<T>;
  RootProvider: React.FC<RootProviderProps<T>>;
  IntermediateProvider: React.FC<IntermediateProviderProps>;
}

export function createDomContext<T>(name: string, defaultValue: T): DomContextDeclaration<T> {
  const context = createContext<T>(defaultValue);
  const contextKey = `__awsui_context_${name}`;
  const ReactProvider = context.Provider;

  function RootProvider({ value, ...rest }: RootProviderProps<T>) {
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (ref.current) {
        setContextToElement(ref.current, contextKey, value);
      }
    }, [value]);
    return (
      <ReactProvider value={value}>
        <div ref={ref} {...rest} />
      </ReactProvider>
    );
  }

  function IntermediateProvider({ children, parentElement }: IntermediateProviderProps) {
    const [discoveredValue, setDiscoveredValue] = useState<T | null | undefined>(undefined);
    useLayoutEffect(() => {
      const providerElement = findupContext(contextKey, parentElement);
      if (!providerElement) {
        setDiscoveredValue(null);
      } else {
        setDiscoveredValue(getContextFromElement(providerElement, contextKey));
        const changeListener = () => {
          const newValue = getContextFromElement(providerElement, contextKey);
          setDiscoveredValue(newValue);
        };
        providerElement.addEventListener(contextKey, changeListener);
        return () => providerElement.removeEventListener(contextKey, changeListener);
      }
    }, [parentElement]);
    // it is undefined at the first render
    if (discoveredValue === undefined) {
      return null;
    }
    // we looked for context value but found nothing, continue rendering children
    if (discoveredValue === null) {
      return <>{children}</>;
    }
    // there is a context value, wrap into provider
    return <ReactProvider value={discoveredValue}>{children}</ReactProvider>;
  }

  return { context, RootProvider, IntermediateProvider };
}
