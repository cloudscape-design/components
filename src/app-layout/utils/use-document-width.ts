// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useState } from 'react';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

export default function useDocumentWidth() {
  const [width, setWidth] = useState(Number.POSITIVE_INFINITY);
  const getBody = useCallback(() => document.body, []);
  useResizeObserver(getBody, rect => setWidth(rect.contentBoxWidth));
  return width;
}
