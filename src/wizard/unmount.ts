// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export default class Unmount extends React.Component<{ onUnmount: () => void; children: React.ReactNode }> {
  componentWillUnmount() {
    this.props.onUnmount();
  }

  render() {
    return this.props.children;
  }
}
