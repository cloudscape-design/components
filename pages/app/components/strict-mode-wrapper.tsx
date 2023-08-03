// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export default class StrictModeWrapper extends React.Component<{ pageId?: string; children: React.ReactNode }> {
  render() {
    const { pageId, children } = this.props;

    // Skipping code editor because react-resizable (a dependency of it) produces errors in React StrictMode.
    // See https://github.com/react-grid-layout/react-resizable/issues/161
    if (pageId && (pageId.indexOf('code-editor') !== -1 || pageId.indexOf('code-snippet') !== -1)) {
      return children;
    }
    return <React.StrictMode>{children}</React.StrictMode>;
  }
}
