// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import * as baseComponentHooks from '../../../lib/components/internal/hooks/use-base-component';
import Table from '../../../lib/components/table';

const useBaseComponentSpy = jest.spyOn(baseComponentHooks, 'default');

test('reports cellVerticalAlign and columnDefinitionsVerticalAlign correctly', () => {
  const def = (id: string, verticalAlign: 'middle' | 'top') => ({ id, header: '', cell: () => null, verticalAlign });

  render(<Table columnDefinitions={[def('1', 'middle')]} items={[]} />);

  expect(useBaseComponentSpy).toHaveBeenCalledWith(
    'Table',
    {
      props: expect.objectContaining({ cellVerticalAlign: 'middle' }),
      metadata: expect.objectContaining({ usesColumnDefinitionsVerticalAlign: false }),
    },
    expect.anything()
  );

  render(<Table columnDefinitions={[def('1', 'middle')]} items={[]} cellVerticalAlign="top" />);

  expect(useBaseComponentSpy).toHaveBeenCalledWith(
    'Table',
    {
      props: expect.objectContaining({ cellVerticalAlign: 'top' }),
      metadata: expect.objectContaining({ usesColumnDefinitionsVerticalAlign: true }),
    },
    expect.anything()
  );

  render(<Table columnDefinitions={[def('1', 'top'), def('2', 'top')]} items={[]} cellVerticalAlign="top" />);

  expect(useBaseComponentSpy).toHaveBeenCalledWith(
    'Table',
    {
      props: expect.objectContaining({ cellVerticalAlign: 'top' }),
      metadata: expect.objectContaining({ usesColumnDefinitionsVerticalAlign: false }),
    },
    expect.anything()
  );
});
test('reports automatic skeleton configuration', () => {
  render(<Table columnDefinitions={[]} items={[]} loading={true} skeleton={{ totalRows: 'auto', maxAutoRows: 10 }} />);

  expect(useBaseComponentSpy).toHaveBeenCalledWith(
    'Table',
    {
      props: expect.anything(),
      metadata: expect.objectContaining({
        hasSkeleton: true,
        skeletonAutoRows: true,
        skeletonMaxAutoRows: 10,
        skeletonTotalRows: null,
      }),
    },
    expect.anything()
  );
});

test('does not report an automatic row cap for fixed skeleton rows', () => {
  render(<Table columnDefinitions={[]} items={[]} loading={true} skeleton={{ totalRows: 5 }} />);

  expect(useBaseComponentSpy).toHaveBeenCalledWith(
    'Table',
    {
      props: expect.anything(),
      metadata: expect.objectContaining({
        skeletonAutoRows: false,
        skeletonMaxAutoRows: null,
        skeletonTotalRows: 5,
      }),
    },
    expect.anything()
  );
});
