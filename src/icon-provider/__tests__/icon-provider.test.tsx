// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import Icon, { IconProps } from '../../../lib/components/icon';
import IconProvider, { IconProviderProps } from '../../../lib/components/icon-provider';
import wrapper from '../../../lib/components/test-utils/dom';
import generatedIcons from '../../icon/generated/icons';

const CUSTOM_SVG = (
  <svg>
    <circle cx="8" cy="8" r="7" />
  </svg>
);

const getIcon = (iconName: IconProps.Name, iconOverrides: IconProviderProps.Icons) => {
  return (
    <IconProvider icons={iconOverrides}>
      <Icon name={iconName} />
    </IconProvider>
  );
};

describe('Icon Provider', () => {
  it('does not override an icon which is not configured', () => {
    const { container } = render(
      <>
        {getIcon('add-plus', {})}
        <div data-testid="actualSvg">{generatedIcons['add-plus']}</div>
      </>
    );

    const actualSvg = wrapper(container).findIcon()!.find('svg');
    const expectedSvg = wrapper(container).find('[data-testid=actualSvg]')!.find('svg');

    expect(actualSvg).toStrictEqual(expectedSvg);
  });

  it('overrides an icon', () => {
    const { container } = render(
      <>
        {getIcon('add-plus', { 'add-plus': CUSTOM_SVG })}
        <div data-testid="actualSvg">{CUSTOM_SVG}</div>
        <div data-testid="originalSvg">{generatedIcons['add-plus']}</div>
      </>
    );

    const actualSvg = wrapper(container).findIcon()!.find('svg');
    const expectedSvg = wrapper(container).find('[data-testid=actualSvg]')!.find('svg');
    const originalSvg = wrapper(container).find('[data-testid=originalSvg]')!.find('svg');

    expect(actualSvg).not.toStrictEqual(originalSvg);
    expect(actualSvg).toStrictEqual(expectedSvg);
  });
});
