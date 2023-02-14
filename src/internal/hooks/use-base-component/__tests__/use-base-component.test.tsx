// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render } from '@testing-library/react';
import useBaseComponent, {
  InternalBaseComponentProps,
} from '../../../../../lib/components/internal/hooks/use-base-component';
import { COMPONENT_METADATA_KEY } from '@cloudscape-design/component-toolkit/internal';
import { PACKAGE_VERSION } from '../../../../../lib/components/internal/environment';
import { useTelemetry } from '../../../../../lib/components/internal/hooks/use-telemetry';
import createWrapper from '../../../../../lib/components/test-utils/dom';
import Portal from '../../../../../lib/components/internal/components/portal';
import { Button } from '../../../../../lib/components';

jest.mock('../../../../../lib/components/internal/hooks/use-telemetry', () => {
  return { useTelemetry: jest.fn(() => null) };
});

type InternalDemoProps = InternalBaseComponentProps;
function InternalDemo({ __internalRootRef }: InternalDemoProps) {
  return <div ref={__internalRootRef}>Internal Demo Component</div>;
}

function Demo() {
  const baseComponentProps = useBaseComponent('DemoComponent');
  return <InternalDemo {...baseComponentProps} />;
}

/**
 * This demo component mimics the Modal component.
 */
function PortalDemoComponent() {
  const { __internalRootRef } = useBaseComponent('PortalDemoComponent');
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setIsVisible(true)}>Show modal</Button>
      <Portal>
        <div
          id="portalContentWrapper"
          style={{
            display: isVisible ? 'block' : 'none',
          }}
          ref={__internalRootRef}
        >
          Dummy Modal Content
        </div>
      </Portal>
    </>
  );
}

test('should attach the metadata to the returned root DOM node', () => {
  const { container } = render(<Demo />);
  const rootNode: any = container.firstChild;
  expect(rootNode[COMPONENT_METADATA_KEY]?.name).toBe('DemoComponent');
  expect(rootNode[COMPONENT_METADATA_KEY]?.version).toBe(PACKAGE_VERSION);
});

test('should call the useTelemetry hook passing down the given component name', () => {
  jest.resetAllMocks();
  render(<Demo />);
  expect(useTelemetry).toHaveBeenCalledWith('DemoComponent');
});

test('metadata get attached on the Portal component root DOM node when elementRef is changing', () => {
  /**
   * This test component uses the  internal Portal component where a conditional
   * rendering is happening:
   * - initially the Portal content does not get rendered
   * - Portal's useLayoutEffect gets fired synchronously after all DOM mutations
   * - the Portal's child elements got rendered
   *
   * The test covers the case that the metadata got attached after the modal got opened.
   */
  const { container, rerender } = render(<PortalDemoComponent />);
  const wrapper = createWrapper(container);

  const getPortalRootDomNode = () => {
    return document.querySelector('#portalContentWrapper')! as any;
  };

  expect(getPortalRootDomNode()[COMPONENT_METADATA_KEY]).toBeUndefined();
  wrapper.findButton()!.click();

  // By re-rendering the component we have the mechanism in place to ensure all updates
  // to the DOM (attaching the metadata to the changed ref from the modal) have been done.
  rerender(<PortalDemoComponent />);

  expect(getPortalRootDomNode()[COMPONENT_METADATA_KEY]?.name).toBe('PortalDemoComponent');
  expect(getPortalRootDomNode()[COMPONENT_METADATA_KEY]?.version).toBe(PACKAGE_VERSION);
});
