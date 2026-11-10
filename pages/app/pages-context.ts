// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { ComponentType } from 'react';

interface PageModule {
  default: ComponentType;
}

// The keys of the glob are relative to this file ("../button/simple.page.tsx"),
// the pages are addressed relative to the pages directory ("./button/simple.page.tsx")
const pages = import.meta.glob<PageModule>('../**/*.page.tsx');

function pagesContext(key: string): Promise<PageModule> {
  const loadPage = pages[`.${key}`];
  return loadPage ? loadPage() : Promise.reject(new Error(`Cannot find module '${key}'`));
}

pagesContext.keys = () => Object.keys(pages).map(key => key.slice(1));

export default pagesContext;
