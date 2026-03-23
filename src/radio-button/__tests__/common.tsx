// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';

export function renderRadioButton(node: React.ReactNode) {
  const wrapper = createWrapper(render(<>{node}</>).container);
  return wrapper.findRadioButton()!;
}
