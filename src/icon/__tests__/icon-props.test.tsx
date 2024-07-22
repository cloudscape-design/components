// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Icon, { IconProps } from '../../../lib/components/icon';
import InternalIcon from '../../../lib/components/icon/internal';

jest.mock('../../../lib/components/icon/internal', () => {
  return jest.fn(() => null);
});

jest.mock('../../../lib/components/internal/hooks/use-base-component', () => {
  return jest.fn(() => null);
});

describe('Icon Component props', () => {
  test('passes down properties to internal icon component', () => {
    const props: IconProps = {
      name: 'add-plus',
      size: 'big',
      variant: 'normal',
      url: 'dummyUrl',
      alt: 'dummy alt text',
      svg: <svg></svg>,
    };
    render(<Icon {...props} />);
    expect(InternalIcon).toHaveBeenCalledWith(expect.objectContaining(props), {});
  });
});
