// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentType } from 'react';

const modules = import.meta.glob<{ default: ComponentType }>('../**/*.page.tsx', { eager: false });

const context = Object.assign(
  (key: string) => {
    const moduleLoader = modules[key];
    if (!moduleLoader) {
      return Promise.reject(new Error(`Module not found: ${key}`));
    }
    return moduleLoader();
  },
  {
    keys: () => Object.keys(modules).map(x => x.substring(1)),
  }
);

export default context;
