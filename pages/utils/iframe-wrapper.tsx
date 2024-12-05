// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import styles from './iframe-wrapper.scss';

function copyStyles(srcDoc: Document, targetDoc: Document) {
  for (const stylesheet of Array.from(srcDoc.querySelectorAll('link[rel=stylesheet]'))) {
    const newStylesheet = targetDoc.createElement('link');
    for (const attr of stylesheet.getAttributeNames()) {
      newStylesheet.setAttribute(attr, stylesheet.getAttribute(attr)!);
    }
    targetDoc.head.appendChild(newStylesheet);
  }
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }
    const iframeEl = container.ownerDocument.createElement('iframe');
    iframeEl.style.height = '300px';
    iframeEl.style.width = '100%';
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
    copyStyles(document, iframeDocument);
    iframeDocument.dir = document.dir;
    const syncClassesCleanup = syncClasses(document.body, iframeDocument.body);
    ReactDOM.render(<AppComponent />, innerAppRoot);
    return () => {
      syncClassesCleanup();
      ReactDOM.unmountComponentAtNode(innerAppRoot);
      container.removeChild(iframeEl);
    };
  }, [id, AppComponent]);

  return <div ref={ref}></div>;
}
