// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ReactNode, useState } from 'react';
import { Box, Button, Form, Input, Popover, SpaceBetween } from '~components';

import styles from './styles.scss';

export function ValueEditor({
  token,
  value,
  onChange,
  components,
}: {
  token: string;
  value: string;
  onChange: (value: null | string) => void;
  components: string[];
}) {
  return token.startsWith('color') ? (
    <EditorPopover
      control={(value, onChange) => <ColorPicker color={value} onSetColor={onChange} />}
      value={value}
      onChange={onChange}
      components={components}
    >
      <ColorIndicator color={value} />
    </EditorPopover>
  ) : (
    <EditorPopover
      control={(value, onChange) => <Input value={value} onChange={e => onChange(e.detail.value)} />}
      value={value}
      onChange={onChange}
      components={components}
    >
      {token.includes('borderRadius') ? (
        <RadiusPreview radius={value || '4px'} />
      ) : token.includes('fontFamily') ? (
        <FontPreview family={value} />
      ) : (
        '??'
      )}
    </EditorPopover>
  );
}

export function ColorIndicator({ color }: { color: string }) {
  return (
    <button
      style={{
        appearance: 'none',
        background: color,
      }}
      className={styles['value-preview']}
    />
  );
}

function EditorPopover({
  children,
  control,
  value: initialValue,
  onChange,
  components,
}: {
  children: ReactNode;
  control: (value: string, onChange: (value: string) => void) => ReactNode;
  value: string;
  onChange: (value: null | string) => void;
  components: string[];
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <Popover
      header="Edit token value"
      content={
        <SpaceBetween size="s">
          {components.length > 0 && (
            <>
              <Box>
                Updating this value will update the value in <b>{components.length}</b> components.
              </Box>
              <details>
                <summary>
                  <Box display="inline">Components that use this token</Box>
                </summary>
                <Box color="text-body-secondary">{components.join(', ')}</Box>
              </details>
            </>
          )}

          <Form
            actions={
              <SpaceBetween size="s" direction="horizontal">
                <Button onClick={() => onChange(value ?? null)} variant="primary">
                  Apply
                </Button>
              </SpaceBetween>
            }
          >
            {control(value, setValue)}
          </Form>
        </SpaceBetween>
      }
      triggerType="custom"
    >
      {children}
    </Popover>
  );
}

function ColorPicker({ color, onSetColor }: { color: string; onSetColor: (value: string) => void }) {
  return (
    <SpaceBetween size="xs" direction="vertical">
      <input type="color" value={color} onChange={e => onSetColor(e.target.value)} />
    </SpaceBetween>
  );
}

function RadiusPreview({ radius }: { radius: string }) {
  return (
    <button
      style={{
        appearance: 'none',
        borderRadius: radius,
        borderWidth: 2,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
      }}
      className={styles['value-preview']}
    />
  );
}

function FontPreview({ family }: { family: string }) {
  return (
    <button
      style={{
        appearance: 'none',
        marginTop: 0,
        border: 0,
        fontFamily: family,
        fontSize: '16px',
      }}
      className={styles['value-preview']}
    >
      Aa
    </button>
  );
}
