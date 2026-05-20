// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';

export function renderDrawer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const drawer = createWrapper(container).findDrawer() ?? createWrapper().findDrawer()!;
  return { drawer };
}
