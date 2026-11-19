// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act } from '@testing-library/react';

import { DateRangePickerWrapper } from '../../../lib/components/test-utils/dom';

export function changeMode(wrapper: DateRangePickerWrapper, mode: 'relative' | 'absolute') {
  const select = wrapper.findDropdown()!.findSelectionModeSwitch().findModesAsSelect();

  act(() => select.openDropdown());
  act(() => select.selectOption(mode === 'absolute' ? 2 : 1));
}
