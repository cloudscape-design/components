// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  pageId?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Error Boundary component for catching client-side rendering errors
 *
 * This component wraps page content and catches any errors that occur during
 * React rendering on the client side. When an error is caught, it displays
 * the error message in red text, matching the behavior of the non-SSR demo server.
 *
 * Note: Error boundaries only catch errors in their child component tree.
 * They do not catch errors in event handlers, async code, or server-side rendering.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorMessage: error.stack || error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Match the non-SSR demo server's error display: red text with the error
      return <span style={{ color: 'red', whiteSpace: 'pre' }}>{this.state.errorMessage}</span>;
    }

    return this.props.children;
  }
}
