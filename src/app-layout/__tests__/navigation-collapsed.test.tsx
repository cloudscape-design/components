// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '../../../lib/components/app-layout';
import customCssProps from '../../../lib/components/internal/generated/custom-css-properties';
import { describeEachAppLayout, renderComponent } from './utils';

import navStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/navigation/styles.css.js';
import skeletonStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/skeleton/styles.css.js';
import iconStyles from '../../../lib/components/icon/styles.css.js';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
  describe('collapsed rail visibility', () => {
    test('navigation is visible when navigationCloseBehavior="collapse" and navigationOpen=false', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={false} navigation={<>Nav content</>} />
      );
      const navContainer = wrapper.findNavigation().getElement().closest(`.${skeletonStyles.navigation}`);
      expect(navContainer).not.toHaveClass(skeletonStyles['panel-hidden']);
      expect(navContainer).toHaveClass(skeletonStyles['navigation-collapsed']);
    });

    test('navigation is hidden when navigationCloseBehavior="hide" and navigationOpen=false', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="hide" navigationOpen={false} navigation={<>Nav content</>} />
      );
      const navContainer = wrapper.findNavigation().getElement().closest(`.${skeletonStyles.navigation}`);
      expect(navContainer).toHaveClass(skeletonStyles['panel-hidden']);
      expect(navContainer).not.toHaveClass(skeletonStyles['navigation-collapsed']);
    });
  });

  describe('toggle behavior', () => {
    test('close button shows angle-right icon in collapsed state', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={false} navigation={<>Nav content</>} />
      );
      const closeButton = wrapper.findNavigationClose().getElement();
      expect(closeButton.querySelector(`.${iconStyles['name-angle-right']}`)).not.toBeNull();
    });

    test('close button shows angle-left icon in open state on desktop', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={true} navigation={<>Nav content</>} />
      );
      const closeButton = wrapper.findNavigationClose().getElement();
      expect(closeButton.querySelector(`.${iconStyles['name-angle-left']}`)).not.toBeNull();
    });
  });

  describe('aria-expanded', () => {
    test('close button has aria-expanded=false when navigation is closed', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={false} navigation={<>Nav content</>} />
      );
      expect(wrapper.findNavigationClose().getElement()).toHaveAttribute('aria-expanded', 'false');
    });

    test('close button has aria-expanded=true when navigation is open', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={true} navigation={<>Nav content</>} />
      );
      expect(wrapper.findNavigationClose().getElement()).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('aria-hidden', () => {
    test('nav is not aria-hidden when collapsed (visible and interactive)', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={false} navigation={<>Nav content</>} />
      );
      expect(wrapper.findNavigation().getElement().closest('nav')).toHaveAttribute('aria-hidden', 'false');
    });

    test('nav is aria-hidden when closed without collapsed', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="hide" navigationOpen={false} navigation={<>Nav content</>} />
      );
      expect(wrapper.findNavigation().getElement().closest('nav')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('navigationHide guard', () => {
    test('navigation is fully hidden when navigationHide=true regardless of navigationCloseBehavior', () => {
      const { wrapper } = renderComponent(
        <AppLayout
          navigationHide={true}
          navigationCloseBehavior="collapse"
          navigationOpen={false}
          navigation={<>Nav</>}
        />
      );
      expect(wrapper.findNavigation()).toBeFalsy();
      expect(wrapper.findNavigationToggle()).toBeFalsy();
    });
  });

  describe('layout computation', () => {
    test('sets navigationCollapsedWidth CSS property', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={false} navigation={<>Nav</>} />
      );
      const rootStyle = wrapper.getElement().style;
      expect(rootStyle.getPropertyValue(customCssProps.navigationCollapsedWidth)).toBe('54px');
    });

    test('uses custom navigationCollapsedWidth when provided', () => {
      const { wrapper } = renderComponent(
        <AppLayout
          navigationCloseBehavior="collapse"
          navigationCollapsedWidth={80}
          navigationOpen={false}
          navigation={<>Nav</>}
        />
      );
      const rootStyle = wrapper.getElement().style;
      expect(rootStyle.getPropertyValue(customCssProps.navigationCollapsedWidth)).toBe('80px');
    });
  });

  describe('default values', () => {
    test('navigationCollapsedWidth defaults to 54', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={false} navigation={<>Nav</>} />
      );
      const rootStyle = wrapper.getElement().style;
      expect(rootStyle.getPropertyValue(customCssProps.navigationCollapsedWidth)).toBe('54px');
    });
  });

  describe('navigationCollapsedWidth vs navigationWidth warning', () => {
    let consoleWarnSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });
    afterEach(() => {
      consoleWarnSpy?.mockRestore();
    });

    const warning =
      '[AwsUi] [AppLayout] `navigationCollapsedWidth` should be smaller than `navigationWidth`. ' +
      'When collapsed width equals or exceeds the expanded width, the ARIA expanded/collapsed semantics become inverted.';

    test('does not warn when collapsed width is smaller than navigation width', () => {
      renderComponent(
        <AppLayout
          navigationCloseBehavior="collapse"
          navigationWidth={200}
          navigationCollapsedWidth={54}
          navigation={<>Nav</>}
        />
      );
      expect(console.warn).not.toHaveBeenCalled();
    });

    test('does not warn when collapse behavior is not enabled, even if collapsed width is larger', () => {
      renderComponent(<AppLayout navigationWidth={100} navigationCollapsedWidth={200} navigation={<>Nav</>} />);
      expect(console.warn).not.toHaveBeenCalled();
    });

    test('warns when collapsed width is not smaller than navigation width', () => {
      renderComponent(
        <AppLayout
          navigationCloseBehavior="collapse"
          navigationWidth={200}
          navigationCollapsedWidth={200}
          navigation={<>Nav</>}
        />
      );
      expect(console.warn).toHaveBeenCalledWith(warning);
    });
  });
});

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['mobile'] }, () => {
  describe('mobile standard behavior (collapsed is desktop-only)', () => {
    test('navigation uses panel-hidden when closed on mobile, even with navigationCloseBehavior="collapse"', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={false} navigation={<>Nav content</>} />
      );
      const navContainer = wrapper.findNavigation().getElement().closest(`.${skeletonStyles.navigation}`);
      expect(navContainer).toHaveClass(skeletonStyles['panel-hidden']);
    });

    test('navigation does not use navigation-collapsed class on mobile', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={false} navigation={<>Nav content</>} />
      );
      const navContainer = wrapper.findNavigation().getElement().closest(`.${skeletonStyles.navigation}`);
      expect(navContainer).not.toHaveClass(skeletonStyles['navigation-collapsed']);
    });

    test('navigation-container does not have is-navigation-collapsed class on mobile', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={false} navigation={<>Nav content</>} />
      );
      const nav = wrapper.findNavigation().getElement().closest(`.${navStyles['navigation-container']}`);
      expect(nav).not.toHaveClass(navStyles['is-navigation-collapsed']);
    });

    test('navigation opens full width on mobile with standard behavior', () => {
      const { wrapper } = renderComponent(
        <AppLayout navigationCloseBehavior="collapse" navigationOpen={true} navigation={<>Nav content</>} />
      );
      const navContainer = wrapper.findNavigation().getElement().closest(`.${skeletonStyles.navigation}`);
      expect(navContainer).not.toHaveClass(skeletonStyles['panel-hidden']);
    });
  });
});
