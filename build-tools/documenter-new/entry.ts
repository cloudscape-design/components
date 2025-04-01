// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { documentComponents } from './index.ts';
// import { documentComponents } from '@cloudscape-design/documenter';

documentComponents('tsconfig.json', 'src/*/index.tsx');
