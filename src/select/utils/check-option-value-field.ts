// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { isDevelopment } from '../../internal/is-development';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

export function checkOptionValueField<ValueType extends ReadonlyArray<any>>(
  componentName: string,
  propertyName: string,
  propertyValue: ValueType | undefined
) {
  if (isDevelopment) {
    if (!propertyValue) {
      return;
    }

    const valuePropertyMissing = !propertyValue.every(element => {
      return 'options' in element || 'value' in element;
    });

    if (valuePropertyMissing) {
      warnOnce(
        componentName,
        `You provided an \`${propertyName}\` prop where at least one non-group array element is missing the \`value\` field. This field is required for all options without sub-items.`
      );
    }
  }
}
