// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';

import { useContainerBreakpoints } from '../../internal/hooks/container-queries';
import { TopNavigationProps } from './interfaces';
import styles from './styles.css.js';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';

export interface UseTopNavigationParams {
  __internalRootRef?: React.MutableRefObject<HTMLElement> | null;
  identity: TopNavigationProps['identity'];
  search: TopNavigationProps['search'];
  utilities: NonNullable<TopNavigationProps['utilities']>;
}

export interface ResponsiveState {
  hideUtilityText?: boolean;
  hideSearch?: boolean;
  hideUtilities?: number[];
  hideTitle?: boolean;
}

export interface TopNavigationSizeConfiguration {
  hasSearch: boolean;
  availableWidth: number;
  utilitiesLeftPadding: number;
  fullIdentityWidth: number;
  titleWidth: number;
  searchSlotWidth: number;
  searchUtilityWidth: number;
  utilityWithLabelWidths: number[];
  utilityWithoutLabelWidths: number[];
  menuTriggerUtilityWidth: number;
}

export interface UseTopNavigation {
  ref: React.Ref<HTMLDivElement>;
  virtualRef: React.Ref<HTMLDivElement>;

  responsiveState: ResponsiveState;
  breakpoint: 'default' | 'xxs' | 's';
  isSearchExpanded: boolean;
  onSearchUtilityClick: () => void;
}

// A small buffer to make calculations more lenient against browser lag or padding adjustments.
const RESPONSIVENESS_BUFFER = 20;

export function useTopNavigation({
  __internalRootRef: mainRef,
  identity,
  search,
  utilities,
}: UseTopNavigationParams): UseTopNavigation {
  // Refs and breakpoints
  const virtualRef = useRef<HTMLDivElement | null>(null);
  const [breakpoint, breakpointRef] = useContainerBreakpoints(['xxs', 's']);

  // Responsiveness state
  // The component works by calculating the possible resize states that it can
  // be in, and having a state variable to track which state we're currently in.
  const hasSearch = !!search;
  const hasTitleWithLogo = identity && !!identity.logo && !!identity.title;
  const responsiveStates = useMemo<ReadonlyArray<ResponsiveState>>(() => {
    return generateResponsiveStateKeys(utilities, hasSearch, hasTitleWithLogo);
  }, [utilities, hasSearch, hasTitleWithLogo]);

  // To hide/show elements dynamically, we need to know how much space they take up,
  // even if they're not being rendered. The top navigation elements are hidden/resized
  // based on the available size or if a search bar is open, and they need to be available
  // for calculations so we know where to toggle them. So we render a second, more stable
  // top-nav off screen to do these calculations against.
  //
  // We can't "affix" these values to pixels because they can depend on spacing tokens.
  // It's easier to render all of these utilities separately rather than figuring out
  // spacing token values, icon sizes, text widths, etc.
  //
  // TODO: Some of these values can be memoized to improve perf.
  const [responsiveState, containerQueryRef] = useContainerQuery<ResponsiveState>(() => {
    if (!mainRef?.current || !virtualRef.current) {
      return responsiveStates[0];
    }

    const sizeConfiguration = {
      hasSearch: !!search,

      // Get widths and paddings from the visible top navigation
      availableWidth: getContentBoxWidth(mainRef.current.querySelector(`.${styles['padding-box']}`)!),
      utilitiesLeftPadding: parseFloat(
        getComputedStyle(virtualRef.current.querySelector(`.${styles.utilities}`)!).paddingLeft
      ),

      // Get widths from the hidden top navigation
      fullIdentityWidth: virtualRef.current.querySelector(`.${styles.identity}`)!.getBoundingClientRect().width,
      titleWidth: virtualRef.current.querySelector(`.${styles.title}`)?.getBoundingClientRect().width ?? 0,
      searchSlotWidth: virtualRef.current.querySelector(`.${styles.search}`)?.getBoundingClientRect().width ?? 0,
      searchUtilityWidth: virtualRef.current.querySelector('[data-utility-special="search"]')!.getBoundingClientRect()
        .width,
      utilityWithLabelWidths: Array.prototype.slice
        .call(virtualRef.current.querySelectorAll(`[data-utility-hide="false"]`))
        .map((element: Element) => element.getBoundingClientRect().width),
      utilityWithoutLabelWidths: Array.prototype.slice
        .call(virtualRef.current.querySelectorAll(`[data-utility-hide="true"]`))
        .map((element: Element) => element.getBoundingClientRect().width),
      menuTriggerUtilityWidth: virtualRef.current
        .querySelector('[data-utility-special="menu-trigger"]')!
        .getBoundingClientRect().width,
    };

    return determineBestResponsiveState(responsiveStates, sizeConfiguration);
  }, [mainRef, search, responsiveStates]);

  // Search slot expansion on small screens
  const [isSearchMinimized, setSearchMinimized] = useState(true);
  const isSearchExpanded = !isSearchMinimized && breakpoint !== 's' && hasSearch && responsiveState?.hideSearch;

  // If the search was expanded, and then the screen resized so that the
  // expansion is no longer necessary. So we implicitly minimize it.
  useEffect(() => {
    if (!responsiveState?.hideSearch) {
      setSearchMinimized(true);
    }
  }, [responsiveState]);

  // If the search is expanded after clicking on the search utility, move
  // the focus to the input. Since this is a user-controlled slot, we're just
  // assuming that it contains an input, though it's a pretty safe guess.
  useEffect(() => {
    if (isSearchExpanded) {
      mainRef?.current?.querySelector<HTMLInputElement>(`.${styles.search} input`)?.focus();
    }
  }, [isSearchExpanded, mainRef]);

  const mergedRef = useMergeRefs(...(mainRef ? [mainRef] : []), containerQueryRef, breakpointRef);

  return {
    ref: mergedRef,
    virtualRef: virtualRef,
    responsiveState: responsiveState ?? responsiveStates[0],
    breakpoint: breakpoint ?? 'default',
    isSearchExpanded: !!isSearchExpanded,
    onSearchUtilityClick: () => setSearchMinimized(isSearchMinimized => !isSearchMinimized),
  };
}

/**
 * Get the width of the content box (assuming the element's box-sizing is border-box).
 */
function getContentBoxWidth(element: Element): number {
  const style = getComputedStyle(element);
  return parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
}

/**
 * Generates the series of responsive steps that can be performed on the header in order.
 */
export function generateResponsiveStateKeys(
  utilities: ReadonlyArray<TopNavigationProps.Utility>,
  canHideSearch: boolean,
  canHideTitle: boolean
): ReadonlyArray<ResponsiveState> {
  const states: ResponsiveState[] = [{}];
  if (utilities.some(utility => utility.text)) {
    states.push({ hideUtilityText: true });
  }
  if (canHideSearch) {
    states.push({
      hideUtilityText: true,
      hideSearch: true,
    });
  }
  const hiddenUtilties = [];
  for (let i = 0; i < utilities.length; i++) {
    if (!utilities[i].disableUtilityCollapse) {
      hiddenUtilties.push(i);
      states.push({
        hideUtilityText: true,
        hideSearch: canHideSearch || undefined,
        hideUtilities: hiddenUtilties.length > 0 ? hiddenUtilties.slice() : undefined,
      });
    }
  }
  if (canHideTitle) {
    states.push({
      hideUtilityText: true,
      hideSearch: canHideSearch || undefined,
      hideUtilities: hiddenUtilties.length > 0 ? hiddenUtilties.slice() : undefined,
      hideTitle: true,
    });
  }
  return states;
}

/**
 * Determines the best responsive state configuration of the top navigation, based on the given list of possible responsive states
 * and the current sizes of all elements inside the navigation bar.
 */
export function determineBestResponsiveState(
  possibleStates: ReadonlyArray<ResponsiveState>,
  sizes: TopNavigationSizeConfiguration
): ResponsiveState {
  const {
    hasSearch,
    availableWidth,
    utilitiesLeftPadding,
    fullIdentityWidth,
    titleWidth,
    searchSlotWidth,
    searchUtilityWidth,
    utilityWithLabelWidths,
    utilityWithoutLabelWidths,
    menuTriggerUtilityWidth,
  } = sizes;
  // Iterate through each state and calculate its expected required width.
  for (const state of possibleStates) {
    const searchWidth = hasSearch ? (state.hideSearch ? searchUtilityWidth : searchSlotWidth) : 0;
    const utilitiesWidth: number = (state.hideUtilityText ? utilityWithoutLabelWidths : utilityWithLabelWidths)
      .filter((_width, i) => !state.hideUtilities || state.hideUtilities.indexOf(i) === -1)
      .reduce((sum, width) => sum + width, 0);
    const menuTriggerWidth = state.hideUtilities ? menuTriggerUtilityWidth : 0;
    const identityWidth = state.hideTitle ? fullIdentityWidth - titleWidth : fullIdentityWidth;
    const expectedInnerWidth = identityWidth + searchWidth + utilitiesLeftPadding + utilitiesWidth + menuTriggerWidth;
    if (expectedInnerWidth <= availableWidth - RESPONSIVENESS_BUFFER) {
      return state;
    }
  }

  // If nothing matches, pick the smallest possible state.
  return possibleStates[possibleStates.length - 1];
}
