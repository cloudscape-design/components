// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, FileUpload, Link, SpaceBetween, Toggle } from '~components';

import { groupBy, startCase, sortBy } from 'lodash';
import { Token } from './styles-mapping';
import { getElementContext, getElementName, getElementTokens, readTokenValue } from './element-utils';
import {
  Theme,
  applyTheme,
  createDefaultTheme,
  createThemeReader,
  exportTheme,
  importTheme,
  setThemeToken,
} from './theme-utils';
import clsx from 'clsx';
import { ColorIndicator, ValueEditor } from './value-editor';
import styles from './styles.scss';

const TREE_SIZE = 4;

interface TreeElement {
  name: string;
  node: Element;
  tokens: Token[];
  context: string | null;
}

interface InspectedElement {
  node: Element;
  tree: TreeElement[];
}

interface InspectorPanelProps {
  onClose: () => void;
}

export function InspectorPanel({ onClose }: InspectorPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<null | InspectedElement>(null);

  const [inspectorEnabled, setInspectorEnabled] = useState(false);
  const [selectedNode, setSelectedNode] = useState<null | InspectedElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [theme, setTheme] = useState(createDefaultTheme());

  const setTokenValue = (token: string, value: null | string, context: null | string = null) => {
    setTheme(theme => setThemeToken(theme, token, value, context));
  };

  const onHoverToken = (node: null | Element) => {
    const cursor = cursorRef.current;
    if (!cursor) {
      return;
    }

    if (!node) {
      cursor.style.visibility = 'hidden';
      return;
    }

    const elementRect = node.getBoundingClientRect();
    cursor.style.visibility = 'visible';
    cursor.style.left = elementRect.left + 'px';
    cursor.style.top = elementRect.top + 'px';
    cursor.style.width = elementRect.width + 'px';
    cursor.style.height = elementRect.height + 'px';
    cursor.style.background = 'rgba(129, 204, 185, 0.33)';
    cursor.style.border = '1px solid #5dbda5';
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

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
        if (!inspectorEnabled) {
          return;
        }

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
            tree.push({
              name: elementName,
              node: current,
              tokens: getElementTokens(current),
              context: getElementContext(current),
            });

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
          if (inspectorEnabled) {
            event.stopPropagation();
            event.preventDefault();
          }

          // Delay so that onClick fires before it.
          setTimeout(() => {
            setInspectorEnabled(false);
          }, 100);
        }
        if (cursor) {
          cursor.style.background = '';
          cursor.style.border = '';
        }
      }

      function onClick(event: MouseEvent) {
        if (targetRef.current && event.target instanceof Element && !panelRef.current?.contains(event.target)) {
          if (inspectorEnabled) {
            event.stopPropagation();
            event.preventDefault();
          }
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
    <div ref={panelRef} className={styles['panel-body']}>
      <div style={{ position: 'absolute', top: '6px', right: '4px' }}>
        <Button onClick={onClose} variant="icon" iconName="close" />
      </div>

      <div className={styles['panel-content']}>
        <Box variant="h3">Theme configurator</Box>
        <Toggle onChange={({ detail }) => setInspectorEnabled(detail.checked)} checked={inspectorEnabled}>
          Elements inspector
        </Toggle>

        <ElementsTree
          target={selectedNode}
          tokenIndex={selectedIndex}
          onSelect={index => setSelectedIndex(index)}
          onHoverToken={onHoverToken}
        />

        <TokensPanel>
          {selectedNode && selectedNode.tree[selectedIndex].tokens.length > 0 && (
            <Tokens
              tokens={selectedNode.tree[selectedIndex].tokens}
              theme={theme}
              setTokenValue={setTokenValue}
              context={selectedNode.tree[selectedIndex].context}
              element={selectedNode.tree[selectedIndex].node}
            />
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

        <div className={styles['panel-footer']}>
          <FileUpload
            multiple={false}
            accept="application/json"
            value={[]}
            onChange={({ detail }) => {
              if (detail.value[0]) {
                importTheme(detail.value[0], setTheme);
              }
            }}
            i18nStrings={{
              uploadButtonText: () => 'Import theme',
              dropzoneText: () => 'Drop file to upload',
              removeFileAriaLabel: () => 'Remove file',
              limitShowFewer: 'Show fewer files',
              limitShowMore: 'Show more files',
              errorIconAriaLabel: 'Error',
            }}
          />
          <Button iconName="download" onClick={() => exportTheme(theme)}>
            Export theme
          </Button>
        </div>
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
  return <div style={{ position: 'relative', flexGrow: 1, background: 'transparent' }}>{children}</div>;
}

function TokensPanelMessage({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: '24px 0', width: '100%', textAlign: 'center' }}>
      <Box>{children}</Box>
    </div>
  );
}

function Tokens({
  tokens,
  theme,
  setTokenValue,
  context,
  element,
}: {
  tokens: Token[];
  theme: Theme;
  setTokenValue: (tokenName: string, value: null | string, context: null | string) => void;
  context: null | string;
  element: Element;
}) {
  const themeReader = createThemeReader(theme, context);

  const publicTokens = groupBy(
    tokens.filter(t => t.description),
    'section'
  );

  const privateTokens = groupBy(
    tokens.filter(t => !t.description),
    'section'
  );

  return (
    <SpaceBetween size="s">
      {Object.keys(publicTokens).map(section => (
        <div key={section}>
          <Box variant="h4">{startCase(section.toLowerCase())}</Box>
          <ul
            style={{
              background: 'transparent',
            }}
            className={styles['elements-list']}
          >
            {sortBy(publicTokens[section], token => token.name).map(token => {
              const value = themeReader(token.name) ?? readTokenValue(element, token.cssName);
              return (
                <li key={token.name} style={{ display: 'flex', margin: 0, padding: '8px 0px' }}>
                  <ValueEditor
                    token={token.name}
                    value={value}
                    onChange={value => setTokenValue(token.name, value, context)}
                  />

                  <Box margin={{ left: 'xs' }}>
                    <SpaceBetween size="xxs">
                      <Box>{token.name}</Box>
                      <Box fontSize="body-s" color="text-body-secondary">
                        {token.description}
                      </Box>
                    </SpaceBetween>
                  </Box>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <details style={{ paddingTop: '8px' }}>
        <summary>
          <Box variant="h4" display="inline">
            Non-themeable tokens
          </Box>
        </summary>
        <>
          <Box variant="small" padding={{ top: 'xxs' }}>
            The following tokens are present, but are not currently themeable.{' '}
            <Link
              fontSize="inherit"
              href="https://issues.amazon.com/issues/create?template=430f4503-b29d-4a2f-b8a7-656afbb35c39"
            >
              Open a feature request
            </Link>{' '}
            detailing your use case if you need one added.
          </Box>
          {Object.keys(privateTokens).map(section => (
            <div key={section}>
              <Box variant="h4">{startCase(section.toLowerCase())}</Box>
              <ul
                style={{
                  background: 'transparent',
                }}
                className={styles['elements-list']}
              >
                {sortBy(privateTokens[section], token => token.name).map(token => {
                  const value = themeReader(token.name) ?? readTokenValue(element, token.cssName);
                  return (
                    <li key={token.name} style={{ display: 'flex', margin: 0, padding: '8px 0px' }}>
                      {token.name.startsWith('color') ? (
                        <ColorIndicator color={value} />
                      ) : (
                        <Box color="text-body-secondary">{value}</Box>
                      )}
                      <Box margin={{ left: 'xs' }}>{token.name}</Box>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </>
      </details>
    </SpaceBetween>
  );
}

function ElementsTree({
  target,
  tokenIndex,
  onSelect,
  onHoverToken,
}: {
  target: null | InspectedElement;
  tokenIndex: number;
  onSelect: (tokenIndex: number) => void;
  onHoverToken: (node: null | Element) => void;
}) {
  const tree = [...(target?.tree || [])].reverse();
  while (tree.length < TREE_SIZE) {
    tree.unshift({ name: '...', tokens: [], node: null as any, context: null });
  }

  return (
    <ul className={clsx(styles['elements-list'], styles['elements-tree'])}>
      {tree.map((node, index) => (
        <li
          key={index}
          style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', paddingLeft: index * 4 + 'px' }}
          onMouseEnter={() => {
            onHoverToken(node.node);
          }}
          onMouseLeave={() => {
            onHoverToken(null);
          }}
        >
          <Dash />
          <Box>
            {node.name === '...' ? (
              '...'
            ) : (
              <div style={{ cursor: 'pointer' }} onClick={() => onSelect(TREE_SIZE - 1 - index)}>
                <Box fontWeight={TREE_SIZE - 1 - index === tokenIndex ? 'bold' : 'normal'}>
                  <span>
                    {node.name} ({node.tokens.length})
                  </span>
                  {node.context ? <i style={{ float: 'right', fontSize: '12px' }}>context: {node.context}</i> : ''}
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
        fontSize: '12px',
      }}
    >
      <Box>—</Box>
    </div>
  );
}
