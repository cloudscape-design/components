// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useGroupedControlContext } from '../../../../../lib/components/internal/context/control-group-context';
import { useFormFieldContext } from '../../../../../lib/components/internal/context/form-field-context';

export function PositionProbe({ testId = 'probe' }: { testId?: string }) {
  const { position } = useGroupedControlContext();
  return <span data-testid={testId}>{position ?? 'none'}</span>;
}

export function DirectionProbe({ testId = 'direction-probe' }: { testId?: string }) {
  const { direction } = useGroupedControlContext();
  return <span data-testid={testId}>{direction}</span>;
}

/**
 * Reports the form-field validation flags a child control sees. The group masks
 * these to `false` so inner controls (and their seams) stay neutral while the
 * group paints the single outer validation border.
 */
export function FormFieldValidationProbe({ testId = 'form-field-probe' }: { testId?: string }) {
  const { invalid, warning } = useFormFieldContext({});
  return <span data-testid={testId}>{`invalid:${!!invalid} warning:${!!warning}`}</span>;
}

/**
 * Reports the validation flags the group exposes through the grouped-control
 * context (the real state the group owns).
 */
export function GroupedValidationProbe({ testId = 'grouped-probe' }: { testId?: string }) {
  const { invalid, warning } = useGroupedControlContext();
  return <span data-testid={testId}>{`invalid:${!!invalid} warning:${!!warning}`}</span>;
}
