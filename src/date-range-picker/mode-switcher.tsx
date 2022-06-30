// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { DateRangePickerProps, Focusable } from './interfaces';
import InternalSegmentedControl from '../segmented-control/internal';

import segmentedControlStyles from '../segmented-control/styles.css.js';
import buttonTriggerStyles from '../internal/components/button-trigger/styles.css.js';
import styles from './styles.css.js';

interface ModeSwitcherProps extends Pick<Required<DateRangePickerProps>, 'i18nStrings'> {
  mode: 'absolute' | 'relative';
  onChange: (mode: 'absolute' | 'relative') => void;
}

export default forwardRef(ModeSwitcher);

function ModeSwitcher({ i18nStrings, mode, onChange }: ModeSwitcherProps, ref: React.Ref<Focusable>) {
  const elementRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      if (elementRef.current) {
        (elementRef.current.getElementsByClassName(segmentedControlStyles.selected)[0] as HTMLButtonElement).focus();

        const select = elementRef.current.getElementsByClassName(buttonTriggerStyles['button-trigger']);

        for (const button of Array.prototype.slice.call(select)) {
          button.focus();
        }
      }
    },
  }));

  return (
    <div ref={elementRef}>
      <InternalSegmentedControl
        className={styles['mode-switch']}
        selectedId={mode}
        options={[
          { id: 'relative', text: i18nStrings.relativeModeTitle },
          { id: 'absolute', text: i18nStrings.absoluteModeTitle },
        ]}
        onChange={e => onChange(e.detail.selectedId as 'absolute' | 'relative')}
      />
    </div>
  );
}
