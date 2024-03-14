// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect } from 'react';

import { HotspotProps } from './interfaces';
import styles from './styles.css.js';
import { hotspotContext as hotspotContextType } from '../annotation-context/context';
import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

export { HotspotProps };

export default function Hotspot({
  children,
  hotspotId,
  side = 'right',
  direction = 'top',
  ...restProps
}: HotspotProps): JSX.Element {
  const { __internalRootRef } = useBaseComponent('Hotspot', { props: { direction, side } });
  const baseProps = getBaseProps(restProps);

  const hotspotContext = useContext(hotspotContextType);

  const content = hotspotContext.getContentForId(hotspotId, direction);

  const { unregisterHotspot, registerHotspot } = hotspotContext;

  useEffect(() => {
    registerHotspot(hotspotId);

    return () => unregisterHotspot(hotspotId);
  }, [hotspotId, unregisterHotspot, registerHotspot]);

  if (children) {
    return (
      <div {...baseProps} className={clsx(baseProps.className, styles.root, styles.wrapper)} ref={__internalRootRef}>
        <div className={styles.elementWrapper}>{children}</div>
        <div className={clsx(styles.markerWrapper, styles[`placement-${side}`])} onClick={e => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <span
      {...baseProps}
      className={clsx(baseProps.className, styles.root, styles.inlineWrapper)}
      ref={__internalRootRef}
      onClick={e => e.stopPropagation()}
    >
      {content}
    </span>
  );
}

applyDisplayName(Hotspot, 'Hotspot');
