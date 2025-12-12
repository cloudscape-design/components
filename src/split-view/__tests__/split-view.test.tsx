// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { useResize } from '../../../lib/components/app-layout/visual-refresh-toolbar/drawer/use-resize';
import useContainerWidth from '../../../lib/components/internal/utils/use-container-width';
import SplitView, { SplitViewProps } from '../../../lib/components/split-view';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/split-view/styles.css.js';

// Mock the useContainerWidth hook
jest.mock('../../../lib/components/internal/utils/use-container-width', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the useResize hook
jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/drawer/use-resize', () => ({
  useResize: jest.fn(),
}));

function renderSplitView(props: Partial<SplitViewProps> = {}) {
  const ref = React.createRef<SplitViewProps.Ref>();
  const defaultProps: SplitViewProps = {
    panelContent: 'Panel content',
    mainContent: 'Main content',
    ...props,
  };
  const renderResult = render(<SplitView ref={ref} {...defaultProps} />);
  const wrapper = createWrapper(renderResult.container).findSplitView()!;
  return { wrapper, ref };
}

const CONTAINER_WIDTH = 800;

describe('SplitView Component', () => {
  const mockUseContainerWidth = useContainerWidth as jest.MockedFunction<typeof useContainerWidth>;
  const mockUseResize = useResize as jest.MockedFunction<typeof useResize>;

  beforeEach(() => {
    // Mock useContainerWidth to return a width of 800 and a mock ref
    mockUseContainerWidth.mockReturnValue([CONTAINER_WIDTH, React.createRef()]);

    // Reset useResize mock
    mockUseResize.mockReturnValue({
      onKeyDown: jest.fn(),
      onDirectionClick: jest.fn(),
      onPointerDown: jest.fn(),
      relativeSize: 50,
    });
  });

  describe('Basic rendering', () => {
    test('renders main content and panel content', () => {
      const { wrapper } = renderSplitView({
        mainContent: 'Test main content',
        panelContent: 'Test panel content',
      });

      expect(wrapper.findMainContent()!.getElement()).toHaveTextContent('Test main content');
      expect(wrapper.findPanelContent()!.getElement()).toHaveTextContent('Test panel content');
    });

    test('renders without resize handle when not resizable', () => {
      const { wrapper } = renderSplitView({ resizable: false });

      expect(wrapper.findResizeHandle()).toBeNull();
    });

    test('renders with resize handle when resizable', () => {
      const { wrapper } = renderSplitView({ resizable: true });

      expect(wrapper.findResizeHandle()).not.toBeNull();
    });
  });

  describe('Panel sizing', () => {
    test('applies default panel size when no size specified', () => {
      const { wrapper } = renderSplitView();
      const panel = wrapper.findPanelContent()!.getElement();

      expect(panel).toHaveStyle('inline-size: 200px');
    });

    test('applies defaultPanelSize in uncontrolled mode', () => {
      const { wrapper } = renderSplitView({ defaultPanelSize: 300 });
      const panel = wrapper.findPanelContent()!.getElement();

      expect(panel).toHaveStyle('inline-size: 300px');
    });

    test('applies panelSize in controlled mode', () => {
      const { wrapper } = renderSplitView({ panelSize: 250, onPanelResize: () => {} });
      const panel = wrapper.findPanelContent()!.getElement();

      expect(panel).toHaveStyle('inline-size: 250px');
    });

    test('uses minPanelSize when defaultPanelSize is not provided', () => {
      const { wrapper } = renderSplitView({ minPanelSize: 150 });
      const panel = wrapper.findPanelContent()!.getElement();

      expect(panel).toHaveStyle('inline-size: 150px');
    });
  });

  describe('Panel variant', () => {
    test('renders with panel variant by default', () => {
      const { wrapper } = renderSplitView();

      expect(wrapper.findPanelContent()!.getElement()).toHaveClass(styles['panel-variant-panel']);
    });

    test('renders with custom variant when specified', () => {
      const { wrapper } = renderSplitView({ panelVariant: 'custom' });

      expect(wrapper.findPanelContent()!.getElement()).not.toHaveClass(styles['panel-variant-panel']);
    });
  });

  describe('Accessibility', () => {
    test('resize handle has proper aria attributes', () => {
      const { wrapper } = renderSplitView({ resizable: true, i18nStrings: { resizeHandleAriaLabel: 'Resize handle' } });
      const handle = wrapper.findResizeHandle();

      expect(handle).not.toBeNull();
      expect(handle!.getElement()).toHaveAttribute('aria-label', 'Resize handle');
    });
  });

  describe('focusHandle', () => {
    test('focuses the resize handle when resizable is true', () => {
      const { wrapper, ref } = renderSplitView({ resizable: true });
      const handle = wrapper.findResizeHandle();

      expect(handle).not.toBeNull();
      expect(document.activeElement).not.toBe(handle!.getElement());

      ref.current!.focusResizeHandle();

      expect(document.activeElement).toBe(handle!.getElement());
    });

    test('does not throw error when resizable is false', () => {
      const { ref } = renderSplitView({ resizable: false });

      expect(() => {
        ref.current!.focusResizeHandle();
      }).not.toThrow();
    });

    test('does nothing when resizable is false', () => {
      const { wrapper, ref } = renderSplitView({ resizable: false });
      const originalActiveElement = document.activeElement;

      expect(wrapper.findResizeHandle()).toBeNull();

      ref.current!.focusResizeHandle();

      expect(document.activeElement).toBe(originalActiveElement);
    });
  });

  describe('Display property', () => {
    test('renders both content and panel when display is "all" (default)', () => {
      const { wrapper } = renderSplitView({
        display: 'all',
        mainContent: 'Test main content',
        panelContent: 'Test panel content',
      });

      const content = wrapper.findMainContent();
      const panel = wrapper.findPanelContent();

      expect(content).not.toBeNull();
      expect(panel).not.toBeNull();
      expect(content!.getElement()).toHaveTextContent('Test main content');
      expect(panel!.getElement()).toHaveTextContent('Test panel content');
    });

    test('defaults to "all" display when no display prop provided', () => {
      const { wrapper } = renderSplitView({
        mainContent: 'Test main content',
        panelContent: 'Test panel content',
      });

      const content = wrapper.findMainContent();
      const panel = wrapper.findPanelContent();

      expect(content).not.toBeNull();
      expect(panel).not.toBeNull();
    });

    test('hides main content when display is "panel-only"', () => {
      const { wrapper } = renderSplitView({
        display: 'panel-only',
        mainContent: 'Test main content',
        panelContent: 'Test panel content',
      });

      const content = wrapper.findMainContent();
      const panel = wrapper.findPanelContent();

      expect(content).toBeNull();
      expect(panel).not.toBeNull();
    });

    test('hides panel when display is "main-only"', () => {
      const { wrapper } = renderSplitView({
        display: 'main-only',
        mainContent: 'Test main content',
        panelContent: 'Test panel content',
      });

      const content = wrapper.findMainContent();
      const panel = wrapper.findPanelContent();

      expect(content).not.toBeNull();
      expect(panel).toBeNull();
    });

    test('does not render resize handle when display is "panel-only"', () => {
      const { wrapper } = renderSplitView({
        display: 'panel-only',
        resizable: true,
      });

      expect(wrapper.findResizeHandle()).toBeNull();
    });

    test('does not render resize handle when display is "main-only"', () => {
      const { wrapper } = renderSplitView({
        display: 'main-only',
        resizable: true,
      });

      expect(wrapper.findResizeHandle()).toBeNull();
    });

    test('does not apply panel sizing when display is not "all"', () => {
      const { wrapper } = renderSplitView({
        display: 'panel-only',
        panelSize: 300,
        onPanelResize: () => {},
      });

      expect(wrapper.findPanelContent()!.getElement()).not.toHaveStyle('inline-size: 300px');
    });
  });

  describe('useResize hook integration', () => {
    beforeEach(() => {
      mockUseResize.mockClear();
    });

    test('passes correct parameters to useResize hook', () => {
      renderSplitView({
        resizable: true,
        panelSize: 250,
        minPanelSize: 100,
        maxPanelSize: 500,
      });

      expect(mockUseResize).toHaveBeenCalledWith(
        expect.objectContaining({
          currentWidth: 250,
          minWidth: 100,
          maxWidth: 500,
          position: 'side-start',
        })
      );
    });

    test('calls onResize callback with expected details', () => {
      const onResizeMock = jest.fn();
      let capturedOnResize: ((size: number) => void) | undefined;

      // Mock useResize to capture the onResize callback passed to it
      mockUseResize.mockImplementation(({ onResize }) => {
        capturedOnResize = onResize;
        return {
          onKeyDown: jest.fn(),
          onDirectionClick: jest.fn(),
          onPointerDown: jest.fn(),
          relativeSize: 50,
        };
      });

      renderSplitView({
        resizable: true,
        onPanelResize: onResizeMock,
        panelSize: 300,
      });

      capturedOnResize!(350);

      expect(onResizeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { totalSize: CONTAINER_WIDTH, panelSize: 350 },
        })
      );
    });
  });

  describe('Panel size bounds handling', () => {
    describe('panelSize (controlled mode)', () => {
      test('clamps panelSize below minPanelSize to minPanelSize', () => {
        const { wrapper } = renderSplitView({
          panelSize: 50,
          minPanelSize: 150,
          maxPanelSize: 500,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 150px');
      });

      test('clamps panelSize above maxPanelSize to maxPanelSize', () => {
        const { wrapper } = renderSplitView({
          panelSize: 600,
          minPanelSize: 100,
          maxPanelSize: 400,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 400px');
      });

      test('clamps panelSize above container width to container width', () => {
        const { wrapper } = renderSplitView({
          panelSize: 1000,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle(`inline-size: ${CONTAINER_WIDTH}px`);
      });

      test('clamps panelSize when both above maxPanelSize and container width', () => {
        const { wrapper } = renderSplitView({
          panelSize: 1000,
          maxPanelSize: 600,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement();
        // Should clamp to maxPanelSize (600), which is less than containerWidth (800)
        expect(panel).toHaveStyle('inline-size: 600px');
      });

      test('uses panelSize within bounds without clamping', () => {
        const { wrapper } = renderSplitView({
          panelSize: 250,
          minPanelSize: 100,
          maxPanelSize: 400,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 250px');
      });

      test('clamps panelSize below minPanelSize when minPanelSize equals maxPanelSize', () => {
        const { wrapper } = renderSplitView({
          panelSize: 100,
          minPanelSize: 300,
          maxPanelSize: 300,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 300px');
      });
    });

    describe('defaultPanelSize (uncontrolled mode)', () => {
      test('clamps defaultPanelSize below minPanelSize to minPanelSize', () => {
        const { wrapper } = renderSplitView({
          defaultPanelSize: 50,
          minPanelSize: 150,
          maxPanelSize: 500,
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 150px');
      });

      test('clamps defaultPanelSize above maxPanelSize to maxPanelSize', () => {
        const { wrapper } = renderSplitView({
          defaultPanelSize: 600,
          minPanelSize: 100,
          maxPanelSize: 400,
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 400px');
      });

      test('clamps defaultPanelSize above container width to container width', () => {
        const { wrapper } = renderSplitView({
          defaultPanelSize: 1000,
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle(`inline-size: ${CONTAINER_WIDTH}px`);
      });

      test('clamps defaultPanelSize when both above maxPanelSize and container width', () => {
        const { wrapper } = renderSplitView({
          defaultPanelSize: 1000,
          maxPanelSize: 600,
        });

        const panel = wrapper.findPanelContent()!.getElement();
        // Should clamp to maxPanelSize (600), which is less than containerWidth (800)
        expect(panel).toHaveStyle('inline-size: 600px');
      });

      test('uses defaultPanelSize within bounds without clamping', () => {
        const { wrapper } = renderSplitView({
          defaultPanelSize: 250,
          minPanelSize: 100,
          maxPanelSize: 400,
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 250px');
      });

      test('clamps defaultPanelSize when minPanelSize equals maxPanelSize', () => {
        const { wrapper } = renderSplitView({
          defaultPanelSize: 100,
          minPanelSize: 300,
          maxPanelSize: 300,
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 300px');
      });
    });

    describe('edge cases with missing min/max bounds', () => {
      test('clamps panelSize when only maxPanelSize is provided', () => {
        const { wrapper } = renderSplitView({
          panelSize: 600,
          maxPanelSize: 400,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 400px');
      });

      test('clamps panelSize when only minPanelSize is provided', () => {
        const { wrapper } = renderSplitView({
          panelSize: 50,
          minPanelSize: 150,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 150px');
      });

      test('uses defaultPanelSize when only maxPanelSize is provided and size is within bounds', () => {
        const { wrapper } = renderSplitView({
          defaultPanelSize: 250,
          maxPanelSize: 400,
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 250px');
      });

      test('clamps negative panelSize to minPanelSize when provided', () => {
        const { wrapper } = renderSplitView({
          panelSize: -50,
          minPanelSize: 100,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 100px');
      });

      test('clamps negative panelSize to 0 when minPanelSize is not provided', () => {
        const { wrapper } = renderSplitView({
          panelSize: -50,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement();
        expect(panel).toHaveStyle('inline-size: 0px');
      });
    });

    describe('useResize hook receives clamped values', () => {
      test('passes clamped panelSize to useResize when below minPanelSize', () => {
        mockUseResize.mockClear();

        renderSplitView({
          resizable: true,
          panelSize: 50,
          minPanelSize: 150,
          maxPanelSize: 500,
          onPanelResize: () => {},
        });

        expect(mockUseResize).toHaveBeenCalledWith(
          expect.objectContaining({
            currentWidth: 150,
            minWidth: 150,
            maxWidth: 500,
          })
        );
      });

      test('passes clamped panelSize to useResize when above maxPanelSize', () => {
        mockUseResize.mockClear();

        renderSplitView({
          resizable: true,
          panelSize: 600,
          minPanelSize: 100,
          maxPanelSize: 400,
          onPanelResize: () => {},
        });

        expect(mockUseResize).toHaveBeenCalledWith(
          expect.objectContaining({
            currentWidth: 400,
            minWidth: 100,
            maxWidth: 400,
          })
        );
      });

      test('passes clamped defaultPanelSize to useResize when below minPanelSize', () => {
        mockUseResize.mockClear();

        renderSplitView({
          resizable: true,
          defaultPanelSize: 50,
          minPanelSize: 150,
          maxPanelSize: 500,
        });

        expect(mockUseResize).toHaveBeenCalledWith(
          expect.objectContaining({
            currentWidth: 150,
            minWidth: 150,
            maxWidth: 500,
          })
        );
      });

      test('passes clamped defaultPanelSize to useResize when above maxPanelSize', () => {
        mockUseResize.mockClear();

        renderSplitView({
          resizable: true,
          defaultPanelSize: 600,
          minPanelSize: 100,
          maxPanelSize: 400,
        });

        expect(mockUseResize).toHaveBeenCalledWith(
          expect.objectContaining({
            currentWidth: 400,
            minWidth: 100,
            maxWidth: 400,
          })
        );
      });
    });
  });
});
