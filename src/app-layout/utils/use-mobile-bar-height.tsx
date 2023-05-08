// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState, useEffect } from 'react';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { useMobile } from '../../internal/hooks/use-mobile/index.js';
import classicMobileBarStyles from '../mobile-toolbar/styles.css.js';
import vrMobileBarStyles from '../visual-refresh/styles.css.js';

export function useMobileBarHeight() {
  const isVisualRefresh = useVisualRefresh();
  const isMobile = useMobile();
  const [mobileBarHeight, setMobileBarHeight] = useState(0);

  const mobileBarStyles = isVisualRefresh ? vrMobileBarStyles.appbar : classicMobileBarStyles['mobile-bar'];

  useEffect(() => {
    const updateMobileBarHeight = () => {
      const mobileBarElement = document.querySelector(`.${mobileBarStyles}`);
      if (mobileBarElement) {
        setMobileBarHeight(mobileBarElement.getBoundingClientRect().height);
      } else {
        setMobileBarHeight(0);
      }
    };

    updateMobileBarHeight();
  }, [isMobile, mobileBarStyles]);

  return mobileBarHeight;
}
