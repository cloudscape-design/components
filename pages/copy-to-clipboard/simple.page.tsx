// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Box, SpaceBetween, CopyToClipboard } from '~components';
import pseudoRandom from '../utils/pseudo-random';
import ScreenshotArea from '../utils/screenshot-area';

const i18nStrings = {
  copyButtonText: 'Copy',
};

const paragraphs = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris elementum metus sem, fringilla feugiat leo lacinia sed. Integer a nulla in tellus fermentum gravida. In diam augue, venenatis non augue ac, fermentum molestie nunc. Quisque semper blandit ultricies. Ut auctor lobortis velit, et faucibus velit pharetra vel. Maecenas ut maximus massa, vel lobortis velit. Morbi sollicitudin hendrerit odio eu dictum. Donec cursus est at orci sagittis, vel bibendum tortor efficitur. Duis cursus mi et pellentesque ornare. Vivamus ultrices at leo sit amet malesuada. Pellentesque imperdiet ligula sed dolor ornare, non rutrum tellus ultricies.',
  'Morbi ut congue nunc. Cras malesuada ut enim et consectetur. Sed sed dui nulla. Duis tincidunt at ante at egestas. Vestibulum sapien erat, fermentum et quam nec, sodales aliquam purus. Sed tristique vitae massa non vehicula. In hac habitasse platea dictumst. Nunc non ultricies arcu. Mauris pretium bibendum neque, ut mattis mi rhoncus sit amet. Integer pulvinar maximus vehicula.',
  'Sed ac bibendum elit, commodo venenatis leo. Ut a erat quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed venenatis mi sed mollis laoreet. Vivamus aliquam ex id diam convallis molestie non faucibus turpis. Nullam scelerisque aliquam mi nec interdum. Nunc at tortor venenatis, facilisis arcu a, porta libero. Cras efficitur mauris in pulvinar posuere. Pellentesque eu enim at risus efficitur blandit. Nulla a massa id felis vestibulum faucibus sit amet nec lacus. Aliquam ultricies placerat urna, ac ultricies orci vehicula at. Duis vulputate magna vitae enim ornare porttitor. Sed auctor vehicula tristique. Ut vitae mattis dolor. Donec sollicitudin ornare auctor. Donec maximus lacinia quam sed euismod.',
];

const sentence = paragraphs[0].split('.')[0];

const invalidSentence = sentence
  .split('')
  .map(letter => (pseudoRandom() > 0.8 ? '_' : letter))
  .join('');

export default function DateInputScenario() {
  return (
    <ScreenshotArea>
      <Box>
        <SpaceBetween size="l">
          <h1>Copy to clipboard</h1>

          <div style={{ display: 'flex', gap: 16 }}>
            <article>
              {paragraphs.map((text, index) => (
                <Box variant="p" key={index}>
                  {text}
                </Box>
              ))}
            </article>

            <CopyToClipboard
              message="Lorem ipsum copied"
              onClick={() => navigator.clipboard.writeText(paragraphs.join('\n\n'))}
              i18nStrings={i18nStrings}
              data-testid="copy-paragraph"
            />
          </div>

          <Box>
            <CopyToClipboard
              variant="inline"
              message="Lorem ipsum copied"
              ariaLabel="Copy lorem ipsum"
              onClick={() => navigator.clipboard.writeText(sentence)}
              i18nStrings={i18nStrings}
              data-testid="copy-sentence"
            />

            <span>{sentence}</span>
          </Box>

          <Box>
            <CopyToClipboard
              variant="inline"
              messageType="error"
              message="Lorem ipsum failed to copy"
              ariaLabel="Copy lorem ipsum"
              onClick={() => {}}
              i18nStrings={i18nStrings}
              data-testid="copy-sentence-with-error"
            />

            <span>{invalidSentence}</span>
          </Box>
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
