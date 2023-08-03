// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Ace } from 'ace-builds';
import { useEffect, useRef, useState } from 'react';
import { getAceTheme, getDefaultConfig, getDefaultTheme } from './util';

export function useEditor(ace: any, loading?: boolean) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<null | Ace.Editor>(null);

  useEffect(() => {
    const elem = editorRef.current;
    if (!ace || !elem) {
      return;
    }
    const config = getDefaultConfig(ace);
    setEditor(
      ace.edit(elem, {
        ...config,
        theme: getAceTheme(getDefaultTheme(elem)),
      })
    );
  }, [ace, loading]);

  return { editorRef, editor };
}
