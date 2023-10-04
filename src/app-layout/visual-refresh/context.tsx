// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  useRef,
  useState,
  useContext,
} from 'react';
import { applyDefaults } from '../defaults';
import { AppLayoutContext } from '../../internal/context/app-layout-context';
import { DynamicOverlapContext } from '../../internal/context/dynamic-overlap-context';
import { AppLayoutProps } from '../interfaces';
import { fireNonCancelableEvent } from '../../internal/events';
import { FocusControlRefs, useFocusControl } from '../utils/use-focus-control';
import { DrawerFocusControlRefs, useDrawerFocusControl } from '../utils/use-drawer-focus-control';
import { getSplitPanelDefaultSize } from '../../split-panel/utils/size-utils';
import { isDevelopment } from '../../internal/is-development';
import { getSplitPanelPosition } from './split-panel';
import { useControllable } from '../../internal/hooks/use-controllable';
import { SplitPanelFocusControlRefs, useSplitPanelFocusControl } from '../utils/use-split-panel-focus-control';
import { SplitPanelSideToggleProps } from '../../internal/context/split-panel-context';
import { useObservedElement } from '../utils/use-observed-element';
import { useMobile } from '../../internal/hooks/use-mobile';
import { DrawerItem, InternalDrawerProps } from '../drawer/interfaces';
import { useStableCallback, warnOnce } from '@cloudscape-design/component-toolkit/internal';
import useResize from '../utils/use-resize';
import styles from './styles.css.js';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import useBackgroundOverlap from './use-background-overlap';
import { useDrawers } from '../utils/use-drawers';
import { useUniqueId } from '../../internal/hooks/use-unique-id';

interface AppLayoutInternals extends AppLayoutProps {
  activeDrawerId: string | undefined;
  drawers: Array<DrawerItem> | null;
  drawersAriaLabel: string | undefined;
  drawersOverflowAriaLabel: string | undefined;
  drawersOverflowWithBadgeAriaLabel: string | undefined;
  drawersRefs: DrawerFocusControlRefs;
  drawerSize: number;
  drawersMaxWidth: number;
  drawerRef: React.Ref<HTMLElement>;
  resizeHandle: React.ReactElement;
  drawersTriggerCount: number;
  handleDrawersClick: (activeDrawerId: string | undefined, skipFocusControl?: boolean) => void;
  handleSplitPanelClick: () => void;
  handleNavigationClick: (isOpen: boolean) => void;
  handleSplitPanelPreferencesChange: (detail: AppLayoutProps.SplitPanelPreferences) => void;
  handleSplitPanelResize: (newSize: number) => void;
  handleToolsClick: (value: boolean, skipFocusControl?: boolean) => void;
  hasBackgroundOverlap: boolean;
  hasDefaultToolsWidth: boolean;
  hasDrawerViewportOverlay: boolean;
  hasNotificationsContent: boolean;
  hasOpenDrawer?: boolean;
  hasStickyBackground: boolean;
  isBackgroundOverlapDisabled: boolean;
  isMobile: boolean;
  isNavigationOpen: boolean;
  isSplitPanelForcedPosition: boolean;
  isSplitPanelOpen?: boolean;
  isToolsOpen: boolean;
  layoutElement: React.Ref<HTMLElement>;
  layoutWidth: number;
  loseToolsFocus: () => void;
  loseDrawersFocus: () => void;
  mainElement: React.Ref<HTMLDivElement>;
  mainOffsetLeft: number;
  navigationRefs: FocusControlRefs;
  notificationsElement: React.Ref<HTMLDivElement>;
  notificationsHeight: number;
  offsetBottom: number;
  setHasStickyBackground: (value: boolean) => void;
  setSplitPanelReportedSize: (value: number) => void;
  setSplitPanelReportedHeaderHeight: (value: number) => void;
  headerHeight: number;
  footerHeight: number;
  splitPanelControlId: string;
  splitPanelMaxWidth: number;
  splitPanelMinWidth: number;
  splitPanelPosition: AppLayoutProps.SplitPanelPosition;
  splitPanelReportedSize: number;
  splitPanelReportedHeaderHeight: number;
  splitPanelToggle: SplitPanelSideToggleProps;
  setSplitPanelToggle: (toggle: SplitPanelSideToggleProps) => void;
  splitPanelDisplayed: boolean;
  splitPanelRefs: SplitPanelFocusControlRefs;
  toolsControlId: string;
  toolsRefs: FocusControlRefs;
}

/**
 * The default values are destructured in the context instantiation to
 * prevent downstream Typescript errors. This could likely be replaced
 * by a context interface definition that extends the AppLayout interface.
 */
const AppLayoutInternalsContext = createContext<AppLayoutInternals | null>(null);

interface AppLayoutProviderInternalsProps extends AppLayoutProps {
  children: React.ReactNode;
}

export function useAppLayoutInternals() {
  const ctx = useContext(AppLayoutInternalsContext);
  if (!ctx) {
    throw new Error('Invariant violation: this context is only available inside app layout');
  }
  return ctx;
}

export const AppLayoutInternalsProvider = React.forwardRef(
  (
    {
      toolsHide,
      toolsOpen: controlledToolsOpen,
      navigationHide,
      navigationOpen: controlledNavigationOpen,
      contentType = 'default',
      headerSelector = '#b #h',
      footerSelector = '#b #h',
      children,
      splitPanel,
      ...props
    }: AppLayoutProviderInternalsProps,
    forwardRef: React.Ref<AppLayoutProps.Ref>
  ) => {
    const isMobile = useMobile();

    if (isDevelopment) {
      if (controlledToolsOpen && toolsHide) {
        warnOnce(
          'AppLayout',
          `You have enabled both the \`toolsOpen\` prop and the \`toolsHide\` prop. This is not supported. Set \`toolsOpen\` to \`false\` when you set \`toolsHide\` to \`true\`.`
        );
      }
    }

    const [hasStickyBackground, setHasStickyBackground] = useState(false);

    /**
     * Set the default values for minimum and maximum content width.
     */
    const geckoMaxCssLength = ((1 << 30) - 1) / 60;
    const halfGeckoMaxCssLength = geckoMaxCssLength / 2;
    // CSS lengths in Gecko are limited to at most (1<<30)-1 app units (Gecko uses 60 as app unit).
    // Limit the maxContentWidth to the half of the upper boundary (≈4230^2) to be on the safe side.
    const maxContentWidth =
      props.maxContentWidth && props.maxContentWidth > halfGeckoMaxCssLength
        ? halfGeckoMaxCssLength
        : props.maxContentWidth ?? 0;
    const minContentWidth = props.minContentWidth ?? 280;

    /**
     * Determine the default state of the Navigation and Tools drawers.
     * Mobile viewports should be closed by default under all circumstances.
     * If the navigationOpen prop has been set then that should take precedence
     * over the contentType prop. Desktop viewports that do not have the
     * navigationOpen or contentType props set will use the default contentType.
     */
    const contentTypeDefaults = applyDefaults(contentType, { maxContentWidth, minContentWidth }, true);

    /**
     * The useControllable hook will set the default value and manage either
     * the controlled or uncontrolled state of the Navigation drawer. The logic
     * for determining the default state is colocated with the Navigation component.
     *
     * The callback that will be passed to the Navigation and MobileToolbar
     * components to handle the click events that will change the state
     * of the Navigation drawer. It will set the Navigation state with the
     * useControllable hook and also fire the onNavigationChange function to
     * emit the state change.
     */
    const [isNavigationOpen = false, setIsNavigationOpen] = useControllable(
      controlledNavigationOpen,
      props.onNavigationChange,
      isMobile ? false : contentTypeDefaults.navigationOpen,
      { componentName: 'AppLayout', controlledProp: 'navigationOpen', changeHandler: 'onNavigationChange' }
    );

    const { refs: navigationRefs, setFocus: focusNavButtons } = useFocusControl(isNavigationOpen);

    const handleNavigationClick = useStableCallback(function handleNavigationChange(isOpen: boolean) {
      setIsNavigationOpen(isOpen);
      focusNavButtons();
      fireNonCancelableEvent(props.onNavigationChange, { open: isOpen });
    });

    useEffect(() => {
      // Close navigation drawer on mobile so that the main content is visible
      if (isMobile) {
        handleNavigationClick(false);
      }
    }, [isMobile, handleNavigationClick]);

    /**
     * The useControllable hook will set the default value and manage either
     * the controlled or uncontrolled state of the Tools drawer. The logic
     * for determining the default state is colocated with the Tools component.
     *
     * The callback that will be passed to the Navigation and MobileToolbar
     * components to handle the click events that will change the state
     * of the Tools drawer. It will set the Tools state with the
     * useControllable hook and also fire the onToolsChange function to
     * emit the state change.
     */
    const toolsWidth = props.toolsWidth ?? 290;
    const hasDefaultToolsWidth = props.toolsWidth === undefined;

    const [isToolsOpen = false, setIsToolsOpen] = useControllable(
      controlledToolsOpen,
      props.onToolsChange,
      isMobile ? false : contentTypeDefaults.toolsOpen,
      { componentName: 'AppLayout', controlledProp: 'toolsOpen', changeHandler: 'onToolsChange' }
    );

    const {
      refs: toolsRefs,
      setFocus: focusToolsButtons,
      loseFocus: loseToolsFocus,
    } = useFocusControl(isToolsOpen, true);

    const handleToolsClick = useCallback(
      function handleToolsChange(isOpen: boolean, skipFocusControl?: boolean) {
        setIsToolsOpen(isOpen);
        !skipFocusControl && focusToolsButtons();
        fireNonCancelableEvent(props.onToolsChange, { open: isOpen });
      },
      [props.onToolsChange, setIsToolsOpen, focusToolsButtons]
    );

    /**
     * On mobile viewports the navigation and tools drawers are adjusted to a fixed position
     * that consumes 100% of the viewport height and width. The body content could potentially
     * be scrollable underneath the drawer. In order to prevent this a CSS class needs to be
     * added to the document body that sets overflow to hidden.
     */
    useEffect(
      function handleBodyScroll() {
        if (isMobile && (isNavigationOpen || isToolsOpen)) {
          document.body.classList.add(styles['block-body-scroll']);
        } else {
          document.body.classList.remove(styles['block-body-scroll']);
        }

        // Ensure the CSS class is removed from the body on side effect cleanup
        return function cleanup() {
          document.body.classList.remove(styles['block-body-scroll']);
        };
      },
      [isMobile, isNavigationOpen, isToolsOpen]
    );

    /**
     * Query the DOM for the header and footer elements based on the selectors provided
     * by the properties and pass the heights to the custom property definitions.
     */
    const headerHeight = useObservedElement(headerSelector);
    const footerHeight = useObservedElement(footerSelector);

    /**
     * Set the default values for the minimum and maximum Split Panel width when it is
     * in the side position. The useLayoutEffect will compute the available space in the
     * DOM for the Split Panel given the current state. The minimum and maximum
     * widths will potentially trigger a side effect that will put the Split Panel into
     * a forced position on the bottom.
     */
    const splitPanelMinWidth = 280;
    const [splitPanelMaxWidth, setSplitPanelMaxWidth] = useState(splitPanelMinWidth);

    /**
     * The useControllable hook will set the default value and manage either
     * the controlled or uncontrolled state of the Split Panel. By default
     * the Split Panel should always be closed on page load.
     *
     * The callback that will be passed to the SplitPanel component
     * to handle the click events that will change the state of the SplitPanel
     * to open or closed given the current state. It will set the isSplitPanelOpen
     * controlled state and fire the onSplitPanelToggle event.
     */
    const [isSplitPanelOpen, setIsSplitPanelOpen] = useControllable(
      props.splitPanelOpen,
      props.onSplitPanelToggle,
      false,
      { componentName: 'AppLayout', controlledProp: 'splitPanelOpen', changeHandler: 'onSplitPanelToggle' }
    );

    /**
     * The useControllable hook will manage the controlled or uncontrolled
     * state of the splitPanelPreferences. By default the splitPanelPreferences
     * is undefined. When set the object shape should have a single key to indicate
     * either bottom or side position.
     *
     * The callback that will handle changes to the splitPanelPreferences
     * object that will determine if the SplitPanel is rendered either on the
     * bottom of the viewport or within the Tools container.
     */
    const [splitPanelPreferences, setSplitPanelPreferences] = useControllable(
      props.splitPanelPreferences,
      props.onSplitPanelPreferencesChange,
      undefined,
      {
        componentName: 'AppLayout',
        controlledProp: 'splitPanelPreferences',
        changeHandler: 'onSplitPanelPreferencesChange',
      }
    );

    const { refs: splitPanelRefs, setLastInteraction: setSplitPanelLastInteraction } = useSplitPanelFocusControl([
      splitPanelPreferences,
      isSplitPanelOpen,
    ]);

    const handleSplitPanelClick = useCallback(
      function handleSplitPanelChange() {
        setIsSplitPanelOpen(!isSplitPanelOpen);
        setSplitPanelLastInteraction({ type: isSplitPanelOpen ? 'close' : 'open' });
        fireNonCancelableEvent(props.onSplitPanelToggle, { open: !isSplitPanelOpen });
      },
      [props.onSplitPanelToggle, isSplitPanelOpen, setIsSplitPanelOpen, setSplitPanelLastInteraction]
    );

    /**
     * The Split Panel will be in forced (bottom) position if the defined minimum width is
     * greater than the maximum width. In other words, the maximum width is the currently
     * available horizontal space based on all other components that are rendered. If the
     * minimum width exceeds this value then there is not enough horizontal space and we must
     * force it to the bottom position.
     */
    const [isSplitPanelForcedPosition, setSplitPanelForcedPosition] = useState(false);
    const splitPanelPosition = getSplitPanelPosition(isSplitPanelForcedPosition, splitPanelPreferences);

    useLayoutEffect(
      function handleSplitPanelForcePosition() {
        setSplitPanelForcedPosition(splitPanelMinWidth > splitPanelMaxWidth);
      },
      [splitPanelMaxWidth, splitPanelMinWidth]
    );

    /**
     * The useControllable hook will set the default size of the SplitPanel based
     * on the default position set in the splitPanelPreferences. The logic for the
     * default size is contained in the SplitPanel component. The splitPanelControlledSize
     * will be bound to the size property in the SplitPanel context for rendering.
     *
     * The callback that will be passed to the SplitPanel component
     * to handle the resize events that will change the size of the SplitPanel.
     * It will set the splitPanelControlledSize controlled state and fire the
     * onSplitPanelResize event.
     */
    const [splitPanelReportedSize, setSplitPanelReportedSize] = useState(0);
    const [splitPanelReportedHeaderHeight, setSplitPanelReportedHeaderHeight] = useState(0);
    const [splitPanelToggle, setSplitPanelToggle] = useState<SplitPanelSideToggleProps>({
      displayed: false,
      ariaLabel: undefined,
    });
    const splitPanelDisplayed = !!(splitPanelToggle.displayed || isSplitPanelOpen);
    const splitPanelControlId = useUniqueId('split-panel-');
    const toolsControlId = useUniqueId('tools-');

    const [splitPanelSize, setSplitPanelSize] = useControllable(
      props.splitPanelSize,
      props.onSplitPanelResize,
      getSplitPanelDefaultSize(splitPanelPosition),
      { componentName: 'AppLayout', controlledProp: 'splitPanelSize', changeHandler: 'onSplitPanelResize' }
    );

    const handleSplitPanelResize = useCallback(
      (size: number) => {
        setSplitPanelSize(size);
        fireNonCancelableEvent(props.onSplitPanelResize, { size });
      },
      [props.onSplitPanelResize, setSplitPanelSize]
    );

    const handleSplitPanelPreferencesChange = useCallback(
      function handleSplitPanelChange(detail: AppLayoutProps.SplitPanelPreferences) {
        setSplitPanelPreferences(detail);
        setSplitPanelLastInteraction({ type: 'position' });
        fireNonCancelableEvent(props.onSplitPanelPreferencesChange, detail);
      },
      [props.onSplitPanelPreferencesChange, setSplitPanelPreferences, setSplitPanelLastInteraction]
    );

    const {
      drawers,
      activeDrawer,
      activeDrawerId,
      onActiveDrawerChange,
      onActiveDrawerResize,
      activeDrawerSize,
      ...drawersProps
    } = useDrawers(props as InternalDrawerProps, {
      ariaLabels: props.ariaLabels,
      toolsHide,
      toolsOpen: isToolsOpen,
      tools: props.tools,
      toolsWidth,
      onToolsChange: props.onToolsChange,
    });

    const [drawersMaxWidth, setDrawersMaxWidth] = useState(toolsWidth);

    const {
      refs: drawersRefs,
      setFocus: focusDrawersButtons,
      loseFocus: loseDrawersFocus,
      setLastInteraction: setDrawerLastInteraction,
    } = useDrawerFocusControl([activeDrawerId, activeDrawer?.resizable], true, true);

    const drawerRef = useRef<HTMLDivElement>(null);
    const { resizeHandle, drawerSize } = useResize(drawerRef, {
      onActiveDrawerResize,
      activeDrawerSize,
      activeDrawer,
      drawersRefs,
      isToolsOpen,
      drawersMaxWidth,
    });

    const handleDrawersClick = (id: string | undefined, skipFocusControl?: boolean) => {
      const newActiveDrawerId = id !== activeDrawerId ? id : undefined;

      onActiveDrawerChange(newActiveDrawerId);

      !skipFocusControl && focusDrawersButtons();
      setDrawerLastInteraction({ type: activeDrawerId ? 'close' : 'open' });
    };

    let drawersTriggerCount = drawers ? drawers.length : !toolsHide ? 1 : 0;
    if (splitPanelDisplayed && splitPanelPosition === 'side') {
      drawersTriggerCount++;
    }
    const hasOpenDrawer =
      activeDrawerId !== undefined ||
      (!toolsHide && isToolsOpen) ||
      (splitPanelDisplayed && splitPanelPosition === 'side' && isSplitPanelOpen);
    const hasDrawerViewportOverlay =
      isMobile && (!!activeDrawerId || (!navigationHide && isNavigationOpen) || (!toolsHide && isToolsOpen));

    /**
     * The Layout element is not necessarily synonymous with the client
     * viewport width. There can be content in the horizontal viewport
     * that exists on either side of the AppLayout. This resize observer
     * will set the custom property of the Layout element width that
     * is used for various horizontal constraints such as the maximum
     * allowed width of the Tools container.
     *
     * The offsetLeft of the Main will return the distance that the
     * Main element has from the left edge of the Layout component.
     * The offsetLeft value can vary based on the presence and state
     * of the Navigation as well as content gaps in the grid definition.
     * This value is used to determine the max width constraint calculation
     * for the Tools container.
     */
    const [layoutContainerQuery, layoutElement] = useContainerQuery(rect => rect.contentBoxWidth);
    const layoutWidth = layoutContainerQuery ?? 0;

    const mainElement = useRef<HTMLDivElement>(null);
    const [mainOffsetLeft, setMainOffsetLeft] = useState(0);

    const { hasBackgroundOverlap, updateBackgroundOverlapHeight } = useBackgroundOverlap({
      contentHeader: props.contentHeader,
      disableContentHeaderOverlap: props.disableContentHeaderOverlap,
      layoutElement,
    });

    useLayoutEffect(
      function handleMainOffsetLeft() {
        setMainOffsetLeft(mainElement?.current?.offsetLeft ?? 0);
      },
      [layoutWidth, isNavigationOpen, isToolsOpen, splitPanelReportedSize]
    );

    /**
     * Because the notifications slot does not give us any direction insight into
     * what the state of the child content is we need to have a mechanism for
     * tracking the height of the notifications and whether or not it has content.
     * The height of the notifications is an integer that will be used as a custom
     * property on the Layout component to determine what the sticky offset should
     * be if there are sticky notifications. This could be any number including
     * zero based on how the child content renders. The hasNotificationsContent boolean
     * is simply centralizing the logic of the notifications height being > 0 such
     * that it is not repeated in various components (such as MobileToolbar) that need to
     * know if the notifications slot is empty.
     */
    const [notificationsContainerQuery, notificationsElement] = useContainerQuery(rect => rect.contentBoxHeight);
    const [notificationsHeight, setNotificationsHeight] = useState(0);
    const [hasNotificationsContent, setHasNotificationsContent] = useState(false);

    useEffect(
      function handleNotificationsContent() {
        setNotificationsHeight(notificationsContainerQuery ?? 0);
        setHasNotificationsContent(notificationsContainerQuery && notificationsContainerQuery > 0 ? true : false);
      },
      [notificationsContainerQuery]
    );

    /**
     * Determine the offsetBottom value based on the presence of a footer element and
     * the SplitPanel component. Ignore the SplitPanel if it is not in the bottom
     * position. Use the size property if it is open and the header height if it is closed.
     */
    let offsetBottom = footerHeight;

    if (splitPanelDisplayed && splitPanelPosition === 'bottom') {
      if (isSplitPanelOpen) {
        offsetBottom += splitPanelReportedSize;
      } else {
        offsetBottom += splitPanelReportedHeaderHeight;
      }
    }

    /**
     * Warning! This is a hack! In order to accurately calculate if there is adequate
     * horizontal space for the Split Panel to be in the side position we need two values
     * that are not available in JavaScript.
     *
     * The first is the the content gap on the right which is stored in a design token
     * and applied in the Layout CSS:
     *
     * $contentGapRight: #{awsui.$space-scaled-2x-xxxl};
     *
     * The second is the width of the element that has the circular buttons for the
     * Tools and Split Panel. This could be suppressed given the state of the Tools
     * drawer returning a zero value. It would, however, be rendered if the Split Panel
     * were to move into the side position. This is calculated in the Tools CSS and
     * the Trigger button CSS with design tokens:
     *
     * padding: awsui.$space-scaled-s awsui.$space-layout-toggle-padding;
     * width: awsui.$space-layout-toggle-diameter;
     *
     * These values will be defined below as static integers that are rough approximations
     * of their computed width when rendered in the DOM, but doubled to ensure adequate
     * spacing for the Split Panel to be in side position.
     */
    useLayoutEffect(
      function handleSplitPanelMaxWidth() {
        const contentGapRight = 80; // Approximately 40px when rendered but doubled for safety
        const toolsFormOffsetWidth = 160; // Approximately 80px when rendered but doubled for safety
        const toolsOffsetWidth = isToolsOpen ? toolsWidth : 0;
        const activeDrawerOffsetWidth = activeDrawerId ? drawerSize : 0;

        setSplitPanelMaxWidth(
          layoutWidth -
            mainOffsetLeft -
            minContentWidth -
            contentGapRight -
            toolsOffsetWidth -
            toolsFormOffsetWidth -
            activeDrawerOffsetWidth
        );

        setDrawersMaxWidth(layoutWidth - mainOffsetLeft - minContentWidth - contentGapRight - toolsFormOffsetWidth);
      },
      [
        activeDrawerId,
        drawerSize,
        isNavigationOpen,
        isToolsOpen,
        layoutWidth,
        mainOffsetLeft,
        minContentWidth,
        toolsWidth,
      ]
    );

    /**
     * The useImperativeHandle hook in conjunction with the forwardRef function
     * in the AppLayout component definition expose the following callable
     * functions to component consumers when they put a ref as a property on
     * their component implementation.
     */
    useImperativeHandle(
      forwardRef,
      function createImperativeHandle() {
        return {
          closeNavigationIfNecessary: function () {
            isMobile && handleNavigationClick(false);
          },
          openTools: function () {
            handleToolsClick(true);
          },
          focusToolsClose: () => focusToolsButtons(true),
          focusSplitPanel: () => splitPanelRefs.slider.current?.focus(),
        };
      },
      [isMobile, handleNavigationClick, handleToolsClick, focusToolsButtons, splitPanelRefs.slider]
    );

    return (
      <AppLayoutInternalsContext.Provider
        value={{
          ...props,
          activeDrawerId,
          contentType,
          drawers,
          drawersAriaLabel: drawersProps.ariaLabel,
          drawersOverflowAriaLabel: drawersProps.overflowAriaLabel,
          drawersOverflowWithBadgeAriaLabel: drawersProps.overflowWithBadgeAriaLabel,
          drawersRefs,
          drawersMaxWidth,
          drawerSize,
          drawerRef,
          resizeHandle,
          drawersTriggerCount,
          headerHeight,
          footerHeight,
          hasDefaultToolsWidth,
          hasDrawerViewportOverlay,
          handleDrawersClick,
          handleNavigationClick,
          handleSplitPanelClick,
          handleSplitPanelPreferencesChange,
          handleSplitPanelResize,
          handleToolsClick,
          hasBackgroundOverlap,
          hasNotificationsContent,
          hasOpenDrawer,
          hasStickyBackground,
          isBackgroundOverlapDisabled: props.disableContentHeaderOverlap || !hasBackgroundOverlap,
          isMobile,
          isNavigationOpen: isNavigationOpen ?? false,
          isSplitPanelForcedPosition,
          isSplitPanelOpen,
          isToolsOpen,
          layoutElement,
          layoutWidth,
          loseToolsFocus,
          loseDrawersFocus,
          mainElement,
          mainOffsetLeft,
          maxContentWidth,
          minContentWidth,
          navigationHide,
          navigationRefs,
          notificationsElement,
          notificationsHeight,
          offsetBottom,
          setHasStickyBackground,
          setSplitPanelReportedSize,
          setSplitPanelReportedHeaderHeight,
          splitPanel,
          splitPanelControlId,
          splitPanelDisplayed,
          splitPanelMaxWidth,
          splitPanelMinWidth,
          splitPanelPosition,
          splitPanelPreferences,
          splitPanelReportedSize,
          splitPanelReportedHeaderHeight,
          splitPanelSize,
          splitPanelToggle,
          setSplitPanelToggle,
          splitPanelRefs,
          toolsControlId,
          toolsHide,
          toolsOpen: isToolsOpen,
          toolsWidth,
          toolsRefs,
        }}
      >
        <AppLayoutContext.Provider
          value={{
            stickyOffsetBottom: offsetBottom,
            stickyOffsetTop: 0, // not used in this design. Sticky headers read a CSS-var instead
            setHasStickyBackground,
          }}
        >
          <DynamicOverlapContext.Provider value={updateBackgroundOverlapHeight}>
            {children}
          </DynamicOverlapContext.Provider>
        </AppLayoutContext.Provider>
      </AppLayoutInternalsContext.Provider>
    );
  }
);
