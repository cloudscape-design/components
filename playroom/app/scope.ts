// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState, useCallback, useEffect, useLayoutEffect } from 'react';

export default function useScope() {
  return {
    useState,
    useCallback,
    useEffect,
    useLayoutEffect,
    Function: ({ children }: { children: () => React.ReactNode }) => children(),
  };
}
