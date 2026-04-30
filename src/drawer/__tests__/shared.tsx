// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { render } from '@testing-library/react';

import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import createWrapper from '../../../lib/components/test-utils/dom';
import DrawerWrapper from '../../../lib/components/test-utils/dom/drawer';

import testClasses from '../../../lib/components/drawer/test-classes/styles.selectors.js';

// Adds support for NextDrawer selectors (backdrop, close action) that are not yet in the official test-utils.
// Once the official DrawerWrapper adds these methods, remove the Proxy and use the wrapper directly.

interface NextDrawerMethods {
  findBackdrop(): ElementWrapper | null;
  findCloseAction(): ElementWrapper | null;
}

type NextDrawerWrapper = DrawerWrapper & NextDrawerMethods;

const nextMethods: Record<string, (wrapper: DrawerWrapper) => ElementWrapper | null> = {
  findBackdrop: w => w.findByClassName(testClasses.backdrop),
  findCloseAction: w => w.findByClassName(testClasses['close-action']),
};

function withNextMethods(wrapper: DrawerWrapper): NextDrawerWrapper {
  return new Proxy(wrapper, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver);
      const factory = nextMethods[prop as string];
      if (factory) {
        return () => factory(target);
      }
      return original;
    },
  }) as NextDrawerWrapper;
}

export function renderDrawer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const drawer = withNextMethods(createWrapper(container).findDrawer()!);
  return { drawer };
}
