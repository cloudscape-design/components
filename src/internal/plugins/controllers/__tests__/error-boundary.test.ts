// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ErrorBoundaryController } from '../../../../../lib/components/internal/plugins/controllers/error-boundary';

test('getErrors returns recorded errors as an independent copy', () => {
  const controller = new ErrorBoundaryController();
  controller.recordError({ appLayoutPart: 'nav', message: 'boom' });

  const errors = controller.getErrors();
  expect(errors).toEqual([{ appLayoutPart: 'nav', message: 'boom' }]);

  (errors as Array<unknown>).push({ appLayoutPart: 'x', message: 'y' });
  expect(controller.getErrors()).toHaveLength(1);
});

test('clearErrors empties the buffer', () => {
  const controller = new ErrorBoundaryController();
  controller.recordError({ appLayoutPart: 'nav', message: 'boom' });
  controller.clearErrors();
  expect(controller.getErrors()).toEqual([]);
});

test('the buffer is capped and evicts oldest entries first', () => {
  const controller = new ErrorBoundaryController();
  for (let i = 0; i < 60; i++) {
    controller.recordError({ appLayoutPart: 'nav', message: `error-${i}` });
  }

  const errors = controller.getErrors();
  expect(errors).toHaveLength(50);
  expect(errors[0]).toEqual({ appLayoutPart: 'nav', message: 'error-10' });
  expect(errors[49]).toEqual({ appLayoutPart: 'nav', message: 'error-59' });
});

test('installInternal backfills missing methods without overwriting existing ones', () => {
  const controller = new ErrorBoundaryController();
  const existingRecordError = jest.fn();

  const api = controller.installInternal({ recordError: existingRecordError });

  expect(api.recordError).toBe(existingRecordError);
  expect(api.getErrors).toBe(controller.getErrors);
  expect(api.clearErrors).toBe(controller.clearErrors);
});
