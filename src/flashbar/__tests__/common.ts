// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper, { FlashbarWrapper } from '../../../lib/components/test-utils/dom';
import { render } from '@testing-library/react';

export function createFlashbarWrapper(element: React.ReactElement) {
  return createWrapper(render(element).container).findFlashbar()!;
}

export function findList(flashbar: FlashbarWrapper) {
  return flashbar.find('ul');
}
