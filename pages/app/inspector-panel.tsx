// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Link, Toggle } from '~components';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokenMapping from './tokens-mapping.json';

const stylesMapping = Object.entries(tokenMapping)
  .map(([selector, tokenByState]: any) => ({
    selector: fixSelector(selector),
    tokens: Object.values(tokenByState).flatMap(v => v),
  }))
  .filter(({ selector }) => selector.trim()) as { selector: string; tokens: string[] }[];

function fixSelector(selector: string): string {
  return selector.replace(/:.*/, '').replace(/>.*/, '').replace('50%', '');
}

const TREE_SIZE = 5;

interface TreeElement {
  name: string;
  tokens: string[];
}

interface InspectedElement {
  node: Element;
  tree: TreeElement[];
}

interface InspectorPanelProps {
  onClose: () => void;
}

function getElementTokens(element: Element): string[] {
  const tokens: string[] = [];
  for (const style of stylesMapping) {
    try {
      if (element.matches(style.selector)) {
        tokens.push(...style.tokens);
      }
    } catch (error) {
      console.warn(`Invalid selector: "${style.selector}".`);
    }
  }
  return [...new Set(tokens)];
}

function getComponentSegmentName(element: Element): string {
  const segmentNames = [
    'header',
    'footer',
    'section',
    'button',
    'action',
    'content',
    'panel',
    'area',
    'body',
    'container',
    'tools',
  ];

  const classNames = Array.from(element.classList).filter(className => className.startsWith('awsui_'));
  for (const className of classNames) {
    const [, qualifier] = className.split('_');
    for (const segmentName of segmentNames) {
      if (qualifier.includes(segmentName)) {
        return qualifier;
      }
    }
  }

  return 'part';
}

function getElementName(element: Element): string {
  const componentName = (element as any).__awsuiMetadata__?.name;
  if (componentName) {
    return componentName;
  }

  let componentAncestor: null | Element = element;
  while (componentAncestor) {
    const componentName = (componentAncestor as any).__awsuiMetadata__?.name;
    if (componentName) {
      return `${componentName} - ${getComponentSegmentName(element)}`;
    }
    componentAncestor = componentAncestor.parentElement;
  }

  return element.tagName;
}

export function InspectorPanel({ onClose }: InspectorPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<null | InspectedElement>(null);

  const [inspectorEnabled, setInspectorEnabled] = useState(false);
  const [selectedNode, setSelectedNode] = useState<null | InspectedElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(
    () => {
      const cursor = cursorRef.current;

      function placeCursor() {
        if (targetRef.current && cursor) {
          const elementRect = targetRef.current.node.getBoundingClientRect();
          cursor.style.visibility = 'visible';
          cursor.style.left = elementRect.left + 'px';
          cursor.style.top = elementRect.top + 'px';
          cursor.style.width = elementRect.width + 'px';
          cursor.style.height = elementRect.height + 'px';
        }
      }

      function setPointerEvents(node: Element) {
        for (const child of Array.from(node.children)) {
          if (child instanceof HTMLElement) {
            child.style.pointerEvents = 'all';
          }
        }
      }

      function onMouseMove(event: MouseEvent) {
        const panel = panelRef.current;
        const nextElement = document.elementFromPoint(event.clientX, event.clientY);
        if (
          nextElement &&
          nextElement !== targetRef.current?.node &&
          nextElement !== panel &&
          !panel?.contains(nextElement)
        ) {
          let current = nextElement;
          const tree: TreeElement[] = [];
          for (let i = 0; i < TREE_SIZE; i++) {
            const elementName = getElementName(current);
            tree.push({ name: elementName, tokens: getElementTokens(current) });

            if (!current.parentElement || (current as any).__awsuiMetadata__) {
              break;
            }

            current = current.parentElement;
          }

          targetRef.current = { node: nextElement, tree };
          setSelectedNode(targetRef.current);
          setSelectedIndex(0);

          setPointerEvents(nextElement);
        }

        placeCursor();

        if (cursor) {
          cursor.style.background = 'rgba(255, 242, 178, 0.33)';
          cursor.style.border = '1px solid #bda55d';
        }
      }

      function onScroll() {
        placeCursor();
      }

      function onResize() {
        placeCursor();
      }

      function onMouseDown(event: MouseEvent) {
        if (targetRef.current && event.target instanceof Element && !panelRef.current?.contains(event.target)) {
          event.stopPropagation();
          event.preventDefault();
          setInspectorEnabled(false);
        }
        if (cursor) {
          cursor.style.background = 'rgba(129, 204, 185, 0.33)';
          cursor.style.border = '1px solid #5dbda5';
        }
      }

      function onClick(event: MouseEvent) {
        if (targetRef.current && event.target instanceof Element && !panelRef.current?.contains(event.target)) {
          event.stopPropagation();
          event.preventDefault();
        }
      }

      window.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onResize);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mousedown', onMouseDown, true);
      window.addEventListener('click', onClick, true);

      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mousedown', onMouseDown, true);
        window.removeEventListener('click', onClick, true);
      };
    },
    // Expecting onClose to be stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inspectorEnabled]
  );

  return (
    <div
      ref={panelRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '8px',
        paddingTop: '16px',
        boxSizing: 'border-box',
        position: 'relative',
        borderLeft: '1px solid #bda55d',
      }}
    >
      <div style={{ position: 'absolute', top: '4px', right: '4px' }}>
        <Button onClick={onClose} variant="icon" iconName="close" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Toggle onChange={({ detail }) => setInspectorEnabled(detail.checked)} checked={inspectorEnabled}>
          Elements inspector
        </Toggle>

        <ElementsTree target={selectedNode} tokenIndex={selectedIndex} onSelect={index => setSelectedIndex(index)} />

        <TokensPanel>
          {selectedNode && selectedNode.tree[selectedIndex].tokens.length > 0 && (
            <Tokens tokens={selectedNode.tree[selectedIndex].tokens} />
          )}

          {!selectedNode && (
            <TokensPanelMessage>
              Use Elements inspector to select a Cloudscape element and see a list of associated{' '}
              <Link href="https://cloudscape.aws.dev/foundation/visual-foundation/design-tokens/">design tokens</Link>.
            </TokensPanelMessage>
          )}

          {selectedNode && selectedNode.tree[selectedIndex].tokens.length === 0 && (
            <TokensPanelMessage>No tokens matched.</TokensPanelMessage>
          )}
        </TokensPanel>
      </div>

      {/* Inspector cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          zIndex: '9999',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
      />
    </div>
  );
}

function TokensPanel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', flexGrow: 1, background: '#eee', borderRadius: '8px', marginTop: '8px' }}>
      {children}
    </div>
  );
}

function TokensPanelMessage({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'absolute', top: '50%', width: '100%', textAlign: 'center' }}>
      <Box>{children}</Box>
    </div>
  );
}

function Tokens({ tokens }: { tokens: string[] }) {
  return (
    <ul
      style={{
        listStyle: 'none',
        padding: '0',
        margin: '0',
        background: '#eee',
        borderRadius: '8px',
        marginTop: '8px',
      }}
    >
      {tokens.map(token => (
        <li key={token} style={{ display: 'flex', alignItems: 'center' }}>
          <Box>{token}</Box>
        </li>
      ))}
    </ul>
  );
}

function ElementsTree({
  target,
  tokenIndex,
  onSelect,
}: {
  target: null | InspectedElement;
  tokenIndex: number;
  onSelect: (tokenIndex: number) => void;
}) {
  const tree = [...(target?.tree || [])].reverse();
  while (tree.length < TREE_SIZE) {
    tree.unshift({ name: '...', tokens: [] });
  }

  return (
    <ul
      style={{
        listStyle: 'none',
        padding: '0',
        margin: '0',
        background: '#eee',
        borderRadius: '8px',
        marginTop: '8px',
      }}
    >
      {tree.map((node, index) => (
        <li key={index} style={{ display: 'flex', alignItems: 'center', paddingLeft: index * 4 + 'px' }}>
          <Dash />
          <Box>
            {node.name === '...' ? (
              '...'
            ) : (
              <div style={{ cursor: 'pointer' }} onClick={() => onSelect(TREE_SIZE - 1 - index)}>
                <Box fontWeight={TREE_SIZE - 1 - index === tokenIndex ? 'bold' : 'normal'}>
                  {node.name} ({node.tokens.length})
                </Box>
              </div>
            )}
          </Box>
        </li>
      ))}
    </ul>
  );
}

function Dash() {
  return (
    <div
      style={{
        margin: '4px',
      }}
    >
      -
    </div>
  );
}
