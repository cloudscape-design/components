// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Portal } from '@cloudscape-design/component-toolkit/internal';

import Arrow from '../../../popover/arrow';
import PopoverBody from '../../../popover/body';
import PopoverContainer from '../../../popover/container';
import { getBaseProps } from '../../base-component';
import ResetContextsForModal from '../../context/reset-contexts-for-modal';
import { fireNonCancelableEvent } from '../../events';
import { InternalBaseComponentProps } from '../../hooks/use-base-component';
import { SomeRequired } from '../../types';
import { nodeBelongs } from '../../utils/node-belongs';
import { FeaturePromptProps } from './interfaces';

import styles from './styles.css.js';

interface InternalFeaturePromptProps
  extends SomeRequired<FeaturePromptProps, 'size' | 'position'>,
    InternalBaseComponentProps {}

function InternalFeaturePrompt(
  {
    onShow,
    onDismiss,
    header,
    content,
    i18nStrings,
    size,
    position,
    getTrack,
    trackKey,
    __internalRootRef,
    ...restProps
  }: InternalFeaturePromptProps,
  ref: React.Ref<FeaturePromptProps.Ref>
) {
  const baseProps = getBaseProps(restProps);
  const [show, setShow] = useState(false);

  const popoverBodyRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ({
    dismiss: () => {
      setShow(false);
      fireNonCancelableEvent(onDismiss);
    },
    show: () => {
      setShow(true);
      fireNonCancelableEvent(onShow);
    },
  }));

  useEffect(() => {
    if (!show) {
      return;
    }
    const clickListener = (event: MouseEvent) => {
      // Since the listener is registered on the window, `event.target` will incorrectly point at the
      // shadow root if the component is rendered inside shadow DOM.
      const target = event.composedPath ? event.composedPath()[0] : event.target;
      if (!nodeBelongs(popoverBodyRef.current, target)) {
        setShow(false);
        fireNonCancelableEvent(onDismiss, { method: 'click-outside' });
      }
    };

    // Listen for blur events on the window to detect clicks in iframes
    const blurListener = () => {
      if (document.activeElement?.tagName === 'IFRAME') {
        setShow(false);
        fireNonCancelableEvent(onDismiss, { method: 'click-outside' });
      }
    };

    const controller = new AbortController();
    window.addEventListener('click', clickListener, { signal: controller.signal, capture: true });
    window.addEventListener('blur', blurListener, { signal: controller.signal, capture: true });

    return () => {
      controller.abort();
    };
  }, [show, onDismiss]);

  return (
    <span {...baseProps} className={styles.root} ref={__internalRootRef}>
      {show && (
        <Portal>
          <ResetContextsForModal>
            <PopoverContainer
              size={size}
              fixedWidth={false}
              position={position}
              getTrack={getTrack}
              trackKey={trackKey}
              variant="annotation"
              arrow={position => <Arrow position={position} variant="info" />}
              zIndex={7000}
              renderWithPortal={true}
            >
              <PopoverBody
                ref={popoverBodyRef}
                dismissButton={true}
                dismissAriaLabel={i18nStrings?.dismissAriaLabel}
                header={header}
                onDismiss={method => {
                  setShow(false);
                  fireNonCancelableEvent(onDismiss, { method });
                }}
                onBlur={event => {
                  if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
                    setShow(false);
                    fireNonCancelableEvent(onDismiss, { method: 'blur' });
                  }
                }}
                variant="feature-prompt"
                overflowVisible="content"
              >
                {content}
              </PopoverBody>
            </PopoverContainer>
          </ResetContextsForModal>
        </Portal>
      )}
    </span>
  );
}

export default React.forwardRef(InternalFeaturePrompt);
