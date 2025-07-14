// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// It's fine for importMessages to raise TypeScript requirements because
// it will usually be accompanied by the I18nProvider anyway.

import { I18nProviderProps } from './provider.js';

export function importMessages(locale: string): Promise<ReadonlyArray<I18nProviderProps.Messages>>;
