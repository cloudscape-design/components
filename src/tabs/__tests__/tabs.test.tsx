// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import TestI18nProvider from '../../../lib/components/i18n/testing';
import Tabs, { TabsProps } from '../../../lib/components/tabs';
import createWrapper, { TabsWrapper } from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/tabs/styles.css.js';

let mockHorizontalOverflow = false;
jest.mock('../../../lib/components/tabs/scroll-utils', () => {
  const originalScrollUtilsModule = jest.requireActual('../../../lib/components/tabs/scroll-utils');
  return {
    __esModule: true,
    ...originalScrollUtilsModule,
    hasHorizontalOverflow: (...args: any) =>
      mockHorizontalOverflow ? true : originalScrollUtilsModule.hasHorizontalOverflow(...args),
    hasInlineStartOverflow: (...args: any) =>
      mockHorizontalOverflow ? true : originalScrollUtilsModule.hasInlineStartOverflow(...args),
    hasInlineEndOverflow: (...args: any) =>
      mockHorizontalOverflow ? true : originalScrollUtilsModule.hasInlineEndOverflow(...args),
  };
});

function renderTabs(element: React.ReactElement) {
  const renderResult = render(element);
  return { ...renderResult, wrapper: wrap(renderResult.container) };
}

function wrap(container: HTMLElement) {
  return createWrapper(container).findTabs()!;
}

function pressRight(wrapper: TabsWrapper) {
  wrapper.findActiveTab()!.keydown(KeyCode.right);
}

function pressLeft(wrapper: TabsWrapper) {
  wrapper.findActiveTab()!.keydown(KeyCode.left);
}

function pressSpace(wrapper: TabsWrapper) {
  wrapper.findActiveTab()!.keydown(KeyCode.space);
}

function pressHome(wrapper: TabsWrapper) {
  wrapper.findActiveTab()!.keydown(KeyCode.home);
}

function pressEnd(wrapper: TabsWrapper) {
  wrapper.findActiveTab()!.keydown(KeyCode.end);
}

function pressPageUp(wrapper: TabsWrapper) {
  wrapper.findActiveTab()!.keydown(KeyCode.pageUp);
}

function pressPageDown(wrapper: TabsWrapper) {
  wrapper.findActiveTab()!.keydown(KeyCode.pageDown);
}

function tabListHeader(wrapper: TabsWrapper) {
  return wrapper.find('[role="tablist"]')!.getElement();
}

const defaultTabs: Array<TabsProps.Tab> = [
  {
    id: 'first',
    label: 'First tab',
    content: 'First content',
    href: '#first',
  },
  {
    id: 'second',
    label: 'Second tab',
    content: 'Second content',
    href: '#second',
  },
  {
    id: 'third',
    label: 'Third tab',
    disabled: true,
    content: 'Third content',
  },

  {
    id: 'fourth',
    label: 'Fourth tab',
  },
];

const actionDismissibleTabs: Array<TabsProps.Tab> = [
  {
    id: 'first',
    label: 'first tab',
    dismissible: true,
    dismissLabel: 'first-tab-dismissible-button',
    onDismiss: () => console.log('I have been called!'),
  },
  {
    id: 'second',
    label: 'second tab',
    action: <button id="second-tab-button"> test button </button>,
  },
  {
    id: 'third',
    label: 'third tab',
    dismissible: true,
    dismissLabel: 'third-tab-dismissible-button',
    action: <button id="third-tab-button"> test button </button>,
  },
  {
    id: 'fourth',
    label: 'fourth tab',
  },
  {
    id: 'fifth',
    label: 'fifth tab',
    dismissible: true,
    dismissLabel: 'Dismiss fifth tab (disabled)',
    dismissDisabled: true,
    disabled: true,
  },
  {
    id: 'sixth',
    label: 'sixth tab',
  },
];

describe('Tabs', () => {
  test('renders an empty tab list correctly', () => {
    const emptyTabs = renderTabs(<Tabs tabs={[]} />).wrapper.findTabLinks();
    expect(emptyTabs).toHaveLength(0);
  });

  test('renders a single item tab list correctly', () => {
    const singleItemTabs = renderTabs(<Tabs tabs={[defaultTabs[0]]} />).wrapper.findTabLinks();
    expect(singleItemTabs).toHaveLength(1);
    expect(singleItemTabs[0].getElement()).toHaveTextContent('First tab');
  });

  test('renders a single item tab list correctly with container variant', () => {
    const singleItemTabs = renderTabs(<Tabs tabs={[defaultTabs[0]]} variant="container" />).wrapper.findTabLinks();
    expect(singleItemTabs).toHaveLength(1);
    expect(singleItemTabs[0].getElement()).toHaveTextContent('First tab');
  });

  test('renders tabs in order', () => {
    const allItemTabs = renderTabs(<Tabs tabs={defaultTabs} />).wrapper.findTabLinks();
    const tabNames = allItemTabs.map(link => link.getElement().textContent);

    expect(tabNames).toEqual(['First tab', 'Second tab', 'Third tab', 'Fourth tab']);
  });

  test('renders tabs as disabled when necessary', () => {
    const tabs = renderTabs(<Tabs tabs={defaultTabs} />).wrapper.findTabLinks();
    expect(tabs[0].getElement()).not.toHaveClass(styles['tabs-tab-disabled']);
    expect(tabs[0].getElement()).not.toHaveAttribute('aria-disabled');

    expect(tabs[2].getElement()).toHaveClass(styles['tabs-tab-disabled']);
    expect(tabs[2].getElement()).toHaveAttribute('aria-disabled', 'true');
  });

  test('does not have an aria-label attribute by default without being set', () => {
    const tabs = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;
    expect(tabListHeader(tabs)).not.toHaveAttribute('aria-label');
  });

  test('does have a label attribute when it is set', () => {
    const tabs = renderTabs(<Tabs tabs={defaultTabs} ariaLabel="Some label" />).wrapper;
    expect(tabListHeader(tabs)).toHaveAttribute('aria-label', 'Some label');
  });

  test('does not have ariaLabelledby attribute by default without being set', () => {
    const tabs = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;
    expect(tabListHeader(tabs)).not.toHaveAttribute('aria-labelledby');
  });

  test('does have a ariaLabelledby attribute after it is set', () => {
    const tabs = renderTabs(<Tabs tabs={defaultTabs} ariaLabelledby="Some ariaLabelledby" />).wrapper;
    expect(tabListHeader(tabs)).toHaveAttribute('aria-labelledby', 'Some ariaLabelledby');
  });

  test('renders tabs content for every tab', () => {
    const tabs = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;
    const tabLinks = tabs.findTabLinks();
    const tabContents = tabs.findAllByClassName(styles['tabs-content']);

    defaultTabs.forEach((tab, index) => {
      const renderedTabId = tabContents[index].getElement().getAttribute('id');
      expect(renderedTabId).toMatch(new RegExp(`awsui-tabs-.*-${tab.id}-panel`));

      expect(tabLinks[index].getElement()).toHaveAttribute('aria-controls', renderedTabId);
    });
  });

  test('renders tabs with contentRenderStrategy: eager', () => {
    const tabs = renderTabs(
      <Tabs tabs={defaultTabs.map(tab => ({ ...tab, contentRenderStrategy: 'eager' }))} />
    ).wrapper;
    const tabContents = tabs.findAllByClassName(styles['tabs-content']);
    expect(tabContents[0].getElement()).not.toBeEmptyDOMElement();
    expect(tabContents[1].getElement()).not.toBeEmptyDOMElement();
  });

  test('renders tabs with contentRenderStrategy: lazy', () => {
    const tabs = renderTabs(
      <Tabs tabs={defaultTabs.map(tab => ({ ...tab, contentRenderStrategy: 'lazy' }))} />
    ).wrapper;
    const tabContents = tabs.findAllByClassName(styles['tabs-content']);
    expect(tabContents[0].getElement()).not.toBeEmptyDOMElement();
    expect(tabContents[1].getElement()).toBeEmptyDOMElement();
    tabs.findTabLinkByIndex(2)!.click();
    expect(tabContents[0].getElement()).not.toBeEmptyDOMElement();
    expect(tabContents[1].getElement()).not.toBeEmptyDOMElement();
  });

  test('renders tabs with contentRenderStrategy: active', () => {
    const tabs = renderTabs(
      <Tabs tabs={defaultTabs.map(tab => ({ ...tab, contentRenderStrategy: 'active' }))} />
    ).wrapper;
    const tabContents = tabs.findAllByClassName(styles['tabs-content']);
    expect(tabContents[0].getElement()).not.toBeEmptyDOMElement();
    expect(tabContents[1].getElement()).toBeEmptyDOMElement();
    tabs.findTabLinkByIndex(2)!.click();
    expect(tabContents[0].getElement()).toBeEmptyDOMElement();
    expect(tabContents[1].getElement()).not.toBeEmptyDOMElement();
  });

  describe('Active tab', () => {
    test('does not render any tab as active if active tab id is set on a disabled tab', () => {
      const tabs = renderTabs(<Tabs tabs={defaultTabs} activeTabId="third" onChange={() => void 0} />).wrapper;

      expect(tabs.findActiveTab()).toBe(null);
      expect(tabs.findTabContent()!.getElement()).toBeEmptyDOMElement();
    });

    test('displays active tab content', () => {
      const tabs = renderTabs(<Tabs tabs={defaultTabs} activeTabId="second" onChange={() => void 0} />).wrapper;
      expect(tabs.findActiveTab()!.getElement()).toHaveTextContent('Second tab');
      expect(tabs.findTabContent()!.getElement()).toHaveTextContent('Second content');
    });

    test("allows focusing the current tab even if it's disabled", () => {
      const tabs = renderTabs(<Tabs tabs={defaultTabs} activeTabId="third" onChange={() => void 0} />).wrapper;

      expect(tabs.findTabLinkById('third')!.getElement()).toHaveAttribute('tabindex', '0');
    });

    test('displays empty content if selected tab does not have content property', () => {
      const tabs = renderTabs(<Tabs tabs={defaultTabs} activeTabId="fourth" onChange={() => void 0} />).wrapper;

      expect(tabs.findActiveTab()!.getElement()).toHaveTextContent('Fourth tab');
      expect(tabs.findTabContent()!.getElement()).toBeEmptyDOMElement();
    });

    test('displays first tab by default if uncontrolled', () => {
      const tabs = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;
      expect(tabs.findActiveTab()!.getElement()).toHaveTextContent('First tab');
      expect(tabs.findTabContent()!.getElement()).toHaveTextContent('First content');
    });

    test('keeps active tab when rerendering tabs', () => {
      const { wrapper, rerender } = renderTabs(
        <Tabs tabs={defaultTabs} activeTabId="second" onChange={() => void 0} />
      );

      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Second tab');

      rerender(<Tabs tabs={defaultTabs.slice(1)} activeTabId="second" onChange={() => void 0} />);

      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Second tab');
    });
  });

  describe('User interaction (controlled)', () => {
    test('fires a change event when clicking on tab', () => {
      const changeSpy = jest.fn();

      const wrapper = renderTabs(<Tabs tabs={defaultTabs} activeTabId="first" onChange={changeSpy} />).wrapper;
      expect(changeSpy).not.toHaveBeenCalled();

      wrapper.findTabLinkByIndex(4)!.click();

      expect(changeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            activeTabId: 'fourth',
            activeTabHref: undefined,
          },
        })
      );
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    test('fires a change event when clicking on tab with container variant', () => {
      const changeSpy = jest.fn();

      const wrapper = renderTabs(
        <Tabs tabs={defaultTabs} activeTabId="first" onChange={changeSpy} variant="container" />
      ).wrapper;
      expect(changeSpy).not.toHaveBeenCalled();

      wrapper.findTabLinkByIndex(4)!.click();

      expect(changeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            activeTabId: 'fourth',
            activeTabHref: undefined,
          },
        })
      );
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    test('does not fire a change event when a modifier key is used', () => {
      const changeSpy = jest.fn();

      const wrapper = renderTabs(<Tabs tabs={defaultTabs} activeTabId="first" onChange={changeSpy} />).wrapper;

      wrapper.findTabLinkByIndex(2)!.click({ ctrlKey: true });
      expect(changeSpy).not.toHaveBeenCalled();
    });

    test('does not fire a change event when clicking on the active tab', () => {
      const changeSpy = jest.fn();

      const wrapper = renderTabs(<Tabs tabs={defaultTabs} activeTabId="first" onChange={changeSpy} />).wrapper;

      wrapper.findTabLinkByIndex(1)!.click();
      expect(changeSpy).not.toHaveBeenCalled();
    });

    test('does not fire a change event when clicking on a disabled tab', () => {
      const changeSpy = jest.fn();

      const wrapper = renderTabs(<Tabs tabs={defaultTabs} activeTabId="first" onChange={changeSpy} />).wrapper;

      wrapper.findTabLinkByIndex(3)!.click();
      expect(changeSpy).not.toHaveBeenCalled();
    });

    describe.each(['automatic', 'manual'] as TabsProps['keyboardActivationMode'][])(
      'keyboard events with %s activation',
      keyboardActivationMode => {
        const isManual = keyboardActivationMode === 'manual';
        test('navigating using right arrow', () => {
          const changeSpy = jest.fn();
          const wrapper = renderTabs(
            <Tabs
              tabs={defaultTabs}
              activeTabId="first"
              onChange={changeSpy}
              keyboardActivationMode={keyboardActivationMode}
            />
          ).wrapper;
          wrapper.findActiveTab()!.getElement().focus();

          expect(changeSpy).not.toHaveBeenCalled();

          pressRight(wrapper);

          if (isManual) {
            expect(changeSpy).not.toHaveBeenCalled();
            // We only test using space here, because in real browsers pressing enter triggers a click:
            // this behavior can't easily be replicated in jsdom. But we test enter behavior in integ tests :)
            pressSpace(wrapper);
          }

          expect(changeSpy).toHaveBeenCalledTimes(1);
          expect(changeSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              detail: {
                activeTabId: 'second',
                activeTabHref: '#second',
              },
            })
          );
        });

        test('navigating using left arrow', () => {
          const changeSpy = jest.fn();
          const wrapper = renderTabs(
            <Tabs
              tabs={defaultTabs}
              activeTabId="first"
              onChange={changeSpy}
              keyboardActivationMode={keyboardActivationMode}
            />
          ).wrapper;
          expect(changeSpy).not.toHaveBeenCalled();

          pressLeft(wrapper);

          if (isManual) {
            expect(changeSpy).not.toHaveBeenCalled();
            pressSpace(wrapper);
          }

          expect(changeSpy).toHaveBeenCalledTimes(1);
          expect(changeSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              detail: {
                activeTabId: 'fourth',
                activeTabHref: undefined,
              },
            })
          );
        });

        test('navigating using home and end key press', () => {
          const changeSpy = jest.fn();
          const wrapper = renderTabs(
            <Tabs
              tabs={defaultTabs}
              activeTabId="second"
              onChange={changeSpy}
              keyboardActivationMode={keyboardActivationMode}
            />
          ).wrapper;
          expect(changeSpy).not.toHaveBeenCalled();

          pressEnd(wrapper);

          if (isManual) {
            expect(changeSpy).not.toHaveBeenCalled();
            pressSpace(wrapper);
          }

          expect(changeSpy).toHaveBeenCalledTimes(1);
          expect(changeSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              detail: {
                activeTabId: 'fourth',
                activeTabHref: undefined,
              },
            })
          );

          pressHome(wrapper);

          if (isManual) {
            expect(changeSpy).toHaveBeenCalledTimes(1);
            pressSpace(wrapper);
          }

          expect(changeSpy).toHaveBeenCalledTimes(2);
          expect(changeSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              detail: {
                activeTabId: 'first',
                activeTabHref: '#first',
              },
            })
          );
        });

        test('does not call change when re-activating current tag', () => {
          const changeSpy = jest.fn();
          const wrapper = renderTabs(
            <Tabs
              tabs={defaultTabs}
              activeTabId="first"
              onChange={changeSpy}
              keyboardActivationMode={keyboardActivationMode}
            />
          ).wrapper;
          wrapper.findActiveTab()!.getElement().focus();

          pressSpace(wrapper);

          expect(changeSpy).not.toHaveBeenCalled();
        });
      }
    );

    test('does not fire an event on arrow navigation when a modifier key is used', () => {
      const changeSpy = jest.fn();
      const { wrapper } = renderTabs(<Tabs tabs={defaultTabs} activeTabId="second" onChange={changeSpy} />);
      wrapper.findActiveTab()!.keydown({ keyCode: KeyCode.right, metaKey: true });
      expect(changeSpy).not.toHaveBeenCalled();
    });

    test('changes displayed content only when activeTabId changes (with onChange handler)', () => {
      const { wrapper, rerender } = renderTabs(
        <Tabs tabs={defaultTabs} activeTabId="second" onChange={() => void 0} />
      );

      wrapper.findTabLinkByIndex(4)!.click();
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Second tab');

      rerender(<Tabs tabs={defaultTabs} activeTabId="fourth" onChange={() => void 0} />);

      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Fourth tab');
    });

    test('changes displayed content only when activeTabId changes (without onChange handler)', () => {
      const { wrapper, rerender } = renderTabs(<Tabs tabs={defaultTabs} activeTabId="second" />);

      wrapper.findTabLinkByIndex(4)!.click();
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Second tab');

      rerender(<Tabs tabs={defaultTabs} activeTabId="fourth" />);

      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Fourth tab');
    });
  });

  describe('User interaction (uncontrolled)', () => {
    test('changes activeTabId when clicking on tab (with onChange handler)', () => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} onChange={() => void 0} />).wrapper;
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('First tab');
      wrapper.findTabLinkById('fourth')!.click();
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Fourth tab');
    });

    test('changes activeTabId when clicking on tab (without onChange handler)', () => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('First tab');
      wrapper.findTabLinkById('fourth')!.click();
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Fourth tab');
    });

    test('changes activeTabId when clicking on tab with container variant (with onChange handler)', () => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} onChange={() => void 0} variant="container" />).wrapper;
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('First tab');
      wrapper.findTabLinkById('fourth')!.click();
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Fourth tab');
    });

    test('changes activeTabId when clicking on tab with container variant (without onChange handler)', () => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} variant="container" />).wrapper;
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('First tab');
      wrapper.findTabLinkById('fourth')!.click();
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Fourth tab');
    });

    test('fires a change event when clicking on tab', () => {
      const changeSpy = jest.fn();

      const wrapper = renderTabs(<Tabs tabs={defaultTabs} onChange={changeSpy} />).wrapper;
      expect(changeSpy).not.toHaveBeenCalled();

      wrapper.findTabLinkByIndex(4)!.click();

      expect(changeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            activeTabId: 'fourth',
            activeTabHref: undefined,
          },
        })
      );
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    test('does not allow selecting a disabled tab', () => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('First tab');
      wrapper.findTabLinkById('third')!.click();
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('First tab');
    });

    test('activates the next enabled tab on right and left arrow key press', () => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;

      wrapper.findActiveTab()!.getElement().focus();

      pressRight(wrapper);
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Second tab');
      expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();

      pressRight(wrapper);
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Fourth tab');
      expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();

      pressLeft(wrapper);
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Second tab');
      expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();

      pressLeft(wrapper);
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('First tab');
      expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();
    });

    test('activates the last/first enabled tab on end/home key press', () => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;

      wrapper.findActiveTab()!.getElement().focus();

      pressEnd(wrapper);
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Fourth tab');
      expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();

      pressHome(wrapper);
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('First tab');
      expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();
    });

    const tabsWithOneEnabledTab = [
      {
        id: 'first',
        label: 'First tab',
        disabled: true,
      },
      {
        id: 'second',
        label: 'Second tab',
      },
      {
        id: 'third',
        label: 'Third tab',
        disabled: true,
      },
    ];
    [tabsWithOneEnabledTab, [tabsWithOneEnabledTab[1]]].forEach(tabs => {
      let testMessage = 'With one tab';
      if (tabs.length === 3) {
        testMessage = 'With one enable tab';
      }
      describe(`${testMessage}`, () => {
        test('keeps the same tab active upon key interactions', () => {
          const wrapper = renderTabs(<Tabs tabs={tabs} />).wrapper;

          wrapper.findActiveTab()!.getElement().focus();

          pressLeft(wrapper);
          expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Second tab');
          expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();

          pressRight(wrapper);
          expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Second tab');
          expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();

          pressEnd(wrapper);
          expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Second tab');
          expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();

          pressHome(wrapper);
          expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Second tab');
          expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();
        });

        test('does not focus on disabled tab', () => {
          const { wrapper } = renderTabs(
            <Tabs
              tabs={defaultTabs.map(item => {
                if (item.id === 'second') {
                  return {
                    ...item,
                    disabled: true,
                    href: undefined,
                  };
                }
                return item;
              })}
            />
          );

          wrapper.findActiveTab()!.getElement().focus();
          pressRight(wrapper);

          expect(wrapper.findFocusedTab()!.getElement()).toHaveTextContent('Fourth tab');
        });

        test('does not focus on disabled tab with href', () => {
          const { wrapper } = renderTabs(
            <Tabs
              tabs={defaultTabs.map(item => {
                if (item.id === 'second') {
                  return {
                    ...item,
                    disabled: true,
                    href: '#second',
                  };
                }
                return item;
              })}
            />
          );

          wrapper.findActiveTab()!.getElement().focus();
          pressRight(wrapper);

          expect(wrapper.findFocusedTab()!.getElement()).toHaveTextContent('Fourth tab');
        });

        test('does not fire the change event upon key interactions', () => {
          const changeSpy = jest.fn();

          const wrapper = renderTabs(<Tabs tabs={tabs} onChange={changeSpy} />).wrapper;
          expect(changeSpy).not.toHaveBeenCalled();

          pressRight(wrapper);
          pressLeft(wrapper);
          pressHome(wrapper);
          pressEnd(wrapper);
          pressPageDown(wrapper);
          pressPageUp(wrapper);
          expect(changeSpy).not.toHaveBeenCalled();
        });
      });
    });

    test('fires a change event on right and left arrow key press', () => {
      const changeSpy = jest.fn();

      const wrapper = renderTabs(<Tabs tabs={defaultTabs} onChange={changeSpy} />).wrapper;
      wrapper.findActiveTab()!.getElement().focus();

      expect(changeSpy).not.toHaveBeenCalled();

      pressRight(wrapper);

      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            activeTabId: 'second',
            activeTabHref: '#second',
          },
        })
      );

      pressLeft(wrapper);

      expect(changeSpy).toHaveBeenCalledTimes(2);
      expect(changeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            activeTabId: 'first',
            activeTabHref: '#first',
          },
        })
      );
    });

    test('fires a change event on home and end key press', () => {
      const changeSpy = jest.fn();

      const wrapper = renderTabs(<Tabs tabs={defaultTabs} onChange={changeSpy} />).wrapper;
      expect(changeSpy).not.toHaveBeenCalled();

      pressEnd(wrapper);

      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            activeTabId: 'fourth',
            activeTabHref: undefined,
          },
        })
      );

      pressHome(wrapper);

      expect(changeSpy).toHaveBeenCalledTimes(2);
      expect(changeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            activeTabId: 'first',
            activeTabHref: '#first',
          },
        })
      );
    });

    test('wraps activated tab around on arrow key press', () => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;
      wrapper.findActiveTab()!.getElement().focus();

      pressLeft(wrapper);
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Fourth tab');
      expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();

      pressRight(wrapper);
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('First tab');
      expect(wrapper.findActiveTab()!.getElement()).toHaveFocus();
    });

    // eslint-disable-next-line jest/no-done-callback
    test('prevents the default anchor behaviour when clicked', done => {
      expect.assertions(1);
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;

      const callback = (event: MouseEvent) => {
        document.removeEventListener('click', callback);
        expect(event.defaultPrevented).toEqual(true);
        done();
      };
      document.addEventListener('click', callback);

      wrapper.findTabLinkByIndex(2)!.click();
    });

    // eslint-disable-next-line jest/no-done-callback
    test('does not prevent the default anchor behaviour when key modifier used', done => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;

      const callback = (event: MouseEvent) => {
        document.removeEventListener('click', callback);
        expect(event.defaultPrevented).toEqual(false);
        done();
      };
      document.addEventListener('click', callback);

      wrapper.findTabLinkByIndex(2)!.click({ ctrlKey: true });
    });

    // eslint-disable-next-line jest/no-done-callback
    test('prevents the default anchor behaviour when key modifier used, but no href provided', done => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;
      const callback = (event: MouseEvent) => {
        document.removeEventListener('click', callback);
        expect(event.defaultPrevented).toEqual(true);

        done();
      };
      document.addEventListener('click', callback);

      wrapper.findTabLinkByIndex(4)!.click({ ctrlKey: true });
    });

    test('does not change the state when a modifier key is used', () => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;

      wrapper.findTabLinkByIndex(2)!.click({ ctrlKey: true });
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('First tab');
    });

    test('changes the state when a modifier key is used, but no href provided', () => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;

      wrapper.findTabLinkByIndex(4)!.click({ ctrlKey: true });
      expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('Fourth tab');
    });

    test('tab should disable content gutter when disableContentPaddings is set', () => {
      const tabs1 = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;
      const tabContents1 = tabs1.findAllByClassName(styles['tabs-content-wrapper']);
      expect(tabContents1[0]!.getElement()).toHaveClass(styles['with-paddings']);

      const tabs2 = renderTabs(<Tabs tabs={defaultTabs} disableContentPaddings={true} />).wrapper;
      const tabContents2 = tabs2.findAllByClassName(styles['tabs-content-wrapper']);
      expect(tabContents2[0]!.getElement()).not.toHaveClass(styles['with-paddings']);
    });
  });

  describe('URL sanitization', () => {
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });
    afterEach(() => {
      consoleWarnSpy?.mockRestore();
      consoleErrorSpy?.mockRestore();
    });

    test('does not throw an error when a safe javascript: URL is passed', () => {
      const element = renderTabs(<Tabs tabs={[{ id: 'test', label: 'test', href: 'javascript:void(0)' }]} />).wrapper;
      expect((element.findTabLinkByIndex(1)!.getElement() as HTMLAnchorElement).href).toBe('javascript:void(0)');
    });

    test('throws an error when a dangerous javascript: URL is passed', () => {
      expect(() =>
        renderTabs(<Tabs tabs={[{ id: 'test', label: 'test', href: "javascript:alert('Hello!')" }]} />)
      ).toThrow('A javascript: URL was blocked as a security precaution.');
    });
  });

  describe('Dismissible', () => {
    test('scalls requestAnimationFrame for focus updates', () => {
      const time = 0;
      const requestAnimationFrameSpy: jest.SpyInstance<number> = jest
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation(callback => {
          callback(time);
          return time;
        });

      const wrapper = renderTabs(<Tabs tabs={actionDismissibleTabs} activeTabId="fourth" />).wrapper;
      wrapper.findActiveTab()!.getElement().focus();
      pressRight(wrapper);

      expect(requestAnimationFrameSpy).not.toHaveBeenCalledTimes(0);
      requestAnimationFrameSpy.mockRestore();
    });

    test('renders the correct dismiss label', () => {
      const dismissibleButton = renderTabs(
        <Tabs tabs={actionDismissibleTabs} />
      ).wrapper.findDismissibleButtonByTabIndex(1);
      expect(dismissibleButton).toBeTruthy();
      expect(dismissibleButton?.getElement()).toHaveAttribute('aria-label', 'first-tab-dismissible-button');
    });

    test('does not render the dismiss button when dismissible false', () => {
      const dismissibleButtonWrapper = renderTabs(<Tabs tabs={actionDismissibleTabs} />).wrapper;
      const dismissibleButtonId = dismissibleButtonWrapper.findDismissibleButtonByTabId('second');
      expect(dismissibleButtonId).toBeFalsy();
    });

    test('renders correct dismissible button based on activeTabId', () => {
      const wrapper = renderTabs(<Tabs tabs={actionDismissibleTabs} activeTabId="first" />).wrapper;
      const currentDismissibleButton = wrapper.findDismissibleButtonByTabId('first');
      const activeDismissibleButton = wrapper.findActiveTabDismissibleButton();
      expect(activeDismissibleButton).toEqual(currentDismissibleButton);
    });

    test('calls onDismiss event', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const dismissibleButton = renderTabs(
        <Tabs tabs={actionDismissibleTabs} activeTabId="first" />
      ).wrapper.findDismissibleButtonByTabId('first');
      dismissibleButton?.click();
      expect(consoleSpy).toHaveBeenCalledWith('I have been called!');
      consoleSpy.mockClear();
    });

    test('skips dismissible on right and left arrow key press', () => {
      const wrapper = renderTabs(<Tabs tabs={actionDismissibleTabs} activeTabId="fourth" />).wrapper;
      wrapper.findActiveTab()!.getElement().focus();
      pressRight(wrapper);
      expect(wrapper.findTabLinkByIndex(6)?.getElement()).toHaveFocus();
      pressLeft(wrapper);
      expect(wrapper.findTabLinkByIndex(4)?.getElement()).toHaveFocus();
    });

    test('moves focus from any non-active dismissible button to active tab content', () => {
      const wrapper = renderTabs(<Tabs tabs={actionDismissibleTabs} activeTabId="fourth" />).wrapper;
      wrapper.findActiveTab()!.getElement().focus();
      pressLeft(wrapper);
      wrapper.findActiveTab()!.keydown({ keyCode: KeyCode.tab });
      expect(wrapper.findTabContent()?.getElement()).toHaveFocus();
    });
  });

  describe('Dismissible mixed with non-dismissible', () => {
    test('moves focus from the last dismissible button to non-dismissible', () => {
      const TabsWrapper = () => {
        const [tabsDismissibles, setTabDismissibles] = useState([
          {
            label: 'First tab',
            id: 'first',
            content: <>first</>,
          },
          {
            label: 'Second tab',
            id: 'second',
            dismissible: true,
            dismissLabel: 'Dismiss second tab (dismissibles variant)',
            onDismiss: () => setTabDismissibles(prevTabs => prevTabs.slice(0, 1)),
            content: <>second</>,
          },
        ]);

        return <Tabs tabs={tabsDismissibles} />;
      };
      const { wrapper } = renderTabs(<TabsWrapper />);

      wrapper.findDismissibleButtonByTabId('second')!.click();

      expect(wrapper.findTabLinkById('first')!.getElement()).toHaveFocus();
    });
  });

  describe('Actions', () => {
    test('renders action', () => {
      const actionButton = renderTabs(<Tabs tabs={actionDismissibleTabs} />).wrapper.findActionByTabIndex(2);
      expect(actionButton).toBeTruthy();
      expect(actionButton?.getElement().firstElementChild?.id).toBe('second-tab-button');
    });

    test('does not render action when no action provided', () => {
      const actionButton = renderTabs(<Tabs tabs={actionDismissibleTabs} />).wrapper.findActionByTabId('fourth');
      expect(actionButton).toBeFalsy();
    });

    test('renders correct action based on activeTabId', () => {
      const wrapper = renderTabs(<Tabs tabs={actionDismissibleTabs} activeTabId="third" />).wrapper;
      const correctActionButton = wrapper.findActionByTabId('third');
      const activeActionButton = wrapper.findActiveTabAction();
      expect(activeActionButton).toEqual(correctActionButton);
    });

    test('moves focus from action to active tab content', () => {
      const wrapper = renderTabs(<Tabs tabs={actionDismissibleTabs} activeTabId="third" />).wrapper;
      wrapper.findActiveTab()!.getElement().focus();
      pressRight(wrapper);
      wrapper.findActiveTab()!.keydown({ keyCode: KeyCode.tab });
      expect(wrapper.findTabContent()?.getElement()).toHaveFocus();
    });
  });

  describe('Tab header', () => {
    test('keeps the ids of the tab links unchanged across re-renders', () => {
      const firstTabId = defaultTabs[0].id;
      const secondTabId = defaultTabs[1].id;
      const { wrapper, rerender } = renderTabs(
        <Tabs tabs={defaultTabs} activeTabId={firstTabId} onChange={() => void 0} />
      );
      const getFirstTabLinkElementId = () => wrapper.findTabLinkById(firstTabId)!.getElement()!.id;
      const firstTabLinkElementId = getFirstTabLinkElementId();
      expect(firstTabLinkElementId).toBeTruthy();
      rerender(<Tabs tabs={defaultTabs} activeTabId={secondTabId} onChange={() => void 0} />);
      expect(getFirstTabLinkElementId()).toEqual(firstTabLinkElementId);
    });

    describe('Scroll buttons', () => {
      let wrapper: TabsWrapper;

      beforeEach(() => {
        mockHorizontalOverflow = true;
        ({ wrapper } = renderTabs(
          <Tabs
            tabs={defaultTabs}
            i18nStrings={{ scrollLeftAriaLabel: 'Scroll left', scrollRightAriaLabel: 'Scroll right' }}
          />
        ));
      });

      afterEach(() => {
        mockHorizontalOverflow = false;
      });

      const getScrollButtons = () => {
        const buttons = wrapper.findAll('button');
        const scrollLeftButton = buttons[0];
        const scrollRightButton = buttons[buttons.length - 1];
        return { scrollLeftButton, scrollRightButton };
      };

      it('have aria-label attribute', () => {
        const { scrollLeftButton, scrollRightButton } = getScrollButtons();
        expect(scrollLeftButton.getElement()).toHaveAttribute('aria-label', 'Scroll left');
        expect(scrollRightButton.getElement()).toHaveAttribute('aria-label', 'Scroll right');
      });

      it('do not have aria-hidden attribute', () => {
        const { scrollLeftButton, scrollRightButton } = getScrollButtons();
        expect(scrollLeftButton.getElement()).not.toHaveAttribute('aria-hidden');
        expect(scrollRightButton.getElement()).not.toHaveAttribute('aria-hidden');
      });

      describe('i18n', () => {
        it('supports rendering scrollLeftAriaLabel and scrollRightAriaLabel through i18n provider', () => {
          ({ wrapper } = renderTabs(
            <TestI18nProvider
              messages={{
                tabs: {
                  'i18nStrings.scrollLeftAriaLabel': 'Custom scroll left',
                  'i18nStrings.scrollRightAriaLabel': 'Custom scroll right',
                },
              }}
            >
              <Tabs tabs={defaultTabs} />
            </TestI18nProvider>
          ));
          const { scrollLeftButton, scrollRightButton } = getScrollButtons();
          expect(scrollLeftButton.getElement()).toHaveAttribute('aria-label', 'Custom scroll left');
          expect(scrollRightButton.getElement()).toHaveAttribute('aria-label', 'Custom scroll right');
        });
      });
    });

    describe('Disabled with reason', () => {
      test('has no tooltip open by default', () => {
        const firstTabId = defaultTabs[0].id;
        const { wrapper } = renderTabs(
          <Tabs
            tabs={defaultTabs.map(item => {
              if (item.id === 'second') {
                return {
                  ...item,
                  disabled: true,
                  disabledReason: 'disabled reason',
                };
              }

              return item;
            })}
            activeTabId={firstTabId}
            onChange={() => void 0}
          />
        );

        expect(wrapper.findTabLinkById('second')!.findDisabledReason()).toBe(null);
      });

      test('has no tooltip without disabledReason', () => {
        const firstTabId = defaultTabs[0].id;
        const { wrapper } = renderTabs(
          <Tabs
            tabs={defaultTabs.map(item => {
              if (item.id === 'second') {
                return {
                  ...item,
                  disabled: true,
                };
              }

              return item;
            })}
            activeTabId={firstTabId}
            onChange={() => void 0}
          />
        );

        wrapper.findTabLinkById('second')!.focus();

        expect(wrapper.findTabLinkById('second')!.findDisabledReason()).toBe(null);
      });

      test('open tooltip on focus', () => {
        const firstTabId = defaultTabs[0].id;
        const { wrapper } = renderTabs(
          <Tabs
            tabs={defaultTabs.map(item => {
              if (item.id === 'second') {
                return {
                  ...item,
                  disabled: true,
                  disabledReason: 'disabled reason',
                };
              }

              return item;
            })}
            activeTabId={firstTabId}
            onChange={() => void 0}
          />
        );

        wrapper.findTabLinkById('second')!.focus();

        expect(wrapper.findTabLinkById('second')!.findDisabledReason()!.getElement()).toHaveTextContent(
          'disabled reason'
        );
      });

      test('closes tooltip on blur', () => {
        const firstTabId = defaultTabs[0].id;
        const { wrapper } = renderTabs(
          <Tabs
            tabs={defaultTabs.map(item => {
              if (item.id === 'second') {
                return {
                  ...item,
                  disabled: true,
                  disabledReason: 'disabled reason',
                };
              }

              return item;
            })}
            activeTabId={firstTabId}
            onChange={() => void 0}
          />
        );

        wrapper.findTabLinkById('second')!.focus();

        expect(wrapper.findTabLinkById('second')!.findDisabledReason()!.getElement()).toHaveTextContent(
          'disabled reason'
        );

        wrapper.findTabLinkById('second')!.blur();

        expect(wrapper.findTabLinkById('second')!.findDisabledReason()).toBe(null);
      });

      test('open tooltip on mouseenter', () => {
        const firstTabId = defaultTabs[0].id;
        const { wrapper } = renderTabs(
          <Tabs
            tabs={defaultTabs.map(item => {
              if (item.id === 'second') {
                return {
                  ...item,
                  disabled: true,
                  disabledReason: 'disabled reason',
                };
              }

              return item;
            })}
            activeTabId={firstTabId}
            onChange={() => void 0}
          />
        );

        fireEvent.mouseEnter(wrapper.findTabLinkById('second')!.getElement());

        expect(wrapper.findTabLinkById('second')!.findDisabledReason()!.getElement()).toHaveTextContent(
          'disabled reason'
        );
      });

      test('close tooltip on mouseleave', () => {
        const firstTabId = defaultTabs[0].id;
        const { wrapper } = renderTabs(
          <Tabs
            tabs={defaultTabs.map(item => {
              if (item.id === 'second') {
                return {
                  ...item,
                  disabled: true,
                  disabledReason: 'disabled reason',
                };
              }

              return item;
            })}
            activeTabId={firstTabId}
            onChange={() => void 0}
          />
        );

        fireEvent.mouseEnter(wrapper.findTabLinkById('second')!.getElement());

        expect(wrapper.findTabLinkById('second')!.findDisabledReason()!.getElement()).toHaveTextContent(
          'disabled reason'
        );

        fireEvent.mouseLeave(wrapper.findTabLinkById('second')!.getElement());

        expect(wrapper.findTabLinkById('second')!.findDisabledReason()).toBe(null);
      });

      test('close tooltip on Esc keydown', () => {
        const firstTabId = defaultTabs[0].id;
        const { wrapper } = renderTabs(
          <Tabs
            tabs={defaultTabs.map(item => {
              if (item.id === 'second') {
                return {
                  ...item,
                  disabled: true,
                  disabledReason: 'disabled reason',
                };
              }

              return item;
            })}
            activeTabId={firstTabId}
            onChange={() => void 0}
          />
        );

        fireEvent.mouseEnter(wrapper.findTabLinkById('second')!.getElement());

        expect(wrapper.findTabLinkById('second')!.findDisabledReason()!.getElement()).toHaveTextContent(
          'disabled reason'
        );

        fireEvent.keyDown(window, { key: 'Escape' });

        expect(wrapper.findTabLinkById('second')!.findDisabledReason()).toBe(null);
      });

      test('has no aria-describedby by default', () => {
        const firstTabId = defaultTabs[0].id;
        const { wrapper } = renderTabs(<Tabs tabs={defaultTabs} activeTabId={firstTabId} onChange={() => void 0} />);

        expect(wrapper.findTabLinkById('second')!.getElement()).not.toHaveAttribute('aria-describedby');
      });

      test('has no aria-describedby without disabledReason', () => {
        const firstTabId = defaultTabs[0].id;
        const { wrapper } = renderTabs(
          <Tabs
            tabs={defaultTabs.map(item => {
              if (item.id === 'second') {
                return {
                  ...item,
                  disabled: true,
                };
              }

              return item;
            })}
            activeTabId={firstTabId}
            onChange={() => void 0}
          />
        );

        expect(wrapper.findTabLinkById('second')!.getElement()).not.toHaveAttribute('aria-describedby');
      });

      test('has disabledReason a11y attributes', () => {
        const firstTabId = defaultTabs[0].id;
        const { wrapper } = renderTabs(
          <Tabs
            tabs={defaultTabs.map(item => {
              if (item.id === 'second') {
                return {
                  ...item,
                  disabled: true,
                  disabledReason: 'disabled reason',
                };
              }

              return item;
            })}
            activeTabId={firstTabId}
            onChange={() => void 0}
          />
        );

        expect(wrapper.findTabLinkById('second')!.getElement()).toHaveAttribute('aria-describedby');
        const describedBy = wrapper.findTabLinkById('second')!.getElement().getAttribute('aria-describedby');
        expect(wrapper.findTabLinkById('second')!.find(`[id="${describedBy}"]`)!.getElement()).toHaveTextContent(
          'disabled reason'
        );
      });

      test('shows active tab content when disabled with reason tab is focused', () => {
        const { wrapper } = renderTabs(
          <Tabs
            tabs={defaultTabs.map(item => {
              if (item.id === 'second') {
                return {
                  ...item,
                  disabled: true,
                  disabledReason: 'disabled reason',
                };
              }

              return item;
            })}
          />
        );

        pressHome(wrapper);
        pressRight(wrapper);

        expect(wrapper.findActiveTab()!.getElement()).toHaveTextContent('First tab');
        expect(wrapper.findTabContent()!.getElement()).toHaveTextContent('First content');
        expect(wrapper.findFocusedTab()!.getElement()).toHaveTextContent('Second tab');
      });
    });
  });

  describe('Tab content', () => {
    test('has tabindex attribute', () => {
      const tabs = renderTabs(<Tabs tabs={defaultTabs} />).wrapper;
      expect(tabs.findTabContent()!.getElement()).toHaveAttribute('tabindex', '0');
    });

    test('has tabindex attribute even for empty tab content', () => {
      const tabs = renderTabs(<Tabs tabs={defaultTabs} activeTabId={'fourth'} onChange={() => void 0} />).wrapper;
      expect(tabs.findTabContent()!.getElement()).toHaveAttribute('tabindex', '0');
    });

    test('has aria-labelledby attribute set to the id of the corresponding tab', () => {
      const activeTabId = defaultTabs[0].id;
      const tabs = renderTabs(<Tabs tabs={defaultTabs} activeTabId={activeTabId} onChange={() => void 0} />).wrapper;
      const firstTabLink = tabs.findTabLinkById(activeTabId)!.getElement()!;
      const tabLinkElementId = firstTabLink.id;
      expect(tabLinkElementId).toBeTruthy();
      expect(tabs.findTabContent()!.getElement()).toHaveAttribute('aria-labelledby', tabLinkElementId);
    });

    test('renders tab header content', () => {
      const wrapper = renderTabs(<Tabs tabs={defaultTabs} activeTabId="third" />).wrapper;
      const tabHeaderContent = wrapper.findTabHeaderContentByIndex(3);
      expect(tabHeaderContent).toBeTruthy();
    });

    test('changes aria-labelledby attribute accordingly when the active tab changes', () => {
      const firstTabId = defaultTabs[0].id;
      const secondTabId = defaultTabs[1].id;

      const { wrapper, rerender } = renderTabs(
        <Tabs tabs={defaultTabs} activeTabId={firstTabId} onChange={() => void 0} />
      );

      const verifyTabContentLabelledBy = (tabId: string) => {
        const tabLink = wrapper.findTabLinkById(tabId)!.getElement()!;
        const tabLinkElementId = tabLink.id;
        expect(tabLinkElementId).toBeTruthy();
        expect(wrapper.findTabContent()!.getElement()).toHaveAttribute('aria-labelledby', tabLinkElementId);
      };

      verifyTabContentLabelledBy(firstTabId);
      rerender(<Tabs tabs={defaultTabs} activeTabId={secondTabId} onChange={() => void 0} />);
      verifyTabContentLabelledBy(secondTabId);
    });
  });
  test('renders actions', () => {
    const wrapper = renderTabs(<Tabs tabs={defaultTabs} actions={<div>Actions content</div>} />).wrapper;
    expect(wrapper.findActions()!.getElement()).toHaveTextContent('Actions content');
  });
});
