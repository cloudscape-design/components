// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderComponent } from './utils';
import AppLayout from '../../../lib/components/app-layout';
import { waitFor } from '@testing-library/react';
import { useAppLayoutContext } from '../../../lib/components/internal/context/app-layout-context';

describe('set context values for footer and header', () => {
  test('to their corresponding heights', async () => {
    function Content() {
      const contextValues = useAppLayoutContext();
      return (
        <>
          <div id="header-height">{contextValues.stickyOffsetTop}</div>
          <div id="footer-height">{contextValues.stickyOffsetBottom}</div>
        </>
      );
    }
    function App() {
      return (
        <>
          <div style={{ height: 55 }} id="header" />
          <AppLayout headerSelector="#header" footerSelector="#footer" content={<Content />} />
          <div style={{ height: 83 }} id="footer" />
        </>
      );
    }

    const { wrapper } = renderComponent(<App />);
    await waitFor(() => {
      expect(wrapper.find('#header-height')!.getElement()).toHaveTextContent('55');
    });
    await waitFor(() => {
      expect(wrapper.find('#footer-height')!.getElement()).toHaveTextContent('83');
    });
  });

  test('to zeros when there is no footer and header', async () => {
    function Content() {
      const contextValues = useAppLayoutContext();
      return (
        <>
          <div id="header-height">{contextValues.stickyOffsetTop}</div>
          <div id="footer-height">{contextValues.stickyOffsetBottom}</div>
        </>
      );
    }
    function App() {
      return <AppLayout content={<Content />} />;
    }

    const { wrapper } = renderComponent(<App />);
    await waitFor(() => {
      expect(wrapper.find('#header-height')!.getElement()).toHaveTextContent('0');
    });
    await waitFor(() => {
      expect(wrapper.find('#footer-height')!.getElement()).toHaveTextContent('0');
    });
  });
});

describe('set context values for hasBreadcrumbs', () => {
  test('to true', async () => {
    function Content() {
      const contextValues = useAppLayoutContext();
      return <div id="has-breadcrumbs">{`${contextValues.hasBreadcrumbs}`}</div>;
    }
    function App() {
      return <AppLayout breadcrumbs={<div style={{ height: 50 }} />} content={<Content />} />;
    }

    const { wrapper } = renderComponent(<App />);
    await waitFor(() => {
      expect(wrapper.find('#has-breadcrumbs')!.getElement()).toHaveTextContent('true');
    });
  });

  test('to false', async () => {
    function Content() {
      const contextValues = useAppLayoutContext();
      return <div id="has-breadcrumbs">{`${contextValues.hasBreadcrumbs}`}</div>;
    }
    function App() {
      return <AppLayout content={<Content />} />;
    }

    const { wrapper } = renderComponent(<App />);
    await waitFor(() => {
      expect(wrapper.find('#has-breadcrumbs')!.getElement()).toHaveTextContent('false');
    });
  });
});

// describe('set context values for hasNotificationsContent', () => {
//   test('to true when notifications have an actual content', async () => {
//     function Content() {
//       const contextValues = useAppLayoutContext();
//       return <div id="has-notifications-content">{`${contextValues.hasNotificationsContent}`}</div>;
//     }
//     function App() {
//       return (
//         <AppLayout
//           notifications={
//             <div id="random" style={{ height: 50, width: 50 }}>
//               random text
//             </div>
//           }
//           content={<Content />}
//         />
//       );
//     }

//     const { wrapper } = renderComponent(<App />);
//     console.log((wrapper as AppLayoutWrapper).findNotifications()!.getElement().className);
//     resizeObserver.mockElementSize((wrapper as AppLayoutWrapper).findNotifications()!.getElement(), {
//       contentBoxSize: { inlineSize: 300, blockSize: 200 },
//       borderBoxSize: { inlineSize: 300, blockSize: 200 },
//     });

//     act(() => {
//       resizeObserver.resize();
//       console.log('resize');
//     });
//     await waitFor(() => {
//       expect(wrapper.find('#has-notifications-content')!.getElement()).toHaveTextContent('true');
//     });
//   });

//   test('to false when notifications are not defined', async () => {
//     function Content() {
//       const contextValues = useAppLayoutContext();
//       return <div id="has-notifications-content">{`${contextValues.hasNotificationsContent}`}</div>;
//     }
//     function App() {
//       return <AppLayout content={<Content />} />;
//     }

//     const { wrapper } = renderComponent(<App />);
//     await waitFor(() => {
//       expect(wrapper.find('#has-notifications-content')!.getElement()).toHaveTextContent('false');
//     });
//   });
// });
