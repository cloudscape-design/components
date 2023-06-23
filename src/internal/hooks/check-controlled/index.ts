// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { isDevelopment } from '../../is-development';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { NonCancelableEventHandler } from '../../events';

export default function checkControlled<ValueType, EventDetailType>(
  componentName: string,
  propertyName: string,
  propertyValue: ValueType | undefined,
  handlerName: string,
  handlerValue: NonCancelableEventHandler<EventDetailType> | undefined
) {
  if (propertyValue !== undefined && handlerValue === undefined && isDevelopment) {
    warnOnce(
      componentName,
      `You provided \`${propertyName}\` prop without an \`${handlerName}\` handler. This will render a read-only component. If the component should be mutable, set an \`${handlerName}\` handler.`
    );
  }
}
