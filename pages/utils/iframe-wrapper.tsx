// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useRef } from 'react';

import { mount, unmount } from '~mount';

import styles from './iframe-wrapper.scss';

function copyStyles(srcDoc: Document, targetDoc: Document): Promise<void> {
  const loadPromises: Promise<void>[] = [];

  // Copy <link rel="stylesheet"> elements (production builds)
  const stylesheetLinks = Array.from(srcDoc.querySelectorAll('link[rel=stylesheet]'));
  for (const stylesheet of stylesheetLinks) {
    const newStylesheet = targetDoc.createElement('link');
    for (const attr of stylesheet.getAttributeNames()) {
      newStylesheet.setAttribute(attr, stylesheet.getAttribute(attr)!);
    }

    // Wait for each stylesheet to load
    const loadPromise = new Promise<void>(resolve => {
      newStylesheet.addEventListener('load', () => resolve(), { once: true });
      newStylesheet.addEventListener('error', () => resolve(), { once: true });
    });
    loadPromises.push(loadPromise);

    targetDoc.head.appendChild(newStylesheet);
  }

  // Copy <style> elements (Vite dev mode injects styles as <style> tags)
  const styleTags = Array.from(srcDoc.querySelectorAll('style'));
  for (const styleTag of styleTags) {
    const newStyleTag = targetDoc.createElement('style');
    for (const attr of styleTag.getAttributeNames()) {
      newStyleTag.setAttribute(attr, styleTag.getAttribute(attr)!);
    }
    newStyleTag.textContent = styleTag.textContent;
    targetDoc.head.appendChild(newStyleTag);
  }

  return Promise.all(loadPromises).then(() => undefined);
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

export function IframeWrapper({ id, AppComponent }: { id: string; AppComponent: React.ComponentType }) {
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
      iframeEl.className = styles['full-screen'];
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
      const syncClassesCleanup = syncClasses(document.body, iframeDocument.body);

      // Wait for stylesheets to load before mounting to ensure CSS variables are available
      // This prevents the "Missing AWS-UI CSS" warning from styles-check.ts
      copyStyles(document, iframeDocument).then(() => {
        mount(<AppComponent />, innerAppRoot);
      });

      cleanupRef.current = () => {
        syncClassesCleanup();
        unmount(innerAppRoot);
        container.removeChild(iframeEl);
      };
    },
    [AppComponent, id]
  );

  return <div ref={mountIframe}></div>;
}
