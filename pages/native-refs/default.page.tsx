// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import Header from '~components/header';
import KeyValuePairs from '~components/key-value-pairs';
import SpaceBetween from '~components/space-between';
import StatusIndicator, { StatusIndicatorProps } from '~components/status-indicator';
import Textarea, { TextareaProps } from '~components/textarea';

import { SimplePage } from '../app/templates';

const INSERTED = `[inserted]`;

function getVisibility(ratio: number | null): { type: StatusIndicatorProps.Type; label: string } {
  return ratio === null
    ? { type: `pending`, label: `Not measured` }
    : ratio === 0
      ? { type: `error`, label: `Not visible` }
      : ratio < 1
        ? { type: `warning`, label: `Partially visible` }
        : { type: `success`, label: `Fully visible` };
}

export default function NativeRefsPage() {
  const componentRef = useRef<TextareaProps.Ref>(null);
  const nativeRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [value, setValue] = useState(`Select or place the cursor in this text. Drag the corner to resize.`);
  const [nativeEdit, setNativeEdit] = useState<{
    readonly caret: number;
    readonly inputType: string;
    readonly data: string | null;
  } | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [visibleRatio, setVisibleRatio] = useState<number | null>(null);
  const [pendingCursor, setPendingCursor] = useState<number | null>(null);

  useLayoutEffect(() => {
    nativeRef.current?.scrollIntoView({ behavior: `smooth`, block: `center` });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const element = nativeRef.current;

    if (container && element) {
      const observer = new IntersectionObserver(
        entries => {
          setVisibleRatio(entries[0].intersectionRatio);
        },
        { root: container, threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const element = nativeRef.current;

    if (element) {
      const observer = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;

        setSize({ width: Math.round(width), height: Math.round(height) });
      });

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  useLayoutEffect(() => {
    if (pendingCursor !== null) {
      nativeRef.current?.setSelectionRange(pendingCursor, pendingCursor);
      nativeRef.current?.focus();

      setPendingCursor(null);
    }
  }, [pendingCursor]);

  const handleChange: TextareaProps['onChange'] = event => {
    setValue(event.detail.value);
  };

  const handleNativeChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const inputEvent = event.nativeEvent as InputEvent;
    setNativeEdit({
      caret: event.currentTarget.selectionStart,
      inputType: inputEvent.inputType ?? `unknown`,
      data: inputEvent.data,
    });
  };

  const focusViaComponentRef = (): void => {
    componentRef.current?.focus();
  };

  const focusViaNativeRef = (): void => {
    nativeRef.current?.focus();
  };

  const insertViaNativeRef = (): void => {
    const element = nativeRef.current;
    if (element) {
      const start = element.selectionStart ?? 0;
      const end = element.selectionEnd ?? 0;

      setValue(value.slice(0, start) + INSERTED + value.slice(end));
      setPendingCursor(start + INSERTED.length);
    }
  };

  const scrollViaNativeRef = (): void => {
    nativeRef.current?.scrollIntoView({ behavior: `smooth`, block: `center` });
  };

  const visibility = getVisibility(visibleRatio);
  const ratioLabel = visibleRatio === null ? `-` : `${Math.round(visibleRatio * 100)}%`;

  return (
    <SimplePage title="Native element refs">
      <SpaceBetween size={`l`}>
        <div>
          <Container variant="stacked" disableContentPaddings={true}>
            <div ref={containerRef} style={{ blockSize: 220, overflowY: `auto`, overflowX: `clip`, padding: 16 }}>
              <div style={{ blockSize: 240 }} />
              <Textarea
                ref={componentRef}
                ariaLabel={`Native refs test textarea`}
                nativeTextareaAttributes={{ ref: nativeRef, onChange: handleNativeChange }}
                value={value}
                onChange={handleChange}
              />
              <div style={{ blockSize: 240 }} />
            </div>
          </Container>

          <Container variant="stacked">
            <ColumnLayout columns={2} variant="text-grid">
              <SpaceBetween size={`xxs`}>
                <Box variant="awsui-key-label">Component ref</Box>
                <SpaceBetween size={`xs`} direction={`horizontal`}>
                  <Button onClick={focusViaComponentRef}>{`Focus`}</Button>
                </SpaceBetween>
              </SpaceBetween>

              <SpaceBetween size={`xxs`}>
                <Box variant="awsui-key-label">Native ref</Box>
                <SpaceBetween size={`xs`} direction={`horizontal`}>
                  <Button onClick={focusViaNativeRef}>{`Focus`}</Button>
                  <Button onClick={insertViaNativeRef}>{`Insert at selection`}</Button>
                  <Button onClick={scrollViaNativeRef}>{`Scroll into view`}</Button>
                </SpaceBetween>
              </SpaceBetween>
            </ColumnLayout>
          </Container>
        </div>

        <Container>
          <ColumnLayout columns={2} variant="text-grid">
            <SpaceBetween size={`m`}>
              <Header
                variant="h2"
                description="Both handlers are chained: the component's onChange manages the controlled value, while the chained native handler reports fields the event detail does not carry."
              >
                {`Native event`}
              </Header>
              <KeyValuePairs
                columns={3}
                items={[
                  { label: `inputType`, value: nativeEdit ? nativeEdit.inputType : `-` },
                  { label: `data`, value: nativeEdit ? JSON.stringify(nativeEdit.data) : `-` },
                  { label: `selectionStart`, value: nativeEdit ? nativeEdit.caret : `-` },
                ]}
              />
            </SpaceBetween>

            <SpaceBetween size={`m`}>
              <Header variant="h2" description="Observers attached directly to the native element.">
                {`Observers`}
              </Header>
              <KeyValuePairs
                columns={2}
                items={[
                  {
                    type: `group`,
                    title: `ResizeObserver`,
                    items: [
                      { label: `Width`, value: size ? size.width : `-` },
                      { label: `Height`, value: size ? size.height : `-` },
                    ],
                  },
                  {
                    type: `group`,
                    title: `IntersectionObserver`,
                    items: [
                      {
                        label: `Visible in container`,
                        value: <StatusIndicator type={visibility.type}>{visibility.label}</StatusIndicator>,
                      },
                      { label: `Visible ratio`, value: ratioLabel },
                    ],
                  },
                ]}
              />
            </SpaceBetween>
          </ColumnLayout>
        </Container>
      </SpaceBetween>
    </SimplePage>
  );
}
