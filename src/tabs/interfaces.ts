// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonProps } from '../button/interfaces';
import { ContainerProps } from '../container/interfaces';
import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';
import { FocusRingStyle } from '../types/utils';

export interface TabsProps extends BaseComponentProps {
  /**
   * Specifies the tabs to display. Each tab object has the following properties:
   *
   * - `id` (string) - The tab identifier. This value needs to be passed to the Tabs component as `activeTabId` to select this tab.
   * - `label` (ReactNode) - Tab label shown in the UI.
   * - `content` (ReactNode) - (Optional) Tab content to render in the container.
   * - `disabled` (boolean) - (Optional) Specifies if this tab is disabled.
   * - `disabledReason` (string) - (Optional) Displays tooltip near the tab when disabled. Use to provide additional context.
   * - `dismissible` (boolean) - (Optional) Determines whether the tab includes a dismiss icon button. By default, the dismiss button is not included.
   * - `dismissLabel` (boolean) - (Optional) Specifies an aria-label for the dismiss icon button.
   * - `dismissDisabled` (boolean) - (Optional) Determines whether the dismiss button is disabled.
   * - `action` (ReactNode) - (Optional) Action for the tab, rendered next to its corresponding label.
   *    Although it is technically possible to insert any content, our UX guidelines only allow you to add
   *    an icon button or icon button dropdown.
   * - `onDismiss` (ButtonProps['onClick']) - (Optional) Called when a user clicks on the dismiss button.
   * - `href` (string) - (Optional) You can use this parameter to change the default `href` of the internal tab anchor. The
   *    `click` event default behavior is prevented, unless the user clicks the tab with a key modifier (that is, CTRL,
   *    ALT, SHIFT, META). This enables the user to open new browser tabs with an initially selected component tab,
   *    if your application routing can handle such deep links. You can manually update routing on the current page
   *    using the `activeTabHref` property of the `change` event's detail.
   * - `contentRenderStrategy` (string) - (Optional) Determines when tab content is rendered:
       - `'active'`: (Default) Only render content when the tab is active.
   *   - `'eager'`: Always render tab content (hidden when the tab is not active).
   *   - `'lazy'`: Like 'eager', but content is only rendered after the tab is first activated.
   */
  tabs: ReadonlyArray<TabsProps.Tab>;

  /**
   * Actions for the tabs header, displayed next to the list of tabs.
   * Use this to add a button or button dropdown that performs actions on the
   * entire tab list. We recommend a maximum of one interactive element to
   * minimize the number of keyboard tab stops between the tab list and content.
   */
  actions?: React.ReactNode;

  /**
   * The possible visual variants of tabs are the following:
   * * `default` - Use in any context.
   * * `container` - Use this variant to have the tabs displayed within a container header.
   * * `stacked` - Use this variant directly adjacent to other stacked containers (such as a container, table).
   * @visualrefresh `stacked` variant
   */
  variant?: TabsProps.Variant;

  /**
   * Called whenever the user selects a different tab.
   * The event's `detail` contains the new `activeTabId`.
   */
  onChange?: NonCancelableEventHandler<TabsProps.ChangeDetail>;

  /**
   * The `id` of the currently active tab.
   * * If you don't set this property, the component activates the first tab and switches tabs automatically when a tab header is clicked (that is, uncontrolled behavior).
   * * If you explicitly set this property, you must set define an `onChange` handler to update the property when a tab header is clicked (that is, controlled behavior).
   */
  activeTabId?: string;

  /**
   * Provides an `aria-label` to the tab container.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabel?: string;

  /**
   * Sets the `aria-labelledby` property on the tab container.
   * If there's a visible label element that you can reference, use this instead of `ariaLabel`.
   * Don't use `ariaLabel` and `ariaLabelledby` at the same time.
   */
  ariaLabelledby?: string;

  /**
   * Determines whether the tab content has padding. If `true`, removes the default padding from the tab content area.
   */
  disableContentPaddings?: boolean;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: TabsProps.I18nStrings;
  /**
   * Enabling this property makes the tab content fit to the available height.
   * If the tab content is too short, it will stretch. If the tab content is too long, a vertical scrollbar will be shown.
   */
  fitHeight?: boolean;
  /**
   * Determines how the active tab is switched when navigating using
   * the keyboard. The options are:
   * - 'automatic' (default): the active tab is switched using the arrow keys.
   * - 'manual': a tab must be explicitly activated using the enter/space key.
   * We recommend using 'automatic' in most situations to provide consistent
   * and quick switching between tabs. Use 'manual' only if there is a specific
   * need to introduce friction to the switching of tabs.
   */
  keyboardActivationMode?: 'automatic' | 'manual';

  /**
   * An object containing CSS properties to customize the tabs' visual appearance.
   * Refer to the [style](/components/tabs/?tabId=style) tab for more details.
   * @awsuiSystem core
   */
  style?: TabsProps.Style;

  /**
   * When set to `true`, the tabs become reorderable via drag-and-drop or keyboard.
   * The component keeps `role="application"` (as with `action`/`dismissible`) and
   * a leading drag handle is rendered on each tab that is not pinned via `disableReorder`.
   * Reordering is controlled: emit `onReorder` to update the `tabs` order in your state.
   */
  reorderable?: boolean;

  /**
   * Called when the user reorders tabs via drag-and-drop or the keyboard.
   * The event `detail` contains the new order as `tabIds`. When `reorderable` is `true`
   * the consumer MUST use this callback to update the `tabs` prop; otherwise the order
   * will not change.
   */
  onReorder?: NonCancelableEventHandler<TabsProps.ReorderDetail>;

  /**
   * When `true`, a trailing "+" (add-tab) button is rendered inside the tab header,
   * after the tab list and before the right scroll button. It sits outside the roving
   * tab order and is reachable via the Tab key. Provide `onAddTab` to handle clicks
   * and `i18nStrings.addTabAriaLabel` for its accessible name.
   */
  addTabButton?: boolean;

  /**
   * Called when the user activates the add-tab button (mouse click, Enter, or Space).
   */
  onAddTab?: NonCancelableEventHandler<TabsProps.AddTabDetail>;

  /**
   * Opts this Tabs instance into cross-list reordering. When two or more `reorderable`
   * Tabs instances share the same non-empty `reorderGroup` value, tabs can be dragged
   * (pointer or keyboard) from one instance into another — no wrapper or provider is
   * needed. Has no effect unless the instance is also `reorderable`.
   */
  reorderGroup?: string;

  /**
   * Called when a tab is moved from one list to another within the same reorder group.
   * The event `detail` (`TabMoveDetail`) identifies the moved tab, the source and target
   * instances, the target insertion index, and the resulting id order of both lists.
   * This is a controlled event: the consumer MUST update BOTH lists' `tabs` arrays in
   * response (remove from source, insert into target). Fires on both instances involved.
   */
  onTabMove?: NonCancelableEventHandler<TabsProps.TabMoveDetail>;
}
export namespace TabsProps {
  export type Variant = 'default' | 'container' | 'stacked';

  export interface Tab {
    /**
     * The tab id. This value will be need to be passed to the Tabs component as `activeTabId` to select this tab.
     */
    id: string;
    /**
     * Tab label shown in the UI.
     */
    label: React.ReactNode;
    /**
     * Tab content to render in the container.
     */
    content?: React.ReactNode;
    /**
     * Whether this tab is disabled.
     */
    disabled?: boolean;
    /**
     * Provides a reason why this tab is disabled.
     */
    disabledReason?: string;
    /**
     * (Optional) Determines whether the tab includes a dismiss icon button. By default, the dismiss button is not included.
     * When a user clicks on this button the onDismiss handler is called.
     */
    dismissible?: boolean;
    /**
     * (Optional) Specifies an aria-label for the dismiss icon button.
     */
    dismissLabel?: string;
    /**
     * (Optional) Determines whether the dismiss button is disabled.
     */
    dismissDisabled?: boolean;
    /**
     * (Optional) Action for the tab, rendered next to its corresponding label.
     * Although it is technically possible to insert any content, our UX guidelines only allow you to add
     * an icon button or icon button dropdown.
     */
    action?: React.ReactNode;
    /**
     * (event => void) Called when a user clicks on the dismiss button.
     */
    onDismiss?: ButtonProps['onClick'];
    /**
     * You can use this parameter to change the default `href` of the internal tab anchor. The
     * `click` event default behavior is prevented, unless the user clicks the tab with a key modifier (CTRL,
     * ALT, SHIFT, META). This allows to open new browser tabs with an initially selected component tab,
     * when the routing can handle such deep links. You can manually update routing on the current page
     * using the `activeTabHref` property of the `change` event's detail.
     */
    href?: string;
    /**
     * Determines when tab content is rendered:
     * - 'active' (default): Only render content when the tab is active.
     * - 'eager': Always render tab content (hidden when the tab is not active).
     * - 'lazy': Like 'eager', but content is only rendered after the tab is first activated.
     */
    contentRenderStrategy?: 'active' | 'eager' | 'lazy';
    /**
     * (Optional) When Tabs is `reorderable`, marks this tab as pinned:
     * it has no drag handle, cannot be picked up for reorder, and is not a valid
     * drop slot (its position is locked). Composes independently with `dismissible` and `action`.
     * Has no effect when `reorderable` is not set on the parent.
     */
    disableReorder?: boolean;
  }

  export interface ReorderDetail {
    /**
     * The new order of tab ids after the reorder was committed.
     */
    tabIds: string[];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface AddTabDetail {}

  export interface TabMoveDetail {
    /**
     * The id of the tab that was moved.
     */
    tabId: string;
    /**
     * The `id` of the source Tabs instance the tab was moved out of.
     * This is the Tabs instance's own component id (its `BaseComponentProps` id / analytics id).
     */
    sourceGroupTabsId: string;
    /**
     * The `id` of the target Tabs instance the tab was moved into.
     */
    targetGroupTabsId: string;
    /**
     * The index at which the moved tab should be inserted into the target list
     * (respecting any pinned/`disableReorder` tabs in the target).
     */
    targetIndex: number;
    /**
     * The resulting id order of the SOURCE list after removing the moved tab.
     */
    sourceTabIds: string[];
    /**
     * The resulting id order of the TARGET list after inserting the moved tab.
     */
    targetTabIds: string[];
  }

  export interface ChangeDetail {
    /**
     * The ID of the clicked tab.
     */
    activeTabId: string;
    /**
     * The `href` attribute of the clicked tab, if defined.
     */
    activeTabHref?: string;
  }

  export interface I18nStrings {
    /**
     * ARIA label for the scroll left button that appears when the tab header is wider than the container.
     */
    scrollLeftAriaLabel?: string;
    /**
     * ARIA label for the scroll right button that appears when the tab header is wider than the container.
     */
    scrollRightAriaLabel?: string;
    /**
     * ARIA role description for the Tabs component when an action, dismissible or reorderable prop is in use.
     * This is used with role="application" to provide further information on the purpose of this component.
     */
    tabsWithActionsAriaRoleDescription?: string;
    /**
     * ARIA label for the drag handle rendered on each reorderable tab. Combined with the tab label.
     */
    reorderDragHandleAriaLabel?: string;
    /**
     * ARIA description for the drag handle. Use this to describe the keyboard model
     * (e.g. "Press Space to pick up, Arrow keys to move, Space to drop, Escape to cancel").
     */
    reorderDragHandleAriaDescription?: string;
    /**
     * Announced to screen readers when a tab is picked up for reorder.
     */
    liveAnnouncementReorderStarted?: (position: number, total: number) => string;
    /**
     * Announced while a tab is being moved during a reorder.
     */
    liveAnnouncementReorderMoved?: (from: number, to: number, total: number) => string;
    /**
     * Announced when the user commits a reorder.
     */
    liveAnnouncementReorderCommitted?: (from: number, to: number, total: number) => string;
    /**
     * Announced when the user cancels a reorder (e.g. via Escape).
     */
    liveAnnouncementReorderDiscarded?: string;
    /**
     * Announced when a tab is moved across lists (cross-list reorder).
     * Receives the moved tab's target position, the total count in the target list,
     * and both source and target list labels are the app's responsibility to convey
     * via the provided numbers.
     */
    liveAnnouncementTabMovedAcrossLists?: (targetPosition: number, targetTotal: number) => string;
    /**
     * ARIA label for the add-tab ("+") button rendered when `addTabButton` is `true`.
     */
    addTabAriaLabel?: string;
  }

  export interface Style {
    container?: ContainerProps.Style;
    tab?: {
      backgroundColor?: {
        active?: string;
        default?: string;
        disabled?: string;
        hover?: string;
      };
      borderColor?: {
        active?: string;
        default?: string;
        disabled?: string;
        hover?: string;
      };
      borderRadius?: string;
      borderWidth?: string;
      color?: {
        active?: string;
        default?: string;
        disabled?: string;
        hover?: string;
      };
      fontSize?: string;
      fontWeight?: string;
      focusRing?: FocusRingStyle;
      paddingBlock?: string;
      paddingInline?: string;
      activeIndicator?: {
        color?: string;
        width?: string;
        borderRadius?: string;
      };
    };
    tabSeparator?: {
      color?: string;
      width?: string;
    };
  }
}
