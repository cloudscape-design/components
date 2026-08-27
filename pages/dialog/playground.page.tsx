// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import Dialog from '~components/dialog';
import FormField from '~components/form-field';
import Pagination from '~components/pagination';
import PromptInput from '~components/prompt-input';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';

import { SimplePage } from '../app/templates';
import { DialogDemo } from './common';

const questions = [
  {
    header: "What's your main goal?",
    options: [
      { value: 'reduce-dev', label: 'Reduce costs for development environments' },
      { value: 'optimize-prod', label: 'Optimize production workload spending' },
    ],
  },
  {
    header: 'Which environment should we prioritize?',
    options: [
      { value: 'development', label: 'Development' },
      { value: 'production', label: 'Production' },
    ],
  },
  {
    header: 'Are there any availability constraints?',
    options: [
      { value: 'high-availability', label: 'Must maintain high availability' },
      { value: 'always-on', label: 'Some instances must remain available at all times' },
    ],
  },
];

export default function DialogPlaygroundPage() {
  const [open, setOpen] = useState(false);
  const [showHeaderActions, setShowHeaderActions] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [longHeader, setLongHeader] = useState(false);
  const [longContent, setLongContent] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [prompt, setPrompt] = useState('');

  const currentQuestion = questions[questionIndex - 1];

  const openDialog = () => {
    setPrompt('');
    setQuestionIndex(1);
    setAnswers({});
    setOpen(true);
  };

  const continueDialog = () => {
    if (questionIndex < questions.length) {
      setQuestionIndex(current => current + 1);
    } else {
      setOpen(false);
    }
  };

  const controls = (
    <SpaceBetween size="s">
      <Toggle checked={open} onChange={({ detail }) => (detail.checked ? openDialog() : setOpen(false))}>
        Dialog open
      </Toggle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <Checkbox checked={showHeaderActions} onChange={({ detail }) => setShowHeaderActions(detail.checked)}>
          Header actions
        </Checkbox>
        <Checkbox checked={showContent} onChange={({ detail }) => setShowContent(detail.checked)}>
          Content
        </Checkbox>
        <Checkbox checked={showFooter} onChange={({ detail }) => setShowFooter(detail.checked)}>
          Footer
        </Checkbox>
        <Checkbox checked={longHeader} onChange={({ detail }) => setLongHeader(detail.checked)}>
          Long header
        </Checkbox>
        <Checkbox checked={longContent} onChange={({ detail }) => setLongContent(detail.checked)}>
          Long content
        </Checkbox>
        <Checkbox checked={narrow} onChange={({ detail }) => setNarrow(detail.checked)}>
          Narrow width
        </Checkbox>
      </div>
    </SpaceBetween>
  );

  return (
    <SimplePage title="Dialog: Playground" settings={controls}>
      <DialogDemo>
        <SpaceBetween size="m">
          {open && (
            <div style={{ maxInlineSize: narrow ? 320 : undefined }}>
              <Dialog
                header={
                  longHeader
                    ? 'Tell us which production workload and deployment environment you want to optimize first'
                    : currentQuestion.header
                }
                headerActions={
                  showHeaderActions ? (
                    <Pagination
                      pagesVariant="compact"
                      currentPageIndex={questionIndex}
                      pagesCount={questions.length}
                      onChange={({ detail }) => setQuestionIndex(detail.currentPageIndex)}
                      ariaLabels={{
                        nextPageLabel: 'Next question',
                        previousPageLabel: 'Previous question',
                        pageLabel: pageNumber => `Question ${pageNumber}`,
                      }}
                      i18nStrings={{
                        pagesCompactText: ({ currentPage, pagesCount }) => `${currentPage} of ${pagesCount}`,
                      }}
                    />
                  ) : undefined
                }
                i18nStrings={{ dismissAriaLabel: 'Close' }}
                onDismiss={() => setOpen(false)}
                footer={
                  showFooter ? (
                    <Box float="right">
                      <SpaceBetween direction="horizontal" size="xs">
                        <Button onClick={() => setOpen(false)}>Skip</Button>
                        <Button variant="primary" onClick={continueDialog}>
                          {questionIndex === questions.length ? 'Finish' : 'Continue'}
                        </Button>
                      </SpaceBetween>
                    </Box>
                  ) : undefined
                }
              >
                {showContent ? (
                  <SpaceBetween size="m">
                    <FormField label="Select the option that best matches your intent">
                      <RadioGroup
                        value={answers[questionIndex] ?? null}
                        onChange={({ detail }) =>
                          setAnswers(current => ({ ...current, [questionIndex]: detail.value }))
                        }
                        items={currentQuestion.options}
                      />
                    </FormField>
                    {longContent && (
                      <Box variant="p">
                        This longer content verifies wrapping, responsive width, section spacing, and focus movement
                        between Dialog and the surrounding page.
                      </Box>
                    )}
                  </SpaceBetween>
                ) : null}
              </Dialog>
            </div>
          )}

          <PromptInput
            value={prompt}
            onChange={({ detail }) => setPrompt(detail.value)}
            onAction={openDialog}
            placeholder="Ask a question"
            actionButtonAriaLabel="Send message"
            actionButtonIconName="send"
          />
        </SpaceBetween>
      </DialogDemo>
    </SimplePage>
  );
}
