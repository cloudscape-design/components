// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { importMessages } from '../../../lib/components/i18n';

afterEach(() => {
  jest.restoreAllMocks();
});

it('logs a warning if an unknown locale was provided', async () => {
  jest.spyOn(console, 'warn');
  const messages = await importMessages('klh');
  expect(messages).toEqual([]);
  expect(console.warn).toHaveBeenCalledWith(`[AwsUi] [importMessages] Unknown locale "klh" provided to importMessages`);
});
