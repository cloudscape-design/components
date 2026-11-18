// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Tabs, { TabsProps } from '../../../lib/components/tabs';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/tabs/styles.css.js';

const tabs: TabsProps['tabs'] = [
  { id: 'first', label: 'First', content: 'First content' },
  { id: 'second', label: 'Second', content: 'Second content', dismissible: true, dismissLabel: 'Dismiss second' },
  { id: 'third', label: 'Third', content: 'Third content', disabled: true },
];

function renderTabs(element: React.ReactElement) {
  const { container } = render(element);
  return { container, wrapper: createWrapper(container).findTabs()! };
}

describe('Tabs Style API v2', () => {
  describe('tabsHeader slot', () => {
    test('applies class to the tabs-header element', () => {
      const { container } = renderTabs(<Tabs tabs={tabs} {...{ styleClassNames: { tabsHeader: 'custom-header' } }} />);
      const bar = container.querySelector(`.${styles['tabs-header']}`);
      expect(bar).toHaveClass('custom-header');
    });
  });

  describe('tab slot string class', () => {
    test('applies class to every tab wrapper', () => {
      const { container } = renderTabs(<Tabs tabs={tabs} {...{ styleClassNames: { tab: 'custom-tab' } }} />);
      const containers = container.querySelectorAll(`.${styles['tabs-tab-header-container']}`);
      expect(containers).toHaveLength(3);
      containers.forEach(el => expect(el).toHaveClass('custom-tab'));
    });
  });

  describe('tab slot function class', () => {
    test('applies the callback result per tab', () => {
      const { container } = renderTabs(
        <Tabs tabs={tabs} {...{ styleClassNames: { tab: ({ tab }: { tab: TabsProps.Tab }) => `tab-${tab.id}` } }} />
      );
      const containers = container.querySelectorAll(`.${styles['tabs-tab-header-container']}`);
      expect(containers[0]).toHaveClass('tab-first');
      expect(containers[1]).toHaveClass('tab-second');
      expect(containers[2]).toHaveClass('tab-third');
    });

    test('callback receives the tab object', () => {
      const callback = jest.fn(({ tab }: { tab: TabsProps.Tab }) => `tab-${tab.id}`);
      renderTabs(<Tabs tabs={tabs} {...{ styleClassNames: { tab: callback } }} />);
      expect(callback).toHaveBeenCalledWith({ tab: tabs[0] });
      expect(callback).toHaveBeenCalledWith({ tab: tabs[1] });
      expect(callback).toHaveBeenCalledWith({ tab: tabs[2] });
    });
  });

  describe('tabLink slot', () => {
    test('applies class to every tab trigger', () => {
      const { container } = renderTabs(<Tabs tabs={tabs} {...{ styleClassNames: { tabLink: 'custom-link' } }} />);
      const links = container.querySelectorAll(`.${styles['tabs-tab-link']}`);
      expect(links).toHaveLength(3);
      links.forEach(el => expect(el).toHaveClass('custom-link'));
    });

    test('applies class to anchor trigger when tab has href', () => {
      const hrefTabs: TabsProps['tabs'] = [
        { id: 'a', label: 'A', href: '#a', content: 'A' },
        { id: 'b', label: 'B', href: '#b', content: 'B' },
      ];
      const { container } = renderTabs(<Tabs tabs={hrefTabs} {...{ styleClassNames: { tabLink: 'link-class' } }} />);
      const anchors = container.querySelectorAll(`a.${styles['tabs-tab-link']}`);
      expect(anchors).toHaveLength(2);
      anchors.forEach(el => expect(el).toHaveClass('link-class'));
    });
  });

  describe('content slot', () => {
    test('applies class to every panel including non-active panels', () => {
      const { container } = renderTabs(<Tabs tabs={tabs} {...{ styleClassNames: { content: 'custom-panel' } }} />);
      const panels = container.querySelectorAll(`.${styles['tabs-content']}`);
      expect(panels).toHaveLength(3);
      panels.forEach(el => expect(el).toHaveClass('custom-panel'));
    });

    test('applies class to non-active panels', () => {
      const { container } = renderTabs(
        <Tabs tabs={tabs} activeTabId="first" {...{ styleClassNames: { content: 'panel-class' } }} />
      );
      const inactivePanels = container.querySelectorAll(
        `.${styles['tabs-content']}:not(.${styles['tabs-content-active']})`
      );
      expect(inactivePanels.length).toBeGreaterThan(0);
      inactivePanels.forEach(el => expect(el).toHaveClass('panel-class'));
    });
  });

  describe('dismissButton slot', () => {
    test('applies class to the dismiss button root only', () => {
      const { container, wrapper } = renderTabs(
        <Tabs tabs={tabs} {...{ styleClassNames: { dismissButton: 'custom-dismiss' } }} />
      );
      expect(wrapper.findDismissibleButtonByTabId('second')!.getElement()).toHaveClass('custom-dismiss');
      expect(container.querySelectorAll('.custom-dismiss')).toHaveLength(1);
    });
  });

  describe('no container slot', () => {
    test('container variant does not receive a styleClassNames class on InternalContainer root', () => {
      const { container } = renderTabs(
        <Tabs tabs={tabs} variant="container" {...{ styleClassNames: { tabsHeader: 'hdr' } }} />
      );
      const root = container.firstElementChild;
      expect(root).not.toHaveClass('hdr');
    });
  });

  describe('DOM leak prevention', () => {
    test('does not leak the styleClassNames prop to the DOM', () => {
      const { container } = renderTabs(<Tabs tabs={tabs} {...{ styleClassNames: { tabsHeader: 'some-class' } }} />);
      expect(container.querySelector('[styleClassNames]')).toBeNull();
    });
  });
});
