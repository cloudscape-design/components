// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export default class ErrorBoundary extends React.Component<any, { errorMessage: string }> {
  constructor(props: any) {
    super(props);
    this.state = { errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { errorMessage: error.message };
  }

  render() {
    if (this.state.errorMessage) {
      // You can render any custom fallback UI
      return <span style={{ color: 'red' }}>{this.state.errorMessage}</span>;
    }

    return this.props.children;
  }
}
