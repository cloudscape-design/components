// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRoot } from 'react-dom/client';

import SecondaryLayout from '../../app-layout/utils/mixed-react-secondary-layout';

import '@cloudscape-design/global-styles/index.css';

// Entry of the child frame that dev pages load to run components with React 19 inside a page that runs another
// React version. webpack builds it in the `react19` layer, see webpack.config.base.cjs.
console.log(`Child frame using React ${React.version}`);

const parentDocument = window.parent.document;

function syncFromParent() {
  document.body.className = parentDocument.body.className;
  document.documentElement.dir = parentDocument.documentElement.dir;
}

syncFromParent();
new MutationObserver(syncFromParent).observe(parentDocument.body, { attributes: true, attributeFilter: ['class'] });

createRoot(document.getElementById('app')!).render(<SecondaryLayout />);
