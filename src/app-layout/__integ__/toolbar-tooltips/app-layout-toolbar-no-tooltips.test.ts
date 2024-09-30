// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import createWrapper from '../../../../lib/components/test-utils/selectors';
import { drawerIds as drawerIdObj } from '../../../../lib/dev-pages/pages/app-layout/utils/drawer-ids';
import { visibleMobileToolbarTriggersLimit } from '../constants';
import { setupTest } from '../utils';

const wrapper = createWrapper().findAppLayout();
const drawerIds = Object.values(drawerIdObj);

describe.each(['refresh', 'classic'] as const)('%s', theme => {
  describe.each(['desktop', 'mobile'] as const)('%s', size => {
    const mobileDrawerTriggerIds = drawerIds.slice(0, visibleMobileToolbarTriggersLimit);
    const drawerIdsToTest = [...(size === 'mobile' ? mobileDrawerTriggerIds : drawerIds)];
    const firstDrawerTriggerSelector = `button[data-testid="awsui-app-layout-trigger-${drawerIdsToTest[0]}"]`;
    const triggerTooltipSelector = wrapper.findDrawerTriggerTooltip().toSelector();

    test(
      'No drawer trigger tooltip showing for mouse interactions',
      setupTest({ size, theme }, async page => {
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.hoverElement(firstDrawerTriggerSelector);
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
      })
    );

    test(
      'No drawer trigger tooltip showing for pointer interactions',
      setupTest({ size, theme }, async page => {
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.buttonDownOnElement(firstDrawerTriggerSelector);
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
      })
    );

    test(
      'No drawer trigger tooltip showing for keyboard (tab) interactions',
      setupTest({ size, theme }, async page => {
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        //set focus by clicking open and close
        await page.click(firstDrawerTriggerSelector);
        (await size) === 'mobile' ? page.keys('Enter') : page.click(firstDrawerTriggerSelector);
        await expect(page.isFocused(firstDrawerTriggerSelector)).resolves.toBeTruthy();
        //move focus away
        await page.keys(['Shift', 'Tab', 'Null']);
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        await page.keys('Tab');
        await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
      })
    );

    describe.each(['bottom', 'side'] as const)('splitPanelPosition=%s', splitPanelPosition => {
      test(
        'No split panel trigger tooltip showing for mouse interactions',
        setupTest({ size, theme, splitPanelPosition }, async page => {
          await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
          await page.hoverElement(wrapper.findSplitPanelOpenButton().toSelector());
          await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        })
      );

      test(
        'No split panel trigger tooltip showing for pointer interactions',
        setupTest({ size, theme, splitPanelPosition }, async page => {
          await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
          await page.buttonDownOnElement(wrapper.findSplitPanelOpenButton().toSelector());
          await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        })
      );

      test(
        'No split panel trigger tooltip showing for keyboard (tab) interactions',
        setupTest({ size, theme, splitPanelPosition }, async page => {
          await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
          //set focus by clicking open and close
          await page.click(wrapper.findSplitPanelOpenButton().toSelector());
          await expect(page.isFocused(wrapper.findSplitPanel().findSlider().toSelector())).resolves.toBeTruthy();
          //move focus away
          await page.keys(['Shift', 'Tab', 'Null']);

          await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
          await page.keys('Tab');
          await expect(page.isExisting(triggerTooltipSelector)).resolves.toBe(false);
        })
      );
    });
  });
});
