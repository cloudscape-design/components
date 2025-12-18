// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { useResize } from '../../../lib/components/app-layout/visual-refresh-toolbar/drawer/use-resize';
import useContainerWidth from '../../../lib/components/internal/utils/use-container-width';
import PanelLayout, { PanelLayoutProps } from '../../../lib/components/panel-layout';
import createWrapper from '../../../lib/components/test-utils/dom';

// Mock the useContainerWidth hook
jest.mock('../../../lib/components/internal/utils/use-container-width', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the useResize hook
jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/drawer/use-resize', () => ({
  useResize: jest.fn(),
}));

function renderPanelLayout(props: Partial<PanelLayoutProps> = {}) {
  const ref = React.createRef<PanelLayoutProps.Ref>();
  const defaultProps: PanelLayoutProps = {
    panelContent: 'Panel content',
    mainContent: 'Main content',
    ...props,
  };
  const renderResult = render(<PanelLayout ref={ref} {...defaultProps} />);
  const wrapper = createWrapper(renderResult.container).findPanelLayout()!;
  return { wrapper, ref };
}

const CONTAINER_WIDTH = 800;

describe('PanelLayout Component', () => {
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
      const { wrapper } = renderPanelLayout({
        mainContent: 'Test main content',
        panelContent: 'Test panel content',
      });

      expect(wrapper.findMainContent()!.getElement()).toHaveTextContent('Test main content');
      expect(wrapper.findPanelContent()!.getElement()).toHaveTextContent('Test panel content');
    });

    test('renders without resize handle when not resizable', () => {
      const { wrapper } = renderPanelLayout({ resizable: false });

      expect(wrapper.findResizeHandle()).toBeNull();
    });

    test('renders with resize handle when resizable', () => {
      const { wrapper } = renderPanelLayout({ resizable: true });

      expect(wrapper.findResizeHandle()).not.toBeNull();
    });
  });

  describe('Panel sizing', () => {
    test('applies default panel size when no size specified', () => {
      const { wrapper } = renderPanelLayout();
      const panel = wrapper.findPanelContent()!.getElement().parentElement;

      expect(panel).toHaveStyle('inline-size: 200px');
    });

    test('applies defaultPanelSize in uncontrolled mode', () => {
      const { wrapper } = renderPanelLayout({ defaultPanelSize: 300 });
      const panel = wrapper.findPanelContent()!.getElement().parentElement;

      expect(panel).toHaveStyle('inline-size: 300px');
    });

    test('applies panelSize in controlled mode', () => {
      const { wrapper } = renderPanelLayout({ panelSize: 250, onPanelResize: () => {} });
      const panel = wrapper.findPanelContent()!.getElement().parentElement;

      expect(panel).toHaveStyle('inline-size: 250px');
    });

    test('uses minPanelSize when defaultPanelSize is not provided', () => {
      const { wrapper } = renderPanelLayout({ minPanelSize: 150 });
      const panel = wrapper.findPanelContent()!.getElement().parentElement;

      expect(panel).toHaveStyle('inline-size: 150px');
    });
  });

  describe('Accessibility', () => {
    test('resize handle has proper aria attributes', () => {
      const { wrapper } = renderPanelLayout({
        resizable: true,
        i18nStrings: { resizeHandleAriaLabel: 'Resize handle' },
      });
      const handle = wrapper.findResizeHandle();

      expect(handle).not.toBeNull();
      expect(handle!.getElement()).toHaveAttribute('aria-label', 'Resize handle');
    });
  });

  describe('focusHandle', () => {
    test('focuses the resize handle when resizable is true', () => {
      const { wrapper, ref } = renderPanelLayout({ resizable: true });
      const handle = wrapper.findResizeHandle();

      expect(handle).not.toBeNull();
      expect(document.activeElement).not.toBe(handle!.getElement());

      ref.current!.focusResizeHandle();

      expect(document.activeElement).toBe(handle!.getElement());
    });

    test('does not throw error when resizable is false', () => {
      const { ref } = renderPanelLayout({ resizable: false });

      expect(() => {
        ref.current!.focusResizeHandle();
      }).not.toThrow();
    });

    test('does nothing when resizable is false', () => {
      const { wrapper, ref } = renderPanelLayout({ resizable: false });
      const originalActiveElement = document.activeElement;

      expect(wrapper.findResizeHandle()).toBeNull();

      ref.current!.focusResizeHandle();

      expect(document.activeElement).toBe(originalActiveElement);
    });
  });

  describe('Display property', () => {
    test('renders both content and panel when display is "all" (default)', () => {
      const { wrapper } = renderPanelLayout({
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
      const { wrapper } = renderPanelLayout({
        mainContent: 'Test main content',
        panelContent: 'Test panel content',
      });

      const content = wrapper.findMainContent();
      const panel = wrapper.findPanelContent();

      expect(content).not.toBeNull();
      expect(panel).not.toBeNull();
    });

    test('hides main content when display is "panel-only"', () => {
      const { wrapper } = renderPanelLayout({
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
      const { wrapper } = renderPanelLayout({
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
      const { wrapper } = renderPanelLayout({
        display: 'panel-only',
        resizable: true,
      });

      expect(wrapper.findResizeHandle()).toBeNull();
    });

    test('does not render resize handle when display is "main-only"', () => {
      const { wrapper } = renderPanelLayout({
        display: 'main-only',
        resizable: true,
      });

      expect(wrapper.findResizeHandle()).toBeNull();
    });

    test('does not apply panel sizing when display is not "all"', () => {
      const { wrapper } = renderPanelLayout({
        display: 'panel-only',
        panelSize: 300,
        onPanelResize: () => {},
      });

      expect(wrapper.findPanelContent()!.getElement().parentElement).not.toHaveStyle('inline-size: 300px');
    });
  });

  describe('useResize hook integration', () => {
    beforeEach(() => {
      mockUseResize.mockClear();
    });

    test('passes correct parameters to useResize hook', () => {
      renderPanelLayout({
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

      renderPanelLayout({
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
        const { wrapper } = renderPanelLayout({
          panelSize: 50,
          minPanelSize: 150,
          maxPanelSize: 500,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 150px');
      });

      test('clamps panelSize above maxPanelSize to maxPanelSize', () => {
        const { wrapper } = renderPanelLayout({
          panelSize: 600,
          minPanelSize: 100,
          maxPanelSize: 400,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 400px');
      });

      test('clamps panelSize above container width to container width', () => {
        const { wrapper } = renderPanelLayout({
          panelSize: 1000,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle(`inline-size: ${CONTAINER_WIDTH}px`);
      });

      test('clamps panelSize when both above maxPanelSize and container width', () => {
        const { wrapper } = renderPanelLayout({
          panelSize: 1000,
          maxPanelSize: 600,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        // Should clamp to maxPanelSize (600), which is less than containerWidth (800)
        expect(panel).toHaveStyle('inline-size: 600px');
      });

      test('uses panelSize within bounds without clamping', () => {
        const { wrapper } = renderPanelLayout({
          panelSize: 250,
          minPanelSize: 100,
          maxPanelSize: 400,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 250px');
      });

      test('clamps panelSize below minPanelSize when minPanelSize equals maxPanelSize', () => {
        const { wrapper } = renderPanelLayout({
          panelSize: 100,
          minPanelSize: 300,
          maxPanelSize: 300,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 300px');
      });
    });

    describe('defaultPanelSize (uncontrolled mode)', () => {
      test('clamps defaultPanelSize below minPanelSize to minPanelSize', () => {
        const { wrapper } = renderPanelLayout({
          defaultPanelSize: 50,
          minPanelSize: 150,
          maxPanelSize: 500,
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 150px');
      });

      test('clamps defaultPanelSize above maxPanelSize to maxPanelSize', () => {
        const { wrapper } = renderPanelLayout({
          defaultPanelSize: 600,
          minPanelSize: 100,
          maxPanelSize: 400,
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 400px');
      });

      test('clamps defaultPanelSize above container width to container width', () => {
        const { wrapper } = renderPanelLayout({
          defaultPanelSize: 1000,
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle(`inline-size: ${CONTAINER_WIDTH}px`);
      });

      test('clamps defaultPanelSize when both above maxPanelSize and container width', () => {
        const { wrapper } = renderPanelLayout({
          defaultPanelSize: 1000,
          maxPanelSize: 600,
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        // Should clamp to maxPanelSize (600), which is less than containerWidth (800)
        expect(panel).toHaveStyle('inline-size: 600px');
      });

      test('uses defaultPanelSize within bounds without clamping', () => {
        const { wrapper } = renderPanelLayout({
          defaultPanelSize: 250,
          minPanelSize: 100,
          maxPanelSize: 400,
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 250px');
      });

      test('clamps defaultPanelSize when minPanelSize equals maxPanelSize', () => {
        const { wrapper } = renderPanelLayout({
          defaultPanelSize: 100,
          minPanelSize: 300,
          maxPanelSize: 300,
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 300px');
      });
    });

    describe('edge cases with missing min/max bounds', () => {
      test('clamps panelSize when only maxPanelSize is provided', () => {
        const { wrapper } = renderPanelLayout({
          panelSize: 600,
          maxPanelSize: 400,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 400px');
      });

      test('clamps panelSize when only minPanelSize is provided', () => {
        const { wrapper } = renderPanelLayout({
          panelSize: 50,
          minPanelSize: 150,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 150px');
      });

      test('uses defaultPanelSize when only maxPanelSize is provided and size is within bounds', () => {
        const { wrapper } = renderPanelLayout({
          defaultPanelSize: 250,
          maxPanelSize: 400,
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 250px');
      });

      test('clamps negative panelSize to minPanelSize when provided', () => {
        const { wrapper } = renderPanelLayout({
          panelSize: -50,
          minPanelSize: 100,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 100px');
      });

      test('clamps negative panelSize to 0 when minPanelSize is not provided', () => {
        const { wrapper } = renderPanelLayout({
          panelSize: -50,
          onPanelResize: () => {},
        });

        const panel = wrapper.findPanelContent()!.getElement().parentElement;
        expect(panel).toHaveStyle('inline-size: 0px');
      });
    });

    describe('useResize hook receives clamped values', () => {
      test('passes clamped panelSize to useResize when below minPanelSize', () => {
        mockUseResize.mockClear();

        renderPanelLayout({
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

        renderPanelLayout({
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

        renderPanelLayout({
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

        renderPanelLayout({
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

  describe('panelFocusable', () => {
    test('makes panel content focusable with ariaLabel', () => {
      const { wrapper } = renderPanelLayout({
        panelFocusable: { ariaLabel: 'Panel region' },
      });

      const panel = wrapper.findPanelContent()!.getElement();
      expect(panel).toHaveAttribute('tabindex', '0');
      expect(panel).toHaveAttribute('role', 'region');
      expect(panel).toHaveAttribute('aria-label', 'Panel region');
    });

    test('makes panel content focusable with ariaLabelledby', () => {
      const { wrapper } = renderPanelLayout({
        panelFocusable: { ariaLabelledby: 'panel-header-id' },
      });

      const panel = wrapper.findPanelContent()!.getElement();
      expect(panel).toHaveAttribute('tabindex', '0');
      expect(panel).toHaveAttribute('role', 'region');
      expect(panel).toHaveAttribute('aria-labelledby', 'panel-header-id');
    });

    test('does not make panel content focusable when panelFocusable is not provided', () => {
      const { wrapper } = renderPanelLayout();

      const panel = wrapper.findPanelContent()!.getElement();
      expect(panel).not.toHaveAttribute('tabindex');
      expect(panel).not.toHaveAttribute('role');
      expect(panel).not.toHaveAttribute('aria-label');
      expect(panel).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('mainFocusable', () => {
    test('makes main content focusable with ariaLabel', () => {
      const { wrapper } = renderPanelLayout({
        mainFocusable: { ariaLabel: 'Main region' },
      });

      const content = wrapper.findMainContent()!.getElement();
      expect(content).toHaveAttribute('tabindex', '0');
      expect(content).toHaveAttribute('role', 'region');
      expect(content).toHaveAttribute('aria-label', 'Main region');
    });

    test('makes main content focusable with ariaLabelledby', () => {
      const { wrapper } = renderPanelLayout({
        mainFocusable: { ariaLabelledby: 'main-header-id' },
      });

      const content = wrapper.findMainContent()!.getElement();
      expect(content).toHaveAttribute('tabindex', '0');
      expect(content).toHaveAttribute('role', 'region');
      expect(content).toHaveAttribute('aria-labelledby', 'main-header-id');
    });

    test('does not make main content focusable when mainFocusable is not provided', () => {
      const { wrapper } = renderPanelLayout();

      const content = wrapper.findMainContent()!.getElement();
      expect(content).not.toHaveAttribute('tabindex');
      expect(content).not.toHaveAttribute('role');
      expect(content).not.toHaveAttribute('aria-label');
      expect(content).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('onLayoutChange', () => {
    test('is called when container width changes', () => {
      const onLayoutChange = jest.fn();

      const { rerender } = render(
        <PanelLayout panelContent="Panel" mainContent="Main" onLayoutChange={onLayoutChange} />
      );

      // Simulate container width change
      mockUseContainerWidth.mockReturnValue([1000, React.createRef()]);
      rerender(<PanelLayout panelContent="Panel" mainContent="Main" onLayoutChange={onLayoutChange} />);

      expect(onLayoutChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { totalSize: 1000, panelSize: 200 },
        })
      );
    });

    test('is called when panelSize prop changes in controlled mode', () => {
      const onLayoutChange = jest.fn();
      const onPanelResize = jest.fn();

      const { rerender } = render(
        <PanelLayout
          panelContent="Panel"
          mainContent="Main"
          panelSize={300}
          onPanelResize={onPanelResize}
          onLayoutChange={onLayoutChange}
        />
      );

      // Change panelSize prop
      rerender(
        <PanelLayout
          panelContent="Panel"
          mainContent="Main"
          panelSize={400}
          onPanelResize={onPanelResize}
          onLayoutChange={onLayoutChange}
        />
      );

      expect(onLayoutChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { totalSize: CONTAINER_WIDTH, panelSize: 400 },
        })
      );
    });

    test('is called when user resizes the panel', () => {
      const onLayoutChange = jest.fn();
      let newPanelSize = 300;
      const onPanelResize = jest.fn(event => {
        newPanelSize = event.detail.panelSize;
      });
      let capturedOnResize: ((size: number) => void) | undefined;

      mockUseResize.mockImplementation(({ onResize }) => {
        capturedOnResize = onResize;
        return {
          onKeyDown: jest.fn(),
          onDirectionClick: jest.fn(),
          onPointerDown: jest.fn(),
          relativeSize: 50,
        };
      });

      const { rerender } = render(
        <PanelLayout
          panelContent="Panel"
          mainContent="Main"
          resizable={true}
          panelSize={newPanelSize}
          onPanelResize={onPanelResize}
          onLayoutChange={onLayoutChange}
        />
      );

      // Simulate user resize - this triggers onPanelResize
      act(() => {
        capturedOnResize!(350);
      });

      // In controlled mode, parent would update panelSize prop
      rerender(
        <PanelLayout
          panelContent="Panel"
          mainContent="Main"
          resizable={true}
          panelSize={newPanelSize}
          onPanelResize={onPanelResize}
          onLayoutChange={onLayoutChange}
        />
      );

      expect(onLayoutChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { totalSize: CONTAINER_WIDTH, panelSize: 350 },
        })
      );
    });
  });
});
