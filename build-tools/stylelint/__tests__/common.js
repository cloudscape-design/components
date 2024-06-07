// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { fileURLToPath } from 'node:url';

export const configBasedir = fileURLToPath(new URL('.', import.meta.url));
