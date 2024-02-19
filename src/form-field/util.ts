// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { GridProps } from '../grid/interfaces';

interface FormFieldIds {
  label?: string;
  description?: string;
  constraint?: string;
  error?: string;
  warning?: string;
}

function makeSlotId(prop: React.ReactNode, formFieldId: string, propName: string): string | undefined {
  if (!prop) {
    return undefined;
  }

  return `${formFieldId}-${propName}`;
}

export function getSlotIds(
  formFieldId: string,
  label?: React.ReactNode,
  description?: React.ReactNode,
  constraintText?: React.ReactNode,
  errorText?: React.ReactNode,
  warningText?: React.ReactNode
) {
  const ids: FormFieldIds = {
    label: makeSlotId(label, formFieldId, 'label'),
    description: makeSlotId(description, formFieldId, 'description'),
    constraint: makeSlotId(constraintText, formFieldId, 'constraint'),
    error: makeSlotId(errorText, formFieldId, 'error'),
    warning: makeSlotId(warningText, formFieldId, 'warning'),
  };

  return ids;
}

export function getAriaDescribedBy({ error, description, constraint }: FormFieldIds) {
  const describedByAttributes = [error, description, constraint].filter(e => !!e);
  const describedBy = describedByAttributes.length ? describedByAttributes.join(' ') : undefined;
  return describedBy;
}

export function getGridDefinition(stretch: boolean, secondaryControlPresent: boolean, isRefresh: boolean) {
  let columns: Array<{ colspan: GridProps.BreakpointMapping | number }>;

  if (stretch) {
    columns = [{ colspan: 12 }, { colspan: 12 }];
  } else if (isRefresh) {
    columns = [{ colspan: { default: 12, xs: 8 } }, { colspan: { default: 12, xs: 4 } }];
  } else {
    columns = [{ colspan: { default: 12, xs: 9 } }, { colspan: { default: 12, xs: 3 } }];
  }

  if (!secondaryControlPresent) {
    return [columns[0]];
  }

  return columns;
}
