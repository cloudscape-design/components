// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { Box, Button, FileUpload, Input, Link, Popover, SpaceBetween, Toggle } from '~components';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokenMapping from './tokens-mapping.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tokenDict from './tokens-descriptions.json';
import { cloneDeep, groupBy, uniqBy, startCase, sortBy } from 'lodash';
import { applyTheme } from '~components/theming';
import { componentsMap } from './component-tokens-mapping';

interface Token {
  section: string;
  name: string;
  cssName: string;
  description?: string;
}

function readTokenValue(element: Element, cssTokenName: string): string {
  return window.getComputedStyle(element).getPropertyValue(cssTokenName) ?? '';
}

function getTokenDescription(tokenName: string): string {
  const description = tokenDict[tokenName]?.description;
  return description;
}

const stylesMapping = Object.entries(tokenMapping)
  .map(([selector, tokenByState]: any) => ({
    selector,
    tokens: Object.entries(tokenByState).flatMap(([key, tokens]: any) =>
      tokens.map((token: { name: string; cssName: string }) => ({
        section: key,
        name: token.name,
        cssName: token.cssName,
        description: getTokenDescription(token.name),
      }))
    ),
  }))
  .filter(({ selector }) => selector.trim()) as { selector: string; tokens: Token[] }[];

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

function getElementTokens(element: Element): Token[] {
  const tokens: Token[] = [];
  for (const style of stylesMapping) {
    try {
      if (element.matches(style.selector)) {
        tokens.push(...style.tokens);
      }
    } catch (error) {
      console.warn(`Invalid selector: "${style.selector}".`);
    }
  }
  return uniqBy(tokens, token => token.section + ':' + token.name);
}

function getComponentSegmentName(element: Element): string {
  const segmentNames = [
    'action',
    'area',
    'bar',
    'body',
    'button',
    'container',
    'content',
    'footer',
    'group',
    'header',
    'list',
    'panel',
    'section',
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

function getElementContext(element: Element): null | string {
  let current: null | Element = element;
  while (current) {
    const contextClassName = Array.from(current.classList).find(className => className.startsWith('awsui-context-'));
    if (contextClassName) {
      return contextClassName.slice('awsui-context-'.length);
    }
    current = current.parentElement;
  }
  return null;
}

interface Theme {
  tokens: Record<string, string | { light: string; dark: string }>;
  contexts: {
    'compact-table': { tokens: Record<string, string | { light: string; dark: string }> };
    'top-navigation': { tokens: Record<string, string | { light: string; dark: string }> };
    flashbar: { tokens: Record<string, string | { light: string; dark: string }> };
  };
}

export function InspectorPanel({ onClose }: InspectorPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<null | InspectedElement>(null);

  const [inspectorEnabled, setInspectorEnabled] = useState(false);
  const [selectedNode, setSelectedNode] = useState<null | InspectedElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [theme, setTheme] = useState<Theme>({
    tokens: {},
    contexts: { 'compact-table': { tokens: {} }, 'top-navigation': { tokens: {} }, flashbar: { tokens: {} } },
  });

  const setTokenValue = (tokenName: string, value: string, context: null | string = null, scope: 'light' | 'dark') => {
    setTheme(prev => {
      const next = cloneDeep(prev);
      const tokens =
        context === 'compact-table' || context === 'top-navigation' || context === 'flashbar'
          ? next.contexts[context].tokens
          : next.tokens;
      const currValue = tokens[tokenName];
      const currValueObj =
        typeof currValue === 'object' ? { ...currValue } : { light: currValue ?? value, dark: currValue ?? value };
      tokens[tokenName] = scope ? { ...currValueObj, [scope]: value } : value;
      return next;
    });
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
    const isVR = !!document.querySelector('.awsui-visual-refresh');
    applyTheme({ theme, baseThemeId: isVR ? 'visual-refresh' : undefined });
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
    <div
      ref={panelRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '8px',
        boxSizing: 'border-box',
        position: 'relative',
        borderLeft: '1px solid #000000',
      }}
    >
      <div style={{ position: 'absolute', top: '6px', right: '4px' }}>
        <Button onClick={onClose} variant="icon" iconName="close" />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          height: '100%',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
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

        <div
          style={{
            backgroundColor: '#eee',
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box',
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
          }}
        >
          <FileUpload
            multiple={false}
            accept="application/json"
            value={[]}
            onChange={({ detail }) => {
              if (detail.value[0]) {
                const reader = new FileReader();

                reader.onload = event => {
                  const result = event.target?.result;
                  const theme = JSON.parse(typeof result === 'string' ? result : '{}');
                  setTheme(theme);
                };

                reader.readAsText(detail.value[0]);
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
          <Button
            iconName="download"
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(theme));
              const downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute('href', dataStr);
              downloadAnchorNode.setAttribute('download', 'theme.json');
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            }}
          >
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
  setTokenValue: (tokenName: string, value: string, context: null | string, scope: 'light' | 'dark') => void;
  context: null | string;
  element: Element;
}) {
  const isDarkMode = !!document.querySelector('[class=awsui-dark-mode]');

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
              ...sharedPanelStyles,
              background: 'transparent',
            }}
          >
            {sortBy(publicTokens[section], token => token.name).map(token => {
              const themeValue =
                context === 'compact-table' || context === 'top-navigation' || context === 'flashbar'
                  ? theme.contexts[context].tokens[token.name]
                  : theme.tokens[token.name];
              const themeValueStr =
                typeof themeValue === 'object' ? themeValue[isDarkMode ? 'dark' : 'light'] : themeValue;
              const value = themeValueStr ?? readTokenValue(element, token.cssName);
              return (
                <li key={token.name} style={{ display: 'flex', margin: 0, padding: '8px 0px' }}>
                  {token.name.startsWith('color') ? (
                    <EditorPopover
                      tokenName={token.name}
                      control={
                        <ColorPicker
                          color={value}
                          onSetColor={value => setTokenValue(token.name, value, context, isDarkMode ? 'dark' : 'light')}
                        />
                      }
                    >
                      <ColorIndicator color={value} />
                    </EditorPopover>
                  ) : (
                    <EditorPopover
                      tokenName={token.name}
                      control={
                        <Input
                          value={value}
                          onChange={e =>
                            setTokenValue(token.name, e.detail.value, context, isDarkMode ? 'dark' : 'light')
                          }
                        />
                      }
                    >
                      {token.name.includes('borderRadius') ? (
                        <RadiusPreview radius={value || '4px'} />
                      ) : token.name.includes('fontFamily') ? (
                        <FontPreview family={value} />
                      ) : (
                        '??'
                      )}
                    </EditorPopover>
                  )}
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
                  ...sharedPanelStyles,
                  background: 'transparent',
                }}
              >
                {sortBy(privateTokens[section], token => token.name).map(token => {
                  const themeValue =
                    context === 'compact-table' || context === 'top-navigation' || context === 'flashbar'
                      ? theme.contexts[context].tokens[token.name]
                      : theme.tokens[token.name];
                  const themeValueStr =
                    typeof themeValue === 'object' ? themeValue[isDarkMode ? 'dark' : 'light'] : themeValue;
                  const value = themeValueStr ?? readTokenValue(element, token.cssName);
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

const EditorPopover = ({
  children,
  tokenName,
  control,
}: {
  children: ReactNode;
  tokenName: string;
  control: ReactNode;
}) => {
  function getTokenComponents(token: string) {
    const components: string[] = [];
    for (const [key, value] of Object.entries(componentsMap)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      value.length > 0 && value.includes(token) && components.push(key);
    }
    return components;
  }

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
          {control}
        </SpaceBetween>
      }
      triggerType="custom"
    >
      {children}
    </Popover>
  );
};

function ColorPicker({ color, onSetColor }: { color: string; onSetColor: (value: string) => void }) {
  return (
    <SpaceBetween size="xs" direction="vertical">
      <input type="color" value={color} onChange={e => onSetColor(e.target.value)} />
    </SpaceBetween>
  );
}
const sharedPanelStyles = {
  listStyle: 'none',
  padding: '0px 8px',
  margin: '0',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
};

const previewBaseStyles = {
  width: 20,
  height: 20,
  marginTop: '2px',
  padding: 0,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#879596',
  borderStyle: 'solid',
  background: 'transparent',
};

function ColorIndicator({ color }: { color: string }) {
  return (
    <button
      style={{
        appearance: 'none',
        ...previewBaseStyles,
        background: color,
      }}
    />
  );
}

function RadiusPreview({ radius }: { radius: string }) {
  return (
    <button
      style={{
        appearance: 'none',
        ...previewBaseStyles,
        borderRadius: radius,
        borderWidth: 2,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
      }}
    />
  );
}

function FontPreview({ family }: { family: string }) {
  return (
    <button
      style={{
        appearance: 'none',
        ...previewBaseStyles,
        marginTop: 0,
        border: 0,
        fontFamily: family,
        fontSize: '16px',
      }}
    >
      Aa
    </button>
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
    <ul
      style={{
        ...sharedPanelStyles,
        background: '#f4f4f4',
        padding: '4px 8px',
      }}
    >
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
      —
    </div>
  );
}
