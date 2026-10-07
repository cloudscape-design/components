// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useRef } from 'react';

import { mount, unmount } from '~mount';

import styles from './iframe-wrapper.scss';

function copyStyles(srcDoc: Document, targetDoc: Document): Promise<unknown> {
  const pending: Promise<void>[] = [];

  for (const stylesheet of Array.from(srcDoc.querySelectorAll('link[rel=stylesheet]'))) {
    const newStylesheet = targetDoc.createElement('link');
    for (const attr of stylesheet.getAttributeNames()) {
      newStylesheet.setAttribute(attr, stylesheet.getAttribute(attr)!);
    }
    pending.push(
      new Promise<void>(resolve => {
        newStylesheet.addEventListener('load', () => resolve());
        newStylesheet.addEventListener('error', () => resolve());
      })
    );
    targetDoc.head.appendChild(newStylesheet);
  }

  return Promise.all(pending);
}

function syncClasses(from: HTMLElement, to: HTMLElement) {
  to.className = from.className;
  const observer = new MutationObserver(() => {
    to.className = from.className;
  });

  observer.observe(from, { attributes: true, attributeFilter: ['class'] });

  return () => {
    observer.disconnect();
  };
}

export function IframeWrapper({
  id,
  AppComponent,
  size,
}: {
  id: string;
  AppComponent: React.ComponentType;
  /**
   * Renders the iframe at this fixed pixel size instead of filling the screen. The iframe is its own
   * viewport, so this is how a page-level layout can be given a viewport that differs from the browser's.
   */
  size?: { width: number; height: number };
}) {
  const cleanupRef = useRef<(() => void) | null>(null);

  // use callback ref instead of useEffect to avoid double effect issues in React 18+ strict mode
  const mountIframe = useCallback(
    (container: HTMLElement | null) => {
      if (!container) {
        cleanupRef.current?.();
        cleanupRef.current = null;
        return;
      }
      const iframeEl = container.ownerDocument.createElement('iframe');
      if (size) {
        iframeEl.style.inlineSize = `${size.width}px`;
        iframeEl.style.blockSize = `${size.height}px`;
        iframeEl.style.border = '0';
        iframeEl.style.display = 'block';
      } else {
        iframeEl.className = styles['full-screen'];
      }
      iframeEl.id = id;
      iframeEl.title = id;
      container.appendChild(iframeEl);

      const iframeDocument = iframeEl.contentDocument!;
      // Prevent iframe document instance from reload
      // https://bugzilla.mozilla.org/show_bug.cgi?id=543435
      iframeDocument.open();
      // set html5 doctype
      iframeDocument.writeln('<!DOCTYPE html>');
      iframeDocument.close();

      const innerAppRoot = iframeDocument.createElement('div');
      iframeDocument.body.appendChild(innerAppRoot);
      iframeDocument.dir = document.dir;
      if (size) {
        // A fixed-size iframe is used to give a page-level layout an exact viewport, so the document
        // has to fill it: without this the default body margin shows as a gutter and the layout only
        // grows to its content height instead of the full frame.
        iframeDocument.documentElement.style.blockSize = '100%';
        iframeDocument.body.style.blockSize = '100%';
        iframeDocument.body.style.margin = '0';
        innerAppRoot.style.blockSize = '100%';
      }
      const syncClassesCleanup = syncClasses(document.body, iframeDocument.body);

      // Wait for the copied stylesheets to load before mounting the app. Mounting synchronously
      // would run layout effects against an unstyled DOM, producing incorrect computed styles
      // that never get recalculated afterwards.
      let disposed = false;
      copyStyles(document, iframeDocument).then(() => {
        if (disposed) {
          return;
        }
        mount(<AppComponent />, innerAppRoot);
      });

      cleanupRef.current = () => {
        disposed = true;
        syncClassesCleanup();
        unmount(innerAppRoot);
        container.removeChild(iframeEl);
      };
    },
    [AppComponent, id, size]
  );

  return <div ref={mountIframe}></div>;
}
