// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, TdHTMLAttributes, useRef, useState } from 'react';

import Tooltip from '../../../internal/components/tooltip';
import useHiddenDescription from '../../../internal/hooks/use-hidden-description';
import { useMergeRefs } from '../../../internal/hooks/use-merge-refs';
import { applyDisplayName } from '../../../internal/utils/apply-display-name';

import testutilStyles from '../../test-classes/styles.css.js';

interface GridCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  disabledReason?: string;
}

export const GridCell = forwardRef((props: GridCellProps, focusedDateRef: React.Ref<HTMLTableCellElement>) => {
  const { disabledReason, ...rest } = props;
  const isDisabledWithReason = !!disabledReason;
  const { targetProps, descriptionEl } = useHiddenDescription(disabledReason);
  const ref = useRef<HTMLTableCellElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <td
      ref={useMergeRefs(focusedDateRef, ref)}
      {...rest}
      {...(isDisabledWithReason ? targetProps : {})}
      onFocus={event => {
        if (rest.onFocus) {
          rest.onFocus(event);
        }

        if (isDisabledWithReason) {
          setShowTooltip(true);
        }
      }}
      onBlur={event => {
        if (rest.onBlur) {
          rest.onBlur(event);
        }

        if (isDisabledWithReason) {
          setShowTooltip(false);
        }
      }}
      onMouseEnter={event => {
        if (rest.onMouseEnter) {
          rest.onMouseEnter(event);
        }

        if (isDisabledWithReason) {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={event => {
        if (rest.onMouseLeave) {
          rest.onMouseLeave(event);
        }

        if (isDisabledWithReason) {
          setShowTooltip(false);
        }
      }}
    >
      {props.children}
      {isDisabledWithReason && (
        <>
          {descriptionEl}
          {showTooltip && (
            <Tooltip className={testutilStyles['disabled-reason-tooltip']} trackRef={ref} value={disabledReason!} />
          )}
        </>
      )}
    </td>
  );
});

applyDisplayName(GridCell, 'GridCell');
