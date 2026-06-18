// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TopNavigationProps } from '../../../lib/components/top-navigation/interfaces';
import {
  determineBestResponsiveState,
  generateResponsiveStateKeys,
  TopNavigationSizeConfiguration,
} from '../../../lib/components/top-navigation/use-top-navigation';

function testResponsiveness(
  componentConfig: {
    utilities: ReadonlyArray<TopNavigationProps.Utility>;
    canHideSearch?: boolean;
    canHideTitle?: boolean;
  },
  sizeConfig: Partial<TopNavigationSizeConfiguration>
) {
  const possibleStates = generateResponsiveStateKeys(
    componentConfig.utilities,
    componentConfig.canHideSearch || false,
    componentConfig.canHideTitle || false
  );

  const responsiveState = determineBestResponsiveState(possibleStates, {
    hasSearch: false,
    utilityWithLabelWidths: [],
    utilityWithoutLabelWidths: [],
    availableWidth: 0,
    utilitiesLeftPadding: 0,
    fullIdentityWidth: 0,
    titleWidth: 0,
    searchSlotWidth: 0,
    searchUtilityWidth: 0,
    menuTriggerUtilityWidth: 0,
    ...sizeConfig,
  });

  return { possibleStates, responsiveState };
}

describe('TopNavigation responsiveness', () => {
  it('no changes for just a title', () => {
    const { possibleStates, responsiveState } = testResponsiveness(
      { utilities: [] },
      { availableWidth: 1000, fullIdentityWidth: 100, titleWidth: 100 }
    );

    // Empty states because there are no utilities to hide
    expect(possibleStates).toEqual([{}]);
    expect(responsiveState).toEqual({});
  });

  it('displays all utilities with text if there is sufficient space', () => {
    const { possibleStates, responsiveState } = testResponsiveness(
      {
        utilities: [
          { type: 'button', text: '1' },
          { type: 'button', text: '2' },
          { type: 'button', text: '3' },
        ],
      },
      {
        availableWidth: 2000,
        fullIdentityWidth: 100,
        titleWidth: 100,
        utilityWithLabelWidths: [100, 150, 120],
        utilityWithoutLabelWidths: [50, 50, 50],
      }
    );

    // Possible states will try to hide various utilities
    expect(possibleStates).toEqual([
      {},
      { hideUtilityText: true },
      { hideUtilityText: true, hideUtilities: [0] },
      { hideUtilityText: true, hideUtilities: [0, 1] },
      { hideUtilityText: true, hideUtilities: [0, 1, 2] },
    ]);
    // There is enough space for everything, so no need to hide anything
    expect(responsiveState).toEqual({});
  });

  it('hides utility text when necessary', () => {
    const { possibleStates, responsiveState } = testResponsiveness(
      {
        utilities: [
          { type: 'button', text: '1' },
          { type: 'button', text: '2' },
        ],
      },
      {
        availableWidth: 500,
        fullIdentityWidth: 100,
        titleWidth: 100,
        utilityWithLabelWidths: [200, 250],
        utilityWithoutLabelWidths: [50, 50],
      }
    );

    // Possible states will try to hide various utilities
    expect(possibleStates).toEqual([
      {},
      { hideUtilityText: true },
      { hideUtilityText: true, hideUtilities: [0] },
      { hideUtilityText: true, hideUtilities: [0, 1] },
    ]);
    // Hiding utility text is enough to display everything else
    expect(responsiveState).toEqual({ hideUtilityText: true });
  });

  it('moves utilities into overflow when necessary', () => {
    const { responsiveState } = testResponsiveness(
      {
        utilities: [
          { type: 'button', text: '1' },
          { type: 'button', text: '2' },
        ],
      },
      // Very limited space available and the first utility is very wide, even without the label
      {
        availableWidth: 350,
        fullIdentityWidth: 150,
        titleWidth: 150,
        utilityWithLabelWidths: [250, 200],
        utilityWithoutLabelWidths: [150, 50],
      }
    );

    // Hide all utility text and the first utility moves to overflow
    expect(responsiveState).toEqual({ hideUtilityText: true, hideUtilities: [0] });
  });

  it('collapses search if necessary', () => {
    const { possibleStates, responsiveState } = testResponsiveness(
      {
        utilities: [{ type: 'button', text: '1' }],
        canHideSearch: true,
      },
      // Contains a search bar and one utility with a visible label
      {
        availableWidth: 500,
        fullIdentityWidth: 250,
        titleWidth: 250,
        utilityWithLabelWidths: [100],
        utilityWithoutLabelWidths: [55],
        hasSearch: true,
        searchSlotWidth: 240,
        searchUtilityWidth: 50,
      }
    );

    // Possible states will try to hide utility text, collpase the search bar, and eventually hide the utility
    expect(possibleStates).toEqual([
      {},
      { hideUtilityText: true },
      { hideUtilityText: true, hideSearch: true },
      { hideSearch: true, hideUtilityText: true, hideUtilities: [0] },
    ]);
    // Hide all utility text and collapse the search bar
    expect(responsiveState).toEqual({ hideUtilityText: true, hideSearch: true });
  });

  it('can hide title if there is a logo', () => {
    const { possibleStates, responsiveState } = testResponsiveness(
      { utilities: [], canHideTitle: true },
      // Just a logo and a very long title
      {
        availableWidth: 500,
        fullIdentityWidth: 600,
        titleWidth: 50,
      }
    );

    expect(possibleStates).toEqual([{}, { hideTitle: true, hideUtilityText: true }]);
    expect(responsiveState).toEqual({ hideTitle: true, hideUtilityText: true });
  });

  it('keeps a long title if there is enough space', () => {
    const { possibleStates, responsiveState } = testResponsiveness(
      { utilities: [], canHideTitle: true },
      {
        availableWidth: 800,
        fullIdentityWidth: 500,
        titleWidth: 50,
      }
    );

    expect(possibleStates).toEqual([{}, { hideTitle: true, hideUtilityText: true }]);
    expect(responsiveState).toEqual({});
  });
});
