// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SupportPromptGroup, { SupportPromptGroupProps } from '@cloudscape-design/chat-components/support-prompt-group';
import CodeView from '@cloudscape-design/code-view/code-view';
// @ts-ignore
import typescriptHighlight from '@cloudscape-design/code-view/highlight/typescript';

import Box from '~components/box';
import CopyToClipboard from '~components/copy-to-clipboard';
import ExpandableSection from '~components/expandable-section';
import { FileTokenGroupProps } from '~components/file-token-group';
import Link from '~components/link';
import Popover from '~components/popover';
import SpaceBetween from '~components/space-between';
import TextContent from '~components/text-content';

export type Message = ChatBubbleMessage | AlertMessage;

interface ChatBubbleMessage {
  type: 'chat-bubble';
  authorId: string;
  content: React.ReactNode;
  timestamp: string;
  actions?: 'feedback' | 'code-view';
  hideAvatar?: boolean;
  avatarLoading?: boolean;
  files?: File[];
  supportPrompts?: React.ReactNode;
  showFeedbackDialog?: boolean;
  contentToCopy?: string;
}

interface AlertMessage {
  type: 'alert';
  content: React.ReactNode;
  header?: string;
}

export const supportPromptItems = [
  {
    text: 'What else can I do with TypeScript?',
    id: 'typescript',
  },
  {
    text: 'How would I add parameters and type checking to this function?',
    id: 'expand',
  },
];

export const responseList = (
  <TextContent>
    <ol>
      <li>To see how an incoming response from generative AI is displayed, ask "Show a loading state example".</li>
      <li>To see an error alert that appears when something goes wrong, ask "Show an error state example".</li>
      <li>To see a how a file upload is displayed, upload one or more files.</li>
      <li>To see support prompts, ask "Show support prompts".</li>
    </ol>
  </TextContent>
);

// added as function so that timestamp is evaluated when function is called
export const getInvalidPromptResponse = (): Message => ({
  type: 'chat-bubble',
  authorId: 'gen-ai',
  content: (
    <>
      The interactions and functionality of this demo are limited.
      {responseList}
    </>
  ),
  timestamp: new Date().toLocaleTimeString(),
  actions: 'feedback',
  contentToCopy: `The interactions and functionality of this demo are limited.
 1. To see how an incoming response from generative AI is displayed, ask "Show a loading state example".
 2. To see an error alert that appears when something goes wrong, ask "Show an error state example".
 3. To see a how a file upload is displayed, upload one or more files.
 4. To see support prompts, ask "Show support prompts".`,
});

export const getLoadingMessage = (): Message => ({
  type: 'chat-bubble',
  authorId: 'gen-ai',
  content: <Box color="text-status-inactive">Generating a response</Box>,
  timestamp: new Date().toLocaleTimeString(),
  avatarLoading: true,
});

const getFileResponseMessage = (): Message => ({
  type: 'chat-bubble',
  authorId: 'gen-ai',
  content:
    'I see you have uploaded one or more files. I cannot parse the files right now, but you can see what uploaded files look like.',
  timestamp: new Date().toLocaleTimeString(),
  avatarLoading: false,
  actions: 'feedback',
  contentToCopy:
    'I see you have uploaded one or more files. I cannot parse the files right now, but you can see what uploaded files look like.',
});

const getLoadingStateResponseMessage = (): Message => ({
  type: 'chat-bubble',
  authorId: 'gen-ai',
  content: 'That was the loading state. To see the loading state again, ask "Show a loading state example".',
  timestamp: new Date().toLocaleTimeString(),
  avatarLoading: false,
  actions: 'feedback',
  contentToCopy: 'That was the loading state. To see the loading state again, ask "Show a loading state example".',
});

const getErrorStateResponseMessage = (): Message => ({
  type: 'alert',
  header: 'Access denied',
  content: (
    <SpaceBetween size="s">
      <span>
        You don't have permission to [AWSS3:ListBuckets]. To request access, copy the following text and send it to your
        AWS administrator.{' '}
        <Link href="#" external={true} variant="primary">
          Learn more about troubleshooting access denied errors.
        </Link>
      </span>
      <div className="access-denied-alert-wrapper">
        <div className="access-denied-alert-wrapper__box">
          <SpaceBetween size="xxxs">
            <Box variant="code">
              <div>User: [arn:aws:iam::123456789000:user/awsgenericuser]</div>
              <div>Service: [AWSS3]</div>
              <div>Action: [ListBuckets]</div>
              <div>On resource(s): [arn:aws:S3:us-east-1:09876543211234567890]</div>
              <div>Context: [no identity-based policy allows the AWSS3:ListBuckets action.]</div>
            </Box>
          </SpaceBetween>
        </div>
        <div>
          <CopyToClipboard
            copyButtonText="Copy"
            copyErrorText="Text failed to copy"
            copySuccessText="Text copied"
            textToCopy={`User: [arn:aws:iam::123456789000:user/awsgenericuser]
Service: [AWSS3]
Action: [ListBuckets]
On resource(s): [arn:aws:S3:us-east-1:09876543211234567890]
Context: [no identity-based policy allows the AWSS3:ListBuckets action.]
`}
          />
        </div>
      </div>
    </SpaceBetween>
  ),
});

const getSupportPromptResponseMessage = (
  onSupportPromptClick?: (detail: SupportPromptGroupProps.ItemClickDetail) => void
): Message => ({
  type: 'chat-bubble',
  authorId: 'gen-ai',
  content: (
    <CodeView
      content={`// This is the main function that will be executed when the script runs
function main(): void {
// Use console.log to print "Hello, World!" to the console
console.log("Hello, World!");
}
// Call the main function to execute the program
main();`}
      highlight={typescriptHighlight}
    />
  ),
  actions: 'code-view',
  contentToCopy: `// This is the main function that will be executed when the script runs
function main(): void {
  // Use console.log to print "Hello, World!" to the console
  console.log("Hello, World!");
}
// Call the main function to execute the program
main();`,
  timestamp: new Date().toLocaleTimeString(),
  supportPrompts: (
    <SupportPromptGroup
      ariaLabel="Proposed prompts"
      items={supportPromptItems}
      onItemClick={({ detail }) => {
        onSupportPromptClick?.(detail);
      }}
    />
  ),
});

interface ValidPromptType {
  prompt: Array<string>;
  getResponse: (onSupportPromptClick?: (detail: SupportPromptGroupProps.ItemClickDetail) => void) => Message;
}

export const validLoadingPrompts = ['show a loading state example', 'loading state', 'loading'];

export const VALID_PROMPTS: Array<ValidPromptType> = [
  {
    prompt: validLoadingPrompts,
    getResponse: getLoadingStateResponseMessage,
  },
  {
    prompt: ['show an error state example', 'error state', 'error'],
    getResponse: getErrorStateResponseMessage,
  },
  {
    prompt: ['file'],
    getResponse: getFileResponseMessage,
  },
  {
    prompt: ['show support prompts', 'support prompts', 'support prompt'],
    getResponse: onSupportPromptClick => getSupportPromptResponseMessage(onSupportPromptClick),
  },
];

// Needed only for the existing messages upon page load.
function getTimestampMinutesAgo(minutesAgo: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutesAgo);

  return d.toLocaleTimeString();
}

export interface AuthorAvatarProps {
  type: 'user' | 'gen-ai';
  name: string;
  initials?: string;
  loading?: boolean;
}
interface AuthorsType {
  [key: string]: AuthorAvatarProps;
}
export const AUTHORS: AuthorsType = {
  'user-jane-doe': { type: 'user', name: 'Jane Doe', initials: 'JD' },
  'gen-ai': { type: 'gen-ai', name: 'Generative AI assistant' },
};

const CitationPopover = ({ count, href }: { count: number; href: string }) => (
  <Box color="text-status-info" display="inline">
    <Popover
      header="Source"
      content={
        <Link href={href} external={true} variant="primary">
          {href}
        </Link>
      }
      position="right"
    >
      [{count}]
    </Popover>
  </Box>
);

export const getInitialMessages = (
  onSupportPromptClick: (detail: SupportPromptGroupProps.ItemClickDetail) => void
): Array<Message> => {
  return [
    {
      type: 'chat-bubble',
      authorId: 'user-jane-doe',
      content: 'What can I do with Amazon S3?',
      timestamp: getTimestampMinutesAgo(10),
    },
    {
      type: 'chat-bubble',
      authorId: 'gen-ai',
      content:
        'Amazon S3 provides a simple web service interface that you can use to store and retrieve any amount of data, at any time, from anywhere. Using this service, you can easily build applications that make use of cloud native storage. Since Amazon S3 is highly scalable and you only pay for what you use, you can start small and grow your application as you wish, with no compromise on performance or reliability.',
      timestamp: getTimestampMinutesAgo(9),
      actions: 'feedback',
      contentToCopy:
        'Amazon S3 provides a simple web service interface that you can use to store and retrieve any amount of data, at any time, from anywhere. Using this service, you can easily build applications that make use of cloud native storage. Since Amazon S3 is highly scalable and you only pay for what you use, you can start small and grow your application as you wish, with no compromise on performance or reliability.',
    },
    {
      type: 'chat-bubble',
      authorId: 'user-jane-doe',
      content: 'How can I create an S3 bucket configuration?',
      timestamp: getTimestampMinutesAgo(8),
    },
    {
      type: 'chat-bubble',
      authorId: 'gen-ai',
      content: (
        <TextContent>
          Creating a configuration for Amazon S3 involves setting up a bucket and configuring its properties{' '}
          <CitationPopover
            count={1}
            href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html"
          />
          . Here's a step-by-step guide to help you create an S3 configuration:
          <ol>
            <li>Sign in to AWS Management Console</li>
            <li>Access Amazon S3 console</li>
            <li>Create a new S3 bucket</li>
            <li>
              Configure bucket settings{' '}
              <CitationPopover
                count={2}
                href="https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile-S3-source.html"
              />
            </li>
            <li>Review and create</li>
          </ol>
          <Box padding={{ top: 'xs' }}>
            <ExpandableSection headerText="Sources">
              <div>
                <Link
                  href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html"
                  external={true}
                  variant="primary"
                >
                  [1] Getting started with Amazon S3 - Amazon Simple Storage Service
                </Link>
              </div>
              <div>
                <Link
                  href="https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-configuration-and-profile-S3-source.html"
                  external={true}
                  variant="primary"
                >
                  [2] Understanding configurations stored in Amazon S3 - AWS AppConfig
                </Link>
              </div>
              <div>
                <Link
                  href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html"
                  external={true}
                  variant="primary"
                >
                  [3] Tutorial: Configuring a static website on Amazon S3 - Amazon Simple Storage Service
                </Link>
              </div>
            </ExpandableSection>
          </Box>
        </TextContent>
      ),
      timestamp: getTimestampMinutesAgo(7),
      actions: 'feedback',
      contentToCopy: `Creating a configuration for Amazon S3 involves setting up a bucket and configuring its properties. Here's a step-by-step guide to help you create an S3 configuration:
1. Sign in to AWS Management Console
2. Access Amazon S3 console
3. Create a new S3 bucket
4. Configure bucket settings
5. Review and create`,
    },
    {
      type: 'chat-bubble',
      authorId: 'user-jane-doe',
      content: 'Give me an example of a Typescript code block.',
      timestamp: getTimestampMinutesAgo(6),
    },
    {
      type: 'chat-bubble',
      authorId: 'gen-ai',
      content: "Here's a simple TypeScript code example that implements the 'Hello, World!' functionality:",
      timestamp: getTimestampMinutesAgo(5),
      actions: 'feedback',
      contentToCopy: "Here's a simple TypeScript code example that implements the 'Hello, World!' functionality:",
    },
    {
      type: 'chat-bubble',
      authorId: 'gen-ai',
      content: (
        <CodeView
          content={`// This is the main function that will be executed when the script runs
function main(): void {
  // Use console.log to print "Hello, World!" to the console
  console.log("Hello, World!");
}
// Call the main function to execute the program
main();`}
          highlight={typescriptHighlight}
        />
      ),
      actions: 'code-view',
      contentToCopy: `// This is the main function that will be executed when the script runs
function main(): void {
  // Use console.log to print "Hello, World!" to the console
  console.log("Hello, World!");
}
// Call the main function to execute the program
main();`,
      timestamp: getTimestampMinutesAgo(4),
      hideAvatar: true,
      supportPrompts: (
        <SupportPromptGroup
          ariaLabel="Typescript support prompt group"
          items={supportPromptItems}
          onItemClick={({ detail }) => {
            onSupportPromptClick(detail);
          }}
        />
      ),
    },
  ];
};

export const supportPromptMessageOne: Message = {
  type: 'chat-bubble',
  authorId: 'gen-ai',
  content: (
    <>
      TypeScript is a powerful programming language that builds upon JavaScript by adding static typing and other
      features. Here are key things you can do with TypeScript:
      <ol>
        <li>
          Web developement
          <ul>
            <li>Build frontend applications using frameworks like Angular, React, or Vue.js</li>
            <li>Create robust server-side applications with Node.js</li>
            <li>Develop full-stack applications with enhanced type safety</li>
          </ul>
        </li>

        <li>
          Type safety features
          <ul>
            <li>Define explicit types for variables, functions, and objects</li>
            <li>Catch errors during development before runtime</li>
            <li>Use interfaces and type declarations for better code organization</li>
          </ul>
        </li>
        <li>
          Object-oriented programming
          <ul>
            <li>Create classes with proper inheritance</li>
            <li>Implement interfaces</li>
            <li>Use access modifiers (public, private, protected)</li>
          </ul>
        </li>
      </ol>
      TypeScript is particularly valuable for large projects where type safety and code maintainability are important
      considerations.
    </>
  ),
  timestamp: new Date().toLocaleTimeString(),
  actions: 'feedback',
  contentToCopy: `TypeScript is a powerful programming language that builds upon JavaScript by adding static typing and other features. Here are key things you can do with TypeScript:
1. Web developement
 - Build frontend applications using frameworks like Angular, React, or Vue.js
 - Create robust server-side applications with Node.js
 - Develop full-stack applications with enhanced type safety
2. Type safety features
 - Define explicit types for variables, functions, and objects
 - Catch errors during development before runtime
 - Use interfaces and type declarations for better code organization
3. Object-oriented programming
 - Create classes with proper inheritance
 - Implement interfaces
 - Use access modifiers (public, private, protected)
TypeScript is particularly valuable for large projects where type safety and code maintainability are important considerations.`,
};

export const supportPromptMessageTwo: Message = {
  type: 'chat-bubble',
  authorId: 'gen-ai',
  content: (
    <CodeView
      highlight={typescriptHighlight}
      content={`// Here's how you might add input parameters and type checking
function enhancedMain(name: string, greeting: string = "Hello"): void {
  if (!name) {
    throw new error('Name parameter is required.');
  }
  console.log(\`\${greeting}, \${name}!\`);
}

// Call the enhancedMain function to execute the program
enhancedMain('Greetings', 'Earth');`}
    />
  ),
  actions: 'code-view',
  contentToCopy: `// Add input parameters and type checking
function enhancedMain(name: string, greeting: string = "Hello"): void {
  if (!name) {
   throw new error('Name parameter is required.');
  }
  console.log("{greeting}, {name}!");
}
// Call the enhancedMain function to execute the program
enhancedMain('Greetings', 'Earth');`,
  timestamp: new Date().toLocaleTimeString(),
};

export const fileTokenGroupI18nStrings: FileTokenGroupProps.I18nStrings = {
  removeFileAriaLabel: index => `Remove file ${index + 1}`,
  limitShowFewer: 'Show fewer files',
  limitShowMore: 'Show more files',
  errorIconAriaLabel: 'Error',
  warningIconAriaLabel: 'Warning',
};
