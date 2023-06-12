// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import Link from '../../../lib/components/link';
import Button from '../../../lib/components/button';
import ButtonDropdown from '../../../lib/components/button-dropdown';
import SplitButton from '../../../lib/components/split-button';
import createWrapper from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/split-button/styles.css.js';
import buttonStyles from '../../../lib/components/button/styles.css.js';
import { warnOnce } from '../../../lib/components/internal/logging';

jest.mock('../../../lib/components/internal/logging', () => ({
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

describe('SplitButton', () => {
  test('renders correctly', () => {
    render(
      <SplitButton>
        <Button>Button</Button>
        <ButtonDropdown items={[]}>Button dropdown</ButtonDropdown>
      </SplitButton>
    );

    expect(warnOnce).not.toHaveBeenCalled();
    expect(createWrapper().findSplitButton()!.findAllByClassName(styles.trigger)).toHaveLength(2);
  });

  test('warns if less than two children are provided and renders no children', () => {
    render(
      <SplitButton>
        <Button>Button</Button>
      </SplitButton>
    );

    expect(warnOnce).toHaveBeenCalledWith('SplitButton', 'The component requires at least 2 children.');
    expect(createWrapper().findSplitButton()!.findAllByClassName(styles.trigger)).toHaveLength(0);
  });

  test('warns if children of unexpected type are provided and excludes those from rendering', () => {
    render(
      <SplitButton>
        <Button>Button</Button>
        <Link>Link</Link>
        <ButtonDropdown items={[]}>Button dropdown</ButtonDropdown>
      </SplitButton>
    );

    expect(warnOnce).toHaveBeenCalledWith(
      'SplitButton',
      'Only Button and ButtonDropdown are allowed as component children.'
    );
    expect(createWrapper().findSplitButton()!.findAllByClassName(styles.trigger)).toHaveLength(2);
  });

  test('warns if children of improper variant are provided and sets variant to normal', () => {
    render(
      <SplitButton>
        <Button variant="link">Button</Button>
        <Button variant="link">Button</Button>
      </SplitButton>
    );

    expect(warnOnce).toHaveBeenCalledWith('SplitButton', 'Only "normal" and "primary" variants are allowed.');
    expect(createWrapper().findSplitButton()!.findAllByClassName(buttonStyles['variant-normal'])).toHaveLength(2);
  });

  test('warns if children variants are mixed and uses the variant of the first child for those', () => {
    render(
      <SplitButton>
        <Button variant="normal">Button</Button>
        <Button variant="normal">Button</Button>
        <Button variant="primary">Button</Button>
        <Button variant="normal">Button</Button>
      </SplitButton>
    );

    expect(warnOnce).toHaveBeenCalledWith('SplitButton', 'All children must be of the same variant.');
    expect(createWrapper().findSplitButton()!.findAllByClassName(buttonStyles['variant-normal'])).toHaveLength(4);
  });

  test('renders correctly with label-less button dropdown used at the last position', () => {
    render(
      <SplitButton>
        <Button>Button</Button>
        <Button>Button</Button>
        <ButtonDropdown items={[]} />
      </SplitButton>
    );

    expect(warnOnce).not.toHaveBeenCalled();
  });

  test('warns if label-less dropdown is used not at the last position and excludes it from rendering', () => {
    render(
      <SplitButton>
        <Button>Button</Button>
        <ButtonDropdown items={[]} />
        <Button>Button</Button>
      </SplitButton>
    );

    expect(warnOnce).toHaveBeenCalledWith(
      'SplitButton',
      'ButtonDropdown without label is only allowed at the last position.'
    );
    expect(createWrapper().findSplitButton()!.findAllByClassName(styles.trigger)).toHaveLength(2);
  });

  test('warns if "primary" variant is used with more than 2 children', () => {
    render(
      <SplitButton>
        <Button variant="primary">Button</Button>
        <ButtonDropdown variant="primary" items={[]}>
          Button dropdown
        </ButtonDropdown>
        <Button variant="primary">Button</Button>
      </SplitButton>
    );

    expect(warnOnce).toHaveBeenCalledWith(
      'SplitButton',
      'The "primary" variant can only have one button followed by a button dropdown.'
    );
    expect(createWrapper().findSplitButton()!.findAllByClassName(buttonStyles['variant-normal'])).toHaveLength(3);
  });

  test('warns if "primary" variant is used with two button children', () => {
    render(
      <SplitButton>
        <Button variant="primary">Button</Button>
        <Button variant="primary">Button</Button>
      </SplitButton>
    );

    expect(warnOnce).toHaveBeenCalledWith(
      'SplitButton',
      'The "primary" variant can only have one button followed by a button dropdown.'
    );
    expect(createWrapper().findSplitButton()!.findAllByClassName(buttonStyles['variant-normal'])).toHaveLength(2);
  });

  test('warns if "primary" variant is used with two button dropdown children', () => {
    render(
      <SplitButton>
        <ButtonDropdown variant="primary" items={[]}>
          Button dropdown
        </ButtonDropdown>
        <ButtonDropdown variant="primary" items={[]}>
          Button dropdown
        </ButtonDropdown>
      </SplitButton>
    );

    expect(warnOnce).toHaveBeenCalledWith(
      'SplitButton',
      'The "primary" variant can only have one button followed by a button dropdown.'
    );
    expect(createWrapper().findSplitButton()!.findAllByClassName(buttonStyles['variant-normal'])).toHaveLength(2);
  });
});
