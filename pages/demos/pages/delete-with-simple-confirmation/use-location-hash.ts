// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useEffect, useState } from 'react';

export default function useLocationHash() {
  const [currentPagePath, setCurrentPage] = useState(window.location.hash.substring(1));

  useEffect(() => {
    const handler = () => setCurrentPage(window.location.hash.substring(1));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPagePath]);

  return currentPagePath;
}
