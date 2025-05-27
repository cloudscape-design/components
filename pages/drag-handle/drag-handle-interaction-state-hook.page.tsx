// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import Box from '~components/box';
import Checkbox from '~components/checkbox';
import Container from '~components/container';
import Header from '~components/header';
import useDragHandleInteractionState, {
  UseDragHandleInteractionStateProps,
} from '~components/internal/components/drag-handle/hooks/use-drag-handle-interaction-state';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';

import styles from './styles.scss';

type PageContext = React.Context<
  AppContextType<{
    renderInPortal: boolean;
  }>
>;

const TestBoardItemButton: React.FC = () => {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const [renderInPortal, setRenderInPortal] = useState(false);
  const [, setInteractionTriggeredState] = useState(0);

  interface TestMetadata {
    operation: 'drag' | 'resize';
  }

  const hookProps: UseDragHandleInteractionStateProps<TestMetadata> = {
    onDndStartAction: (event, metadata) => {
      console.log('onDndStartAction triggered', event.clientX, event.clientY, metadata);
      setInteractionTriggeredState(s => s + 1);
    },
    onDndActiveAction: event => {
      console.log('onDndActiveAction triggered', event.clientX, event.clientY);
      setInteractionTriggeredState(s => s + 1);
    },
    onDndEndAction: () => {
      console.log('onDndEndAction triggered');
      setInteractionTriggeredState(s => s + 1);
    },
    onUapActionStartAction: metadata => {
      console.log('onKeyboardStartAction triggered', metadata);
      setInteractionTriggeredState(s => s + 1);
    },
    onUapActionEndAction: () => {
      console.log('onKeyboardEndAction triggered');
      setInteractionTriggeredState(s => s + 1);
    },
  };

  const hook = useDragHandleInteractionState<TestMetadata>(hookProps);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleGlobalPointerMove = (event: PointerEvent) => {
    hook.processPointerMove(event);
  };

  const handleGlobalPointerUp = (event: PointerEvent) => {
    hook.processPointerUp(event);
    // Clean up global listeners after interaction ends
    window.removeEventListener('pointermove', handleGlobalPointerMove);
    window.removeEventListener('pointerup', handleGlobalPointerUp);
  };

  const handlePointerCancel = () => {
    hook.processPointerCancel();
    // Clean up global listeners after interaction ends
    window.removeEventListener('pointermove', handleGlobalPointerMove);
    window.removeEventListener('pointerup', handleGlobalPointerUp);
  };

  const handleOnPointerDown = (event: PointerEvent) => {
    hook.processPointerDown(event, { operation: 'drag' });
    if (urlParams.renderInPortal) {
      setRenderInPortal(true);
    }

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);
  };

  // Using a native button for testing because the system's button does not expose all native properties
  const buttonComp = (
    <button
      ref={buttonRef}
      onPointerDown={e => handleOnPointerDown(e.nativeEvent)}
      onPointerCancel={handlePointerCancel}
      onKeyDown={e => hook.processKeyDown(e, { operation: 'resize' })}
      onFocus={hook.processFocus}
      onBlur={hook.processBlur}
      className={clsx(styles['test-button'])}
      tabIndex={0}
    >
      Test button to interact with
    </button>
  );

  return (
    <>
      <Header
        variant="h1"
        description="Page to test the board-item behaviour which is rendered in a portal on onPointerDown when adding from the pallete to the board"
      >
        Drag handle hook
      </Header>
      <SpaceBetween size="m">
        <Checkbox
          checked={urlParams.renderInPortal}
          onChange={event => {
            setUrlParams({ renderInPortal: event.detail.checked });
          }}
        >
          Render Test Button in a portal on click
        </Checkbox>

        <Container>
          <Box variant="pre">
            <p>Current State: {String(hook.interaction.value) || 'null'}</p>
            <p>Metadata: {JSON.stringify(hook.interaction.metadata)}</p>
            <p>
              DnD Event Coords:{' '}
              {hook.interaction.eventData ? (
                <>
                  ({hook.interaction.eventData?.clientX}, {hook.interaction.eventData?.clientY})
                </>
              ) : (
                '-'
              )}
            </p>
          </Box>
        </Container>
        {renderInPortal ? <div>{createPortal(buttonComp, document.body)}</div> : buttonComp}
      </SpaceBetween>
    </>
  );
};

export default TestBoardItemButton;
