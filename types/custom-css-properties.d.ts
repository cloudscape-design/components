// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import 'react';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
