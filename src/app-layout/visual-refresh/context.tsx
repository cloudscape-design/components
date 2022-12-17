// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, {
  createContext,
  createRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { AppLayoutProps } from '../interfaces';
import { fireNonCancelableEvent } from '../../internal/events';
import { getSplitPanelPosition } from './split-panel';
import { useControllable } from '../../internal/hooks/use-controllable';
import { useMobile } from '../../internal/hooks/use-mobile';
import { useContainerQuery } from '../../internal/hooks/container-queries';
import { getSplitPanelDefaultSize } from '../../split-panel/utils/size-utils';
import styles from './styles.css.js';
import { isDevelopment } from '../../internal/is-development';
import { warnOnce } from '../../internal/logging';
import { applyDefaults } from '../defaults';
import { FocusControlState, useFocusControl } from '../utils/use-focus-control';
import { useObservedElement } from '../utils/use-observed-element';

interface AppLayoutContextProps extends AppLayoutProps {
  dynamicOverlapHeight: number;
  handleSplitPanelClick: () => void;
  handleNavigationClick: (isOpen: boolean) => void;
  handleSplitPanelPreferencesChange: (detail: AppLayoutProps.SplitPanelPreferences) => void;
  handleSplitPanelResize: (detail: { size: number }) => void;
  handleToolsClick: (value: boolean) => void;
  hasDefaultToolsWidth: boolean;
  hasNotificationsContent: boolean;
  hasStickyBackground: boolean;
  isAnyPanelOpen: boolean;
  isMobile: boolean;
  isNavigationOpen: boolean;
  isSplitPanelForcedPosition: boolean;
  isSplitPanelOpen?: boolean;
  isToolsOpen: boolean;
  layoutElement: React.Ref<HTMLElement>;
  layoutWidth: number;
  mainElement: React.Ref<HTMLDivElement>;
  mainOffsetLeft: number;
  notificationsElement: React.Ref<HTMLDivElement>;
  notificationsHeight: number;
  offsetBottom: number;
  setDynamicOverlapHeight: (value: number) => void;
  setHasStickyBackground: (value: boolean) => void;
  setIsNavigationOpen: (value: boolean) => void;
  setIsToolsOpen: (value: boolean) => void;
  setSplitPanelReportedSize: (value: number) => void;
  setSplitPanelReportedHeaderHeight: (value: number) => void;
  headerHeight: number;
  footerHeight: number;
  splitPanelMaxWidth: number;
  splitPanelMinWidth: number;
  splitPanelPosition: AppLayoutProps.SplitPanelPosition;
  splitPanelReportedSize: number;
  splitPanelReportedHeaderHeight: number;
  toolsFocusControl: FocusControlState;
}

// TODO simplify default params + typings
const defaults: AppLayoutContextProps = {
  breadcrumbs: null,
  content: null,
  contentHeader: null,
  contentType: 'default',
  disableBodyScroll: false,
  disableContentHeaderOverlap: false,
  disableContentPaddings: false,
  dynamicOverlapHeight: 0,
  headerHeight: 0,
  footerHeight: 0,
  handleNavigationClick: (value: boolean) => value,
  handleSplitPanelClick: () => {},
  handleSplitPanelPreferencesChange: () => {},
  handleSplitPanelResize: () => {},
  handleToolsClick: (value: boolean) => value,
  hasDefaultToolsWidth: true,
  hasNotificationsContent: false,
  hasStickyBackground: false,
  isAnyPanelOpen: false,
  isMobile: false,
  isNavigationOpen: false,
  isSplitPanelForcedPosition: false,
  isSplitPanelOpen: false,
  isToolsOpen: false,
  // TODO: these refs are currently only instantiated once globally
  layoutElement: createRef<HTMLElement>(),
  layoutWidth: 0,
  mainElement: createRef<HTMLDivElement>(),
  mainOffsetLeft: 0,
  maxContentWidth: 0,
  minContentWidth: 280,
  navigation: null,
  navigationHide: false,
  navigationOpen: false,
  notifications: null,
  notificationsElement: createRef<HTMLDivElement>(),
  notificationsHeight: 0,
  offsetBottom: 0,
  onNavigationChange: () => {},
  onSplitPanelResize: () => {},
  onSplitPanelToggle: () => {},
  onSplitPanelPreferencesChange: () => {},
  setDynamicOverlapHeight: (value: number) => void value,
  setHasStickyBackground: (value: boolean) => value,
  setIsNavigationOpen: (value: boolean) => value,
  setIsToolsOpen: (value: boolean) => value,
  setSplitPanelReportedSize: (value: number) => void value,
  setSplitPanelReportedHeaderHeight: (value: number) => void value,
  splitPanelMaxWidth: 280,
  splitPanelMinWidth: 280,
  splitPanelOpen: false,
  splitPanelPosition: 'bottom',
  splitPanelPreferences: { position: 'bottom' },
  splitPanelReportedSize: 0,
  splitPanelReportedHeaderHeight: 0,
  splitPanelSize: 0,
  stickyNotifications: false,
  tools: null,
  toolsFocusControl: {} as FocusControlState,
};

/**
 * The default values are destructured in the context instantiation to
 * prevent downstream Typescript errors. This could likely be replaced
 * by a context interface definition that extends the AppLayout interface.
 */
export const AppLayoutContext = createContext({ ...defaults });

type AppLayoutProviderProps = AppLayoutProps & {
  children: React.ReactNode;
};

export const AppLayoutProvider = React.forwardRef(
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
    }: AppLayoutProviderProps,
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

    /**
     * The overlap height has a default set in CSS but can also be dynamically overridden
     * for content types (such as Table and Wizard) that have variable size content in the overlap.
     * If a child component utilizes a sticky header the hasStickyBackground property will determine
     * if the background remains in the same vertical position.
     */
    const [dynamicOverlapHeight, setDynamicOverlapHeight] = useState(0);
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
     * The callback that will be passed to the Navigation and AppBar
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

    const handleNavigationClick = useCallback(
      function handleNavigationChange(isOpen: boolean) {
        setIsNavigationOpen(isOpen);
        fireNonCancelableEvent(props.onNavigationChange, { open: isOpen });
      },
      [props.onNavigationChange, setIsNavigationOpen]
    );

    /**
     * The useControllable hook will set the default value and manage either
     * the controlled or uncontrolled state of the Tools drawer. The logic
     * for determining the default state is colocated with the Tools component.
     *
     * The callback that will be passed to the Navigation and AppBar
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

    const toolsFocusControl = useFocusControl(isToolsOpen, true);

    const handleToolsClick = useCallback(
      function handleToolsChange(isOpen: boolean) {
        setIsToolsOpen(isOpen);
        fireNonCancelableEvent(props.onToolsChange, { open: isOpen });
      },
      [props.onToolsChange, setIsToolsOpen]
    );

    const navigationVisible = !navigationHide && isNavigationOpen;
    const toolsVisible = !toolsHide && isToolsOpen;
    const isAnyPanelOpen = navigationVisible || toolsVisible;

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
          focusToolsClose: toolsFocusControl.setFocus,
        };
      },
      [isMobile, handleNavigationClick, handleToolsClick, toolsFocusControl.setFocus]
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

    const handleSplitPanelClick = useCallback(
      function handleSplitPanelChange() {
        setIsSplitPanelOpen(!isSplitPanelOpen);
        fireNonCancelableEvent(props.onSplitPanelToggle, { open: !isSplitPanelOpen });
      },
      [props.onSplitPanelToggle, isSplitPanelOpen, setIsSplitPanelOpen]
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

    const [splitPanelSize, setSplitPanelSize] = useControllable(
      props.splitPanelSize,
      props.onSplitPanelResize,
      getSplitPanelDefaultSize(splitPanelPosition),
      { componentName: 'AppLayout', controlledProp: 'splitPanelSize', changeHandler: 'onSplitPanelResize' }
    );

    const handleSplitPanelResize = useCallback(
      function handleSplitPanelChange(detail: { size: number }) {
        setSplitPanelSize(detail.size);
        fireNonCancelableEvent(props.onSplitPanelResize, detail);
      },
      [props.onSplitPanelResize, setSplitPanelSize]
    );

    const handleSplitPanelPreferencesChange = useCallback(
      function handleSplitPanelChange(detail: AppLayoutProps.SplitPanelPreferences) {
        setSplitPanelPreferences(detail);
        fireNonCancelableEvent(props.onSplitPanelPreferencesChange, detail);
      },
      [props.onSplitPanelPreferencesChange, setSplitPanelPreferences]
    );

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
    const [layoutContainerQuery, layoutElement] = useContainerQuery(rect => rect.width);
    const layoutWidth = layoutContainerQuery ?? 0;

    const mainElement = useRef<HTMLDivElement>(null);
    const [mainOffsetLeft, setMainOffsetLeft] = useState(0);

    useLayoutEffect(
      function handleMainOffsetLeft() {
        setMainOffsetLeft(mainElement?.current?.offsetLeft ?? 0);
      },
      [layoutWidth, isNavigationOpen, isToolsOpen, splitPanelReportedSize]
    );

    useLayoutEffect(
      function handleSplitPanelMaxWidth() {
        /**
         * Warning! This is a hack! In order to accurately calculate if there is adequate
         * horizontal space for the Split Panel to be in the side position we need two values
         * that are not available in JavaScript.
         *
         * The first is the the content gap on the right which is stored in a design token
         * and applied in the Layout CSS:
         *
         *  $contentGapRight: #{awsui.$space-scaled-2x-xxxl};
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
        const contentGapRight = 80; // Approximately 40px when rendered but doubled for safety
        const toolsFormOffsetWidth = 160; // Approximately 80px when rendered but doubled for safety
        const toolsOffsetWidth = isToolsOpen ? toolsWidth : 0;

        setSplitPanelMaxWidth(
          layoutWidth - mainOffsetLeft - minContentWidth - contentGapRight - toolsOffsetWidth - toolsFormOffsetWidth
        );
      },
      [isNavigationOpen, isToolsOpen, layoutWidth, mainOffsetLeft, minContentWidth, toolsWidth]
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
     * that it is not repeated in various components (such as AppBar) that need to
     * know if the notifications slot is empty.
     */
    const [notificationsContainerQuery, notificationsElement] = useContainerQuery(rect => rect.height);
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
    if (splitPanel && splitPanelPosition === 'bottom') {
      if (isSplitPanelOpen) {
        offsetBottom += splitPanelReportedSize;
      } else {
        offsetBottom += splitPanelReportedHeaderHeight;
      }
    }

    return (
      <AppLayoutContext.Provider
        value={{
          ...defaults,
          ...props,
          contentType,
          dynamicOverlapHeight,
          headerHeight,
          footerHeight,
          hasDefaultToolsWidth,
          handleNavigationClick,
          handleSplitPanelClick,
          handleSplitPanelPreferencesChange,
          handleSplitPanelResize,
          handleToolsClick,
          hasNotificationsContent,
          hasStickyBackground,
          isAnyPanelOpen,
          isMobile,
          isNavigationOpen: isNavigationOpen ?? false,
          isSplitPanelForcedPosition,
          isSplitPanelOpen,
          isToolsOpen,
          layoutElement,
          layoutWidth,
          mainElement,
          mainOffsetLeft,
          maxContentWidth,
          minContentWidth,
          navigationHide,
          notificationsElement,
          notificationsHeight,
          offsetBottom,
          setDynamicOverlapHeight,
          setHasStickyBackground,
          setSplitPanelReportedSize,
          setSplitPanelReportedHeaderHeight,
          splitPanel,
          splitPanelMaxWidth,
          splitPanelMinWidth,
          splitPanelPosition,
          splitPanelPreferences,
          splitPanelReportedSize,
          splitPanelReportedHeaderHeight,
          splitPanelSize,
          toolsHide,
          toolsOpen: isToolsOpen,
          toolsWidth,
          toolsFocusControl,
        }}
      >
        {children}
      </AppLayoutContext.Provider>
    );
  }
);
