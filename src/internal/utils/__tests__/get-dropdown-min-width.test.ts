// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getDropdownMinWidth } from '../get-dropdown-min-width';

const XXS_BREAKPOINT = 465;

describe('getDropdownMinWidth', () => {
  describe('dropdownWidth override', () => {
    it('returns dropdownWidth when provided, regardless of other params', () => {
      expect(getDropdownMinWidth({ expandToViewport: true, triggerWidth: 200, dropdownWidth: 300 })).toBe(300);
      expect(getDropdownMinWidth({ expandToViewport: false, triggerWidth: 200, dropdownWidth: 300 })).toBe(300);
      expect(getDropdownMinWidth({ expandToViewport: true, triggerWidth: null, dropdownWidth: 300 })).toBe(300);
    });
  });

  describe('expandToViewport=false', () => {
    it('returns "trigger"', () => {
      expect(getDropdownMinWidth({ expandToViewport: false, triggerWidth: 200 })).toBe('trigger');
      expect(getDropdownMinWidth({ expandToViewport: false, triggerWidth: null })).toBe('trigger');
      expect(getDropdownMinWidth({ expandToViewport: undefined, triggerWidth: 200 })).toBe('trigger');
    });
  });

  describe('expandToViewport=true', () => {
    it('returns undefined when triggerWidth is null', () => {
      expect(getDropdownMinWidth({ expandToViewport: true, triggerWidth: null })).toBeUndefined();
    });

    it('returns triggerWidth when smaller than xxs breakpoint', () => {
      expect(getDropdownMinWidth({ expandToViewport: true, triggerWidth: 200 })).toBe(200);
    });

    it('returns xxs breakpoint when triggerWidth is larger', () => {
      expect(getDropdownMinWidth({ expandToViewport: true, triggerWidth: 600 })).toBe(XXS_BREAKPOINT);
    });

    it('returns xxs breakpoint when triggerWidth equals it', () => {
      expect(getDropdownMinWidth({ expandToViewport: true, triggerWidth: XXS_BREAKPOINT })).toBe(XXS_BREAKPOINT);
    });
  });
});
