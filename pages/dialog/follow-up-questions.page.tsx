// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Dialog from '~components/dialog';
import FormField from '~components/form-field';
import Pagination from '~components/pagination';
import PromptInput from '~components/prompt-input';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';

import { DialogPage } from './common';

const questions = [
  {
    header: "What's your main goal?",
    options: [
      { value: 'reduce-dev', label: 'Reduce costs for development environments' },
      { value: 'optimize-prod', label: 'Optimize production workload spending' },
    ],
  },
  {
    header: 'Any specific constraints we should know about?',
    options: [
      { value: 'high-availability', label: 'Must maintain high availability' },
      { value: 'always-on', label: 'Need to keep certain instances running 24/7' },
    ],
  },
];

// UC1: a clarifying follow-up flow mid-conversation, mirroring the
// genai-followup/clarify-intent pattern in AWS-UI-Website. Sending a prompt
// surfaces the assistant's clarifying questions as an in-flow dialog: a compact
// Pagination in `headerActions` steps through the questions one at a time while
// the header shows the current question. Each question offers a set of options
// using consumer-owned markup. The chat height is reserved by DialogPage so it
// matches the other examples.
export default function DialogFollowUpQuestionsPage() {
  const [open, setOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [prompt, setPrompt] = useState('');

  const current = questions[questionIndex - 1];

  const handleSend = () => {
    setPrompt('');
    setQuestionIndex(1);
    setAnswers({});
    setOpen(true);
  };

  return (
    <DialogPage title="Dialog — UC1: follow-up questions (chat)">
      <SpaceBetween size="m">
        {open && (
          <Dialog
            header={current.header}
            headerActions={
              <Pagination
                pagesVariant="compact"
                currentPageIndex={questionIndex}
                pagesCount={questions.length}
                onChange={event => setQuestionIndex(event.detail.currentPageIndex)}
                ariaLabels={{
                  nextPageLabel: 'Next question',
                  previousPageLabel: 'Previous question',
                  pageLabel: pageNumber => `Question ${pageNumber}`,
                }}
                i18nStrings={{ pagesCompactText: ({ currentPage, pagesCount }) => `${currentPage} of ${pagesCount}` }}
              />
            }
            i18nStrings={{ dismissAriaLabel: 'Close' }}
            onDismiss={() => setOpen(false)}
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setOpen(false)}>Skip</Button>
              </div>
            }
          >
            <FormField label="Select the option that best matches your intent">
              <RadioGroup
                value={answers[questionIndex] ?? null}
                onChange={({ detail }) => setAnswers(prev => ({ ...prev, [questionIndex]: detail.value }))}
                items={current.options}
              />
            </FormField>
          </Dialog>
        )}

        <PromptInput
          value={prompt}
          onChange={({ detail }) => setPrompt(detail.value)}
          onAction={handleSend}
          placeholder="Ask a question"
          actionButtonAriaLabel="Send message"
          actionButtonIconName="send"
        />
      </SpaceBetween>
    </DialogPage>
  );
}
