// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ReactNode, useState } from 'react';
import { Box, Button, Form, Input, Popover, SpaceBetween } from '~components';

import { componentsMap } from './component-tokens-mapping';
import styles from './styles.scss';

export function ValueEditor({
  token,
  value,
  onChange,
}: {
  token: string;
  value: string;
  onChange: (value: null | string) => void;
}) {
  return token.startsWith('color') ? (
    <EditorPopover
      tokenName={token}
      control={(value, onChange) => <ColorPicker color={value} onSetColor={onChange} />}
      value={value}
      onChange={onChange}
    >
      <ColorIndicator color={value} />
    </EditorPopover>
  ) : (
    <EditorPopover
      tokenName={token}
      control={(value, onChange) => <Input value={value} onChange={e => onChange(e.detail.value)} />}
      value={value}
      onChange={onChange}
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
  tokenName,
  control,
  value: initialValue,
  onChange,
}: {
  children: ReactNode;
  tokenName: string;
  control: (value: string, onChange: (value: string) => void) => ReactNode;
  value: string;
  onChange: (value: null | string) => void;
}) {
  function getTokenComponents(token: string) {
    const components: string[] = [];
    for (const [key, value] of Object.entries(componentsMap)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      value.length > 0 && value.includes(token) && components.push(key);
    }
    return components;
  }

  const [value, setValue] = useState(initialValue);

  return (
    <Popover
      header="Edit token value"
      content={
        <SpaceBetween size="s">
          {getTokenComponents(tokenName).length > 0 && (
            <>
              <Box>
                Updating this value will update the value in <b>{getTokenComponents(tokenName).length}</b> components.
              </Box>
              <details>
                <summary>
                  <Box display="inline">Components that use this token</Box>
                </summary>
                <Box color="text-body-secondary">{getTokenComponents(tokenName).join(', ')}</Box>
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
