// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Metrics } from '@cloudscape-design/component-toolkit/internal';

import { PACKAGE_SOURCE, PACKAGE_VERSION, THEME } from './environment';

export const metrics = new Metrics({ packageSource: PACKAGE_SOURCE, packageVersion: PACKAGE_VERSION, theme: THEME });
