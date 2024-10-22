// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export interface SharedReactContextsApiInternal {
  createContext: <T>(ReactInstance: typeof React, contextName: string) => React.Context<T | undefined>;
}

export class SharedReactContexts {
  #registeredContexts = new WeakMap<typeof React, Map<string, React.Context<any>>>();

  createContext = <T>(ReactInstance: typeof React, contextName: string) => {
    let contexts = this.#registeredContexts.get(ReactInstance);
    if (!contexts) {
      contexts = new Map();
      this.#registeredContexts.set(ReactInstance, contexts);
    }

    let cachedContext = contexts.get(contextName);

    if (!cachedContext) {
      cachedContext = ReactInstance.createContext<T>(undefined as T);
      contexts.set(contextName, cachedContext);
    }

    return cachedContext;
  };

  installInternal(internalApi: Partial<SharedReactContextsApiInternal> = {}): SharedReactContextsApiInternal {
    internalApi.createContext ??= this.createContext;
    return internalApi as SharedReactContextsApiInternal;
  }
}
