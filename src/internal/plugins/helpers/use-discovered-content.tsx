// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode, useEffect, useRef, useState } from 'react';

import {
  AlertFlashContentController,
  AlertFlashContentResult,
  ReplacementTypeSafe,
} from '../controllers/alert-flash-content';

export function createUseDiscoveredContent(onContentRegistered: AlertFlashContentController['onContentRegistered']) {
  return function useDiscoveredContent({
    type,
    header,
    children,
  }: {
    type: string;
    header: ReactNode;
    children: ReactNode;
  }) {
    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const replacementHeaderRef = useRef<HTMLDivElement>(null);
    const replacementContentRef = useRef<HTMLDivElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const [foundHeaderReplacement, setFoundHeaderReplacement] = useState<ReplacementTypeSafe>('original');
    const [foundContentReplacement, setFoundContentReplacement] = useState<ReplacementTypeSafe>('original');
    const mountedProvider = useRef<AlertFlashContentResult | undefined>();

    const context = {
      type,
      headerRef,
      contentRef,
      actionsRef,
    };

    useEffect(() => {
      return onContentRegistered(provider => {
        let mounted = true;

        mountedProvider.current = provider?.runReplacer(context, (type, replacement) => {
          if (!mounted) {
            console.warn(
              `[AwsUi] [Runtime alert/flash content] \`registerReplacement\` (${type}) called after component unmounted`
            );
            return;
          }
          switch (type) {
            case 'header':
              if (typeof replacement === 'function') {
                replacement(replacementHeaderRef.current!);
                setFoundHeaderReplacement(true);
              } else {
                setFoundHeaderReplacement(replacement);
              }
              break;
            case 'content':
              if (typeof replacement === 'function') {
                replacement(replacementContentRef.current!);
                setFoundContentReplacement(true);
              } else {
                setFoundContentReplacement(replacement);
              }
          }
        });

        return () => {
          mountedProvider.current?.unmount({
            replacementHeaderContainer: replacementHeaderRef.current!,
            replacementContentContainer: replacementContentRef.current!,
          });
          mounted = false;
        };
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
      mountedProvider.current?.update();
    }, [type, header, children]);

    return {
      hasReplacementHeader: foundHeaderReplacement,
      hasReplacementContent: foundContentReplacement,
      headerRef,
      replacementHeaderRef,
      contentRef,
      replacementContentRef,
      actionsRef,
    };
  };
}
