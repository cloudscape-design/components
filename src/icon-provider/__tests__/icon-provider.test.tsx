// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import Icon, { IconProps } from '../../../lib/components/icon/index.js';
import IconProvider, { IconProviderProps } from '../../../lib/components/icon-provider/index.js';
import wrapper from '../../../lib/components/test-utils/dom/index.js';
import generatedIcons from '../../icon/generated/icons.js';

const CUSTOM_SVG = (
  <svg focusable={false}>
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
        <div data-testid="expectedSvg">{generatedIcons['add-plus']}</div>
      </>
    );

    const actualSvg = wrapper(container).findIcon()!.find('svg');
    const expectedSvg = wrapper(container).find('[data-testid=expectedSvg]')!.find('svg');

    expect(actualSvg).toStrictEqual(expectedSvg);
  });

  it('overrides an icon', () => {
    const { container } = render(
      <>
        {getIcon('add-plus', { 'add-plus': CUSTOM_SVG })}
        <div data-testid="expectedSvg">{CUSTOM_SVG}</div>
        <div data-testid="originalSvg">{generatedIcons['add-plus']}</div>
      </>
    );

    const actualSvg = wrapper(container).findIcon()!.find('svg');
    const expectedSvg = wrapper(container).find('[data-testid=expectedSvg]')!.find('svg');
    const originalSvg = wrapper(container).find('[data-testid=originalSvg]')!.find('svg');

    expect(actualSvg).not.toStrictEqual(originalSvg);
    expect(actualSvg).toStrictEqual(expectedSvg);
  });

  it('child provider uses parent context', () => {
    const { container } = render(
      <>
        <IconProvider icons={{ 'add-plus': CUSTOM_SVG }}>
          <Icon data-testid="firstIcon" name={'add-plus'} />
          <IconProvider icons={{ remove: CUSTOM_SVG }}>
            <Icon data-testid="secondIcon" name={'add-plus'} />
          </IconProvider>
        </IconProvider>
        <div data-testid="actualSvg">{generatedIcons['add-plus']}</div>
        <div data-testid="expectedFirstAndSecondSvg">{CUSTOM_SVG}</div>
      </>
    );

    const firstIcon = wrapper(container).find('[data-testid=firstIcon]')!.find('svg');
    const secondIcon = wrapper(container).find('[data-testid=secondIcon]')!.find('svg');
    const actualSvg = wrapper(container).find('[data-testid=actualSvg]')!.find('svg');
    const expectedFirstAndSecondSvg = wrapper(container).find('[data-testid=expectedFirstAndSecondSvg]')!.find('svg');

    expect(firstIcon).not.toStrictEqual(actualSvg);
    expect(firstIcon).toStrictEqual(expectedFirstAndSecondSvg);

    expect(secondIcon).not.toStrictEqual(actualSvg);
    expect(secondIcon).toStrictEqual(expectedFirstAndSecondSvg);
  });

  it('resets icons when configuration set to null', () => {
    const { container } = render(
      <>
        <IconProvider icons={{ 'add-plus': CUSTOM_SVG }}>
          <Icon data-testid="firstIcon" name={'add-plus'} />
          <IconProvider icons={null}>
            <Icon data-testid="secondIcon" name={'add-plus'} />
          </IconProvider>
        </IconProvider>
        <div data-testid="expectedFirstSvg">{CUSTOM_SVG}</div>
        <div data-testid="expectedSecondSvg">{generatedIcons['add-plus']}</div>
      </>
    );

    const firstIcon = wrapper(container).find('[data-testid=firstIcon]')!.find('svg');
    const secondIcon = wrapper(container).find('[data-testid=secondIcon]')!.find('svg');
    const expectedFirstSvg = wrapper(container).find('[data-testid=expectedFirstSvg]')!.find('svg');
    const expectedSecondSvg = wrapper(container).find('[data-testid=expectedSecondSvg]')!.find('svg');

    expect(firstIcon).not.toStrictEqual(expectedSecondSvg);
    expect(firstIcon).toStrictEqual(expectedFirstSvg);

    expect(secondIcon).not.toStrictEqual(expectedFirstSvg);
    expect(secondIcon).toStrictEqual(expectedSecondSvg);
  });

  it('resets specific icons when configuration set to null per item', () => {
    const { container } = render(
      <>
        <IconProvider icons={{ 'add-plus': CUSTOM_SVG, settings: CUSTOM_SVG }}>
          <Icon data-testid="firstAddPlus" name={'add-plus'} />
          <Icon data-testid="firstSettings" name={'settings'} />
          <IconProvider icons={{ 'add-plus': null }}>
            <Icon data-testid="secondAddPlus" name={'add-plus'} />
            <Icon data-testid="secondSettings" name={'settings'} />
          </IconProvider>
        </IconProvider>
        <div data-testid="customSvg">{CUSTOM_SVG}</div>
        <div data-testid="expectedAddPlusSvg">{generatedIcons['add-plus']}</div>
      </>
    );

    const firstAddPlus = wrapper(container).find('[data-testid=firstAddPlus]')!.find('svg');
    const firstSettings = wrapper(container).find('[data-testid=firstSettings]')!.find('svg');
    const secondAddPlus = wrapper(container).find('[data-testid=secondAddPlus]')!.find('svg');
    const secondSettings = wrapper(container).find('[data-testid=secondSettings]')!.find('svg');

    const customSvg = wrapper(container).find('[data-testid=customSvg]')!.find('svg');
    const expectedAddPlusSvg = wrapper(container).find('[data-testid=expectedAddPlusSvg]')!.find('svg');

    expect(firstAddPlus).toStrictEqual(customSvg);
    expect(firstSettings).toStrictEqual(customSvg);

    expect(secondAddPlus).toStrictEqual(expectedAddPlusSvg);
    expect(secondSettings).toStrictEqual(customSvg);
  });
});
