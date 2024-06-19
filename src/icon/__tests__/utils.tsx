// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import icons from '../../../lib/components/icon/generated/icons';
import { renderToStaticMarkup } from 'react-dom/server';
export function getIconHTML(iconName: keyof typeof icons) {
  return renderToStaticMarkup(icons[iconName]);
}
