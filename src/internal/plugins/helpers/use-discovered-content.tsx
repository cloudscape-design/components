// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode, useEffect, useRef, useState } from 'react';

import {
  AlertFlashContentController,
  AlertFlashContentResult,
  ReplacementTypeSafe,
} from '../controllers/alert-flash-content';

export function createUseDiscoveredContent(
  componentName: string,
  onContentRegistered: AlertFlashContentController['onContentRegistered']
) {
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
    const [foundHeaderReplacement, setFoundHeaderReplacement] = useState<ReplacementTypeSafe>('original');
    const [foundContentReplacement, setFoundContentReplacement] = useState<ReplacementTypeSafe>('original');
    const mountedProvider = useRef<AlertFlashContentResult | undefined>();

    useEffect(() => {
      const context = { type, headerRef, contentRef };

      return onContentRegistered(provider => {
        let mounted = true;

        mountedProvider.current = provider?.runReplacer(context, (type, replacement) => {
          if (!mounted) {
            console.warn(
              `[AwsUi] [Runtime ${componentName} content] \`registerReplacement\` (${type}) called after component unmounted`
            );
            return;
          }
          switch (type) {
            case 'header':
              if (replacement.type === 'replace') {
                replacement.onReplace(replacementHeaderRef.current!);
                setFoundHeaderReplacement(true);
              } else {
                setFoundHeaderReplacement(replacement.type);
              }
              break;
            case 'content':
              if (replacement.type === 'replace') {
                replacement.onReplace(replacementContentRef.current!);
                setFoundContentReplacement(true);
              } else {
                setFoundContentReplacement(replacement.type);
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
    }, [type]);

    useEffect(() => {
      mountedProvider.current?.update();
    }, [type, header, children]);

    return {
      hasReplacementHeader: foundHeaderReplacement,
      hasReplacementContent: foundContentReplacement,
      headerRef: headerRef as React.Ref<HTMLDivElement>,
      replacementHeaderRef: replacementHeaderRef as React.Ref<HTMLDivElement>,
      contentRef: contentRef as React.Ref<HTMLDivElement>,
      replacementContentRef: replacementContentRef as React.Ref<HTMLDivElement>,
    };
  };
}
