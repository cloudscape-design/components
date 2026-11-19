// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderToStaticMarkup } from 'react-dom/server';

import icons from '../../../lib/components/icon/generated/icons';
export function getIconHTML(iconName: keyof typeof icons) {
  return renderToStaticMarkup(icons[iconName]);
}
