// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// It's fine for importMessages to raise TypeScript requirements because
// it will usually be accompanied by the I18nProvider anyway.
// eslint-disable-next-line @cloudscape-design/ban-files
import { I18nProviderProps } from './provider';

export function importMessages(locale: string): Promise<ReadonlyArray<I18nProviderProps.Messages>>;
