// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useRef } from 'react';

import { ActiveDrawersContext } from '../../../app-layout/utils/visibility-context';
import { MountContentContext } from '../controllers/drawers';

import styles from './styles.css.js';

type VisibilityCallback = (isVisible: boolean) => void;

interface RuntimeContentWrapperProps {
  mountContent: (container: HTMLElement, mountContent: MountContentContext) => void;
  unmountContent: (container: HTMLElement) => void;
  id?: string;
}

export function RuntimeContentWrapper({ mountContent, unmountContent, id }: RuntimeContentWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visibilityChangeCallback = useRef<VisibilityCallback | null>(null);
  const activeDrawersIds = useContext(ActiveDrawersContext);
  const isVisible = !!id && activeDrawersIds.includes(id);

  useEffect(() => {
    const container = ref.current!;
    mountContent(container, {
      onVisibilityChange: cb => {
        visibilityChangeCallback.current = cb;
      },
    });
    return () => {
      unmountContent(container);
      visibilityChangeCallback.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    visibilityChangeCallback.current?.(isVisible);
  }, [isVisible]);

  return <div ref={ref} className={styles['runtime-content-wrapper']}></div>;
}
