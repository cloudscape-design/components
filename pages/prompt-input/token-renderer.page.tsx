// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { PromptInputProps } from '~components/prompt-input';
import { extractTokensFromDOM } from '~components/prompt-input/core/token-operations';
import { PortalContainer, renderTokensToDOM } from '~components/prompt-input/core/token-renderer';
import Token from '~components/token/internal';

import { SimplePage } from '../app/templates';

let nextId = 1;

// Menu definitions for trigger/reference token extraction
const menus: PromptInputProps.MenuDefinition[] = [
  {
    id: 'mentions',
    trigger: '@',
    options: [
      { value: 'alice', label: 'Alice' },
      { value: 'bob', label: 'Bob' },
    ],
  },
  {
    id: 'commands',
    trigger: '/',
    options: [
      { value: 'help', label: 'Help' },
      { value: 'clear', label: 'Clear' },
    ],
  },
];

export default function TokenRendererPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const portalContainersRef = useRef(new Map<string, PortalContainer>());
  const [tokens, setTokens] = useState<PromptInputProps.InputToken[]>([]);
  const [extracted, setExtracted] = useState<PromptInputProps.InputToken[] | null>(null);
  const [, forceRender] = useState(0);

  const applyTokens = useCallback((newTokens: PromptInputProps.InputToken[]) => {
    setTokens(newTokens);
    if (editorRef.current) {
      renderTokensToDOM(newTokens, editorRef.current, portalContainersRef.current);
      // Force re-render so portals update
      forceRender(n => n + 1);
    }
  }, []);

  const addText = () => {
    applyTokens([...tokens, { type: 'text', value: `Hello world ${nextId++} ` }]);
  };

  const addReference = () => {
    const id = `ref-${nextId++}`;
    applyTokens([...tokens, { type: 'reference', id, label: 'Alice', value: 'alice', menuId: 'mentions' }]);
  };

  const addTrigger = () => {
    applyTokens([...tokens, { type: 'trigger', value: '', triggerChar: '@', id: `trig-${nextId++}` }]);
  };

  const addBreak = () => {
    applyTokens([...tokens, { type: 'break', value: '\n' }]);
  };

  const clearAll = () => {
    applyTokens([]);
    setExtracted(null);
  };

  const extractFromDOM = () => {
    if (editorRef.current) {
      const result = extractTokensFromDOM(editorRef.current, menus, portalContainersRef.current);
      setExtracted(result);
    }
  };

  const buttonStyle: React.CSSProperties = {
    padding: '4px 12px',
    marginRight: 6,
    marginBottom: 6,
    cursor: 'pointer',
  };

  return (
    <SimplePage title="Token Renderer (isolated)">
      <p>
        Tests <code>renderTokensToDOM</code> directly, without the PromptInput component. Uses custom token renderer and
        menu definitions for <code>@</code> (mentions) and <code>/</code> (commands).
      </p>

      <div style={{ marginBottom: 12 }}>
        <button style={buttonStyle} onClick={addText}>
          Add text
        </button>
        <button style={buttonStyle} onClick={addReference}>
          Add reference
        </button>
        <button style={buttonStyle} onClick={addTrigger}>
          Add @ trigger
        </button>
        <button
          style={buttonStyle}
          onClick={() =>
            applyTokens([...tokens, { type: 'trigger', value: '', triggerChar: '/', id: `trig-${nextId++}` }])
          }
        >
          Add / trigger
        </button>
        <button style={buttonStyle} onClick={addBreak}>
          Add break
        </button>
        <button style={buttonStyle} onClick={clearAll}>
          Clear all
        </button>
        <button style={buttonStyle} onClick={extractFromDOM}>
          Extract from DOM
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        data-testid="token-editor"
        style={{
          border: '1px solid #aaa',
          borderRadius: 4,
          minHeight: 80,
          padding: 8,
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          marginBottom: 16,
        }}
      />

      {Array.from(portalContainersRef.current.values()).map(container =>
        ReactDOM.createPortal(
          <Token key={container.id} variant="inline" label={container.label} disabled={false} readOnly={false} />,
          container.element
        )
      )}

      <details open={true}>
        <summary>Token state ({tokens.length} tokens)</summary>
        <pre data-testid="token-state" style={{ fontSize: 12, overflow: 'auto', maxHeight: 300 }}>
          {JSON.stringify(tokens, null, 2)}
        </pre>
      </details>

      {extracted && (
        <details open={true}>
          <summary>Extracted from DOM ({extracted.length} tokens)</summary>
          <pre data-testid="extracted-state" style={{ fontSize: 12, overflow: 'auto', maxHeight: 300 }}>
            {JSON.stringify(extracted, null, 2)}
          </pre>
        </details>
      )}
    </SimplePage>
  );
}
