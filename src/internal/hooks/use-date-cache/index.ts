// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef } from 'react';

export function useDateCache(): (date: Date) => Date {
  const cacheRef = useRef<{ [key: number]: Date }>({});

  return (date: Date) => {
    if (cacheRef.current[date.getTime()]) {
      return cacheRef.current[date.getTime()];
    }
    cacheRef.current[date.getTime()] = date;
    return date;
  };
}
