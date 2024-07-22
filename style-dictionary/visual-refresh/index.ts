// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemeBuilder } from '@cloudscape-design/theming-build';

import {
  createAlertContext,
  createCompactTableContext,
  createFlashbarContext,
  createFlashbarWarningContext,
  createHeaderContext,
  createTopNavigationContext,
} from '../utils/contexts';
import { createColorMode, createDensityMode, createMotionMode } from '../utils/modes';
import alertHeaderContextTokens from './contexts/header-alert';

const modes = [
  createColorMode('.awsui-dark-mode'),
  createDensityMode('.awsui-compact-mode'),
  createMotionMode('.awsui-motion-disabled'),
];

const tokenCategories = [
  require('./color-palette'),
  require('./color-charts'),
  require('./colors'),
  require('./typography'),
  require('./borders'),
  require('./motion'),
  require('./sizes'),
  require('./spacing'),
  require('./shadows'),
];

export function buildVisualRefresh(builder: ThemeBuilder) {
  tokenCategories.forEach(({ tokens, mode: modeId }) => {
    const mode = modes.find(mode => mode.id === modeId);
    builder.addTokens(tokens, mode);
  });

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  builder.addContext(createCompactTableContext(require('./contexts/compact-table').tokens));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  builder.addContext(createTopNavigationContext(require('./contexts/top-navigation').tokens));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  builder.addContext(createHeaderContext(require('./contexts/header').tokens));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  builder.addContext(createFlashbarContext(require('./contexts/flashbar').tokens));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  builder.addContext(createFlashbarWarningContext(require('./contexts/flashbar-warning').tokens));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  builder.addContext(createAlertContext(require('./contexts/alert').tokens));
  builder.addContext({
    id: 'alert-header',
    selector: '.awsui-context-content-header .awsui-context-alert',
    tokens: alertHeaderContextTokens,
  });

  return builder.build();
}

const builder = new ThemeBuilder('visual-refresh', ':root', modes);
const theme = buildVisualRefresh(builder);

export default theme;
