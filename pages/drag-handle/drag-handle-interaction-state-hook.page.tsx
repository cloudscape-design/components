// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import InternalDragHandle from '~components/internal/components/drag-handle';
import useDragHandleInteractionState, {
  UseDragHandleInteractionStateProps,
} from '~components/internal/components/drag-handle/hooks/use-drag-handle-interaction-state';

const TestBoardItemButton: React.FC = () => {
  const [shouldRenderInPortal, setShouldRenderInPortal] = useState(true);

  interface TestMetadata {
    operation: 'drag' | 'resize';
  }

  const hookProps: UseDragHandleInteractionStateProps<TestMetadata> = {
    onDndStartAction: (event, metadata) => {
      console.log('onDndStartAction triggered', event.clientX, event.clientY, metadata);
    },
    onDndActiveAction: event => {
      console.log('onDndActiveAction triggered', event.clientX, event.clientY);
    },
    onDndEndAction: () => {
      console.log('onDndEndAction triggered');
    },
    onUapActionStartAction: metadata => {
      console.log('onKeyboardStartAction triggered', metadata);
    },
    onUapActionEndAction: () => {
      console.log('onKeyboardEndAction triggered');
    },
  };

  const hook = useDragHandleInteractionState<TestMetadata>(hookProps);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const currentButton = buttonRef.current;

    const handleGlobalPointerMove = (event: PointerEvent) => {
      hook.processPointerMove(event);
    };

    const handleGlobalPointerUp = (event: PointerEvent) => {
      hook.processPointerUp(event);
      // Clean up global listeners after interaction ends
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };

    const handleWindowPointerDown = (event: PointerEvent) => {
      // Is the event originated from our button?
      if (currentButton && currentButton.contains(event.target as Node)) {
        hook.processPointerDown(event, { operation: 'drag' }); // event is already native PointerEvent from window listener

        // Start listening for global move and up
        window.addEventListener('pointermove', handleGlobalPointerMove);
        window.addEventListener('pointerup', handleGlobalPointerUp);
      }
    };
    window.addEventListener('pointerdown', handleWindowPointerDown);

    return () => {
      window.removeEventListener('pointerdown', handleWindowPointerDown);
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
    // Depend on the specific (stable) hook properties, as the hook itself changes on every state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hook.processPointerDown, shouldRenderInPortal]);

  const buttonComp = (
    <>
      <InternalDragHandle />
      <button
        ref={buttonRef}
        onKeyDown={e => hook.processKeyDown(e, { operation: 'resize' })}
        onFocus={hook.processFocus}
        onBlur={hook.processBlur}
        style={{
          padding: '20px',
          border: '2px solid blue',
          touchAction: 'none',
        }}
        tabIndex={0}
      >
        Interact with Me (Global Pointer Listeners)
      </button>
    </>
  );

  return (
    <div>
      <button onClick={() => setShouldRenderInPortal(prevState => !prevState)}>
        RenderInPortal: {shouldRenderInPortal.toString()}
      </button>
      <hr />
      <div style={{ marginTop: '20px', fontFamily: 'monospace' }}>
        <p>Current State: {String(hook.interaction.state) || 'null'}</p>
        <p>Metadata: {JSON.stringify(hook.interaction.metadata)}</p>
        <p>
          DnD Event Coords (last):{' '}
          {hook.interaction.eventData ? (
            <>
              ({hook.interaction.eventData?.clientX}, {hook.interaction.eventData?.clientY})
            </>
          ) : (
            '-'
          )}
        </p>
      </div>
      <hr />
      {shouldRenderInPortal ? <div>{createPortal(buttonComp, document.body)}</div> : buttonComp}
    </div>
  );
};

export default TestBoardItemButton;
