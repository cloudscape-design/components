// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ReactDOM from 'react-dom';

import Token from '../token/internal';

/**
 * Parses text and converts @mentions to Token components.
 */
export const parseTextWithMentions = (text: string): React.ReactNode => {
  const mentionRegex = /(^|\s)@(\w+)(\s?)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(mentionRegex)) {
    const atSymbolIndex = match.index! + match[1].length;

    // Add text before mention
    if (atSymbolIndex > lastIndex) {
      parts.push(text.substring(lastIndex, atSymbolIndex));
    }

    // Add Token
    parts.push(<Token key={`mention-${match.index}`} variant="inline" label={match[2]} />);

    // Add trailing space
    if (match[3]) {
      parts.push(match[3]);
    }

    lastIndex = match.index! + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
};

/**
 * Renders React content into a contentEditable element.
 */
export const renderReactContentToDOM = (
  content: React.ReactNode,
  targetElement: HTMLElement,
  reactContainers: Set<HTMLElement>
): void => {
  // Cleanup
  reactContainers.forEach(container => ReactDOM.unmountComponentAtNode(container));
  reactContainers.clear();
  targetElement.innerHTML = '';

  const renderNode = (node: React.ReactNode, parent: HTMLElement) => {
    if (typeof node === 'string' || typeof node === 'number') {
      parent.appendChild(document.createTextNode(String(node)));
    } else if (React.isValidElement(node)) {
      if (node.type === React.Fragment) {
        renderNode((node.props as any)?.children, parent);
        return;
      }

      const container = document.createElement('span');
      container.style.display = 'inline';
      container.contentEditable = 'false';
      parent.appendChild(container);
      reactContainers.add(container);

      ReactDOM.render(node, container);
    } else if (Array.isArray(node)) {
      node.forEach(child => renderNode(child, parent));
    }
  };

  renderNode(content, targetElement);

  // Ensure cursor can be placed at end
  if (targetElement.lastChild?.nodeType === Node.ELEMENT_NODE) {
    targetElement.appendChild(document.createTextNode(''));
  }
};
