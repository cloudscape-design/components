// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import CodeEditor, { CodeEditorProps } from '~components/code-editor';
import { i18nStrings, themes } from './base-props';

const language = 'javascript';

const codeWithErrorsAndWarnings = `con st pi = 3.14;

function start sdsd() {
    
}
function correct () {
    
}
sdsdasd
.`;

const codeWithLongLines = `// Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
const functionWithVeryLongNameButWhichDoesSomethingVerySimple = (firstParameterWithVeryLongName, secondParameterWithVeryLongName, thirdParameterWithVeryLongName) => {
  // Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  return { firstParameterWithVeryLongName, secondParameterWithVeryLongName, thirdParameterWithVeryLongName }
}
`;

const themesToTest = [...(themes.light as CodeEditorProps.Theme[]), ...(themes.dark as CodeEditorProps.Theme[])];

const permutations = createPermutations<{ theme: CodeEditorProps.Theme; value: string; wrapLines?: boolean }>([
  {
    theme: themesToTest,
    value: [codeWithLongLines],
    wrapLines: [true, false],
  },
  {
    theme: themesToTest,
    value: [codeWithErrorsAndWarnings],
  },
]);

export default function CodeEditorPermutations() {
  const [ace, setAce] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAce() {
      const ace = await import('ace-builds');
      ace.config.set('basePath', './ace/');
      ace.config.set('themePath', './ace/');
      ace.config.set('modePath', './ace/');
      ace.config.set('workerPath', './ace/');
      ace.config.set('useStrictCSP', true);
      return ace;
    }

    loadAce()
      .then(ace => setAce(ace))
      .finally(() => setLoading(false));
  }, []);
  return (
    <article>
      <h1>Code editor permutations</h1>
      <ScreenshotArea style={{ maxWidth: 960 }}>
        <PermutationsView
          permutations={permutations}
          render={({ theme, value, wrapLines }) => (
            <CodeEditor
              ace={ace}
              value={value}
              language={language}
              preferences={{ theme, wrapLines }}
              onPreferencesChange={() => null}
              i18nStrings={i18nStrings}
              loading={loading}
            />
          )}
        />
      </ScreenshotArea>
    </article>
  );
}
