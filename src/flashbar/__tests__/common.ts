// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../lib/components/test-utils/dom';
import { render as reactRender } from '@testing-library/react';

export function render(element: React.ReactElement) {
  return createWrapper(reactRender(element).container).findFlashbar()!;
}
