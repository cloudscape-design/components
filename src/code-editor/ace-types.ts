// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as Ace from 'ace-builds';

export type AceObject = typeof Ace;

declare module 'ace-builds' {
  namespace Ace {
    interface TextInput {
      getElement(): HTMLTextAreaElement;
    }

    interface MouseEvent {
      editor: Ace.Editor;
      stop(): void;
      getDocumentPosition(): Ace.Point;
    }

    interface GutterKeyboardEvent {
      getKey(): string;
      getRow(): number;
      isInAnnotationLane(): boolean;
    }

    interface Tooltip {
      hide(): void;
    }

    interface Editor {
      on(name: 'gutterclick', callback: (e: Ace.MouseEvent) => void): void;
      on(name: 'showGutterTooltip', callback: (e: Ace.Tooltip) => void): void;
    }

    interface EditSession {
      on(name: 'changeAnnotation', callback: () => void): void;
    }
  }
}

export function isAceLike(ace: any): ace is AceObject {
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  return (
    typeof ace.version === 'string' &&
    typeof ace.edit === 'function' &&
    typeof ace.config === 'object' &&
    typeof ace.config.loadModule === 'function' &&
    typeof ace.Range === 'function'
  );
  /* eslint-enable @typescript-eslint/no-unsafe-member-access */
}
