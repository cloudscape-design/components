// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import AppContext from '../../app/app-context';
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

export function IframeWrapper({ id, AppComponent }: { id: string; AppComponent: React.ComponentType }) {
  const { urlParams } = useContext(AppContext);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframeEl = iframeRef.current;
    if (!iframeEl) {
      return;
    }
    console.log('Mounting iframe');
    const innerAppRoot = iframeEl.contentDocument!.createElement('div');
    iframeEl.contentDocument!.body.appendChild(innerAppRoot);
    copyStyles(document, iframeEl.contentDocument!);
    if (urlParams.visualRefresh) {
      iframeEl.contentDocument!.body.className = 'awsui-visual-refresh';
    }
    ReactDOM.render(<AppComponent />, innerAppRoot);
    return () => {
      ReactDOM.unmountComponentAtNode(innerAppRoot);
    };
  }, [AppComponent, urlParams.visualRefresh]);

  return <iframe id={id} ref={iframeRef} className={styles['full-screen']}></iframe>;
}
