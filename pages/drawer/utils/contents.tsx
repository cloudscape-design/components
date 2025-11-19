// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { clsx } from 'clsx';

import Box from '~components/box';
import Header from '~components/header';
import Icon, { IconProps } from '~components/icon';
import Link from '~components/link';
import PromptInput from '~components/prompt-input';
import SpaceBetween from '~components/space-between';
import TextContent from '~components/text-content';

import styles from '../styles.scss';

export const longContent = (
  <>
    <span>
      When you want to use CloudFront to distribute your content, you create a distribution and choose the configuration
      settings you want. For example:
    </span>
    <ul>
      <li>
        Your content origin—that is, the Amazon S3 bucket, MediaPackage channel, or HTTP server from which CloudFront
        gets the files to distribute. You can specify any combination of up to 25 Amazon S3 buckets, channels, and/or
        HTTP servers as your origins.
      </li>
      <li>
        Your content origin—that is, the Amazon S3 bucket, MediaPackage channel, or HTTP server from which CloudFront
        gets the files to distribute. You can specify any combination of up to 25 Amazon S3 buckets, channels, and/or
        HTTP servers as your origins.
      </li>
      <li>
        Your content origin—that is, the Amazon S3 bucket, MediaPackage channel, or HTTP server from which CloudFront
        gets the files to distribute. You can specify any combination of up to 25 Amazon S3 buckets, channels, and/or
        HTTP servers as your origins.
      </li>
      <li>Access—whether you want the files to be available to everyone or restrict access to some users.</li>
      <li>Security—whether you want CloudFront to require users to use HTTPS to access your content.</li>
      <li>
        Cookie or query-string forwarding—whether you want CloudFront to forward cookies or query strings to your
        origin.
      </li>
      <li>
        Geo-restrictions—whether you want CloudFront to prevent users in selected countries from accessing your content.
      </li>
      <li>Access logs—whether you want CloudFront to create access logs that show viewer activity.</li>
    </ul>
    <h3>
      Learn more <Icon name="external" />
    </h3>
    <ul>
      <li>
        <a
          href="https://docs.aws.amazon.com/en_pv/AmazonCloudFront/latest/DeveloperGuide/distribution-overview.html"
          rel="noopener noreferrer"
          target="_blank"
        >
          Overview of Distributions
        </a>
      </li>
    </ul>
  </>
);

export const shortContent = (
  <span>
    You can configure CloudFront to return a specific object (the default root object) when a user requests the root URL
    for your web distribution instead of requesting an object in your distribution. Specifying a default root object
    lets you avoid exposing the contents of your distribution or returning an error.
  </span>
);

export const longHeader = <span>Lorem nesciunt praesentium voluptatem, molestias aliquid animi aspernatur!</span>;

export const shortHeader = <span>Lorem nesciunt!</span>;

export const longFooter = <span>Lorem nesciunt praesentium voluptatem, molestias aliquid animi aspernatur!</span>;

export const shortFooter = <span>Lorem nesciuntnatur!</span>;

// Amazon Q action items data
const amazonQActions: { icon: IconProps.Name; text: string }[] = [
  { icon: 'contact' as const, text: 'Chatting about your resources' },
  { icon: 'suggestions' as const, text: 'Understanding and optimizing your costs' },
  { icon: 'security' as const, text: 'Analyzing network troubleshooting' },
  { icon: 'search' as const, text: 'Investigating operational issues' },
  { icon: 'share' as const, text: 'Using third party plugins' },
];

// Reusable ActionCard component
const ActionCard = ({ icon, text }: { icon: IconProps.Name; text: string }) => (
  <div className={clsx(styles['amazon-q-action-card'])}>
    <div className={styles['action-card-icon']}>
      <Icon name={icon} />
    </div>
    <div className={styles['action-card-text']}>
      <span>{text}</span>
    </div>
  </div>
);

export const amazonQHeader = <span>Amazon Q</span>;

export const amazonQContent = (
  <SpaceBetween size="m">
    <div className={styles.welcome}>
      <Box>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="100%"
          width="100%"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
          className={styles['q-logo']}
        >
          <defs>
            <linearGradient
              id="linear-gradient"
              x1="43.37"
              y1="-3.59"
              x2="7.13"
              y2="48.17"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#a7f8ff"></stop>
              <stop offset=".03" stopColor="#9df1ff"></stop>
              <stop offset=".08" stopColor="#84e1ff"></stop>
              <stop offset=".15" stopColor="#5ac7ff"></stop>
              <stop offset=".22" stopColor="#21a2ff"></stop>
              <stop offset=".26" stopColor="#008dff"></stop>
              <stop offset=".66" stopColor="#7f33ff"></stop>
              <stop offset=".99" stopColor="#39127d"></stop>
            </linearGradient>
          </defs>
          <path
            d="m20.37.99L5.97,9.3c-2.28,1.32-3.69,3.75-3.69,6.39v16.63c0,2.63,1.41,5.07,3.69,6.39l14.4,8.31c2.28,1.32,5.09,1.32,7.37,0l14.4-8.31c2.28-1.32,3.69-3.75,3.69-6.39V15.69c0-2.63-1.41-5.07-3.69-6.39L27.74.99c-2.28-1.32-5.09-1.32-7.37,0Z"
            fill="url(#linear-gradient)"
            strokeWidth="0"
            color="transparent"
          ></path>
          <path
            d="m36.64,14.66l-10.79-6.23c-.49-.29-1.15-.43-1.8-.43s-1.3.14-1.8.43l-10.79,6.23c-.99.57-1.8,1.97-1.8,3.11v12.46c0,1.14.81,2.54,1.8,3.11l10.79,6.23c.49.29,1.15.43,1.8.43s1.3-.14,1.8-.43l10.79-6.23c.99-.57,1.8-1.97,1.8-3.11v-12.46c0-1.14-.81-2.54-1.8-3.11Zm-12.3,22.33s-.14.03-.28.03-.24-.02-.28-.03l-10.82-6.25c-.11-.1-.25-.35-.28-.49v-12.5c.03-.14.18-.39.28-.49l10.82-6.25s.14-.03.28-.03.24.02.28.03l10.82,6.25c.11.1.25.35.28.49v11.09l-8.38-4.84v-1.32c0-.26-.14-.49-.36-.62l-2.28-1.32c-.11-.06-.24-.1-.36-.1s-.25.03-.36.1l-2.28,1.32c-.22.13-.36.37-.36.62v2.63c0,.26.14.49.36.62l2.28,1.32c.11.06.24.1.36.1s.25-.03.36-.1l1.14-.66,8.38,4.84-9.6,5.54Z"
            fill="#fff"
            color="transparent"
          ></path>
        </svg>
      </Box>
      <Box>
        <Header variant="h2">Hello! I&apos;m Amazon Q, your AWS generative AI assistant.</Header>
      </Box>
    </div>

    <div>
      {amazonQActions.map((action, index) => (
        <ActionCard key={index} icon={action.icon} text={action.text} />
      ))}
    </div>

    <Box fontSize="body-s" color="text-body-secondary">
      <TextContent>
        I&apos;m learning more every day. Help me improve by{' '}
        <Link href="#" external={false}>
          providing feedback
        </Link>
        . Visit the{' '}
        <Link href="#" external={true}>
          Amazon Q documentation
        </Link>{' '}
        for more information.
      </TextContent>
    </Box>

    <Box>
      <TextContent>
        <h4>Additional info</h4>
        <p>
          Amazon Q Developer may retain chats to provide and maintain the service. Amazon Q Developer makes cross-region
          API calls when your requests require it, and may process data across AWS Regions within the geography where
          your Q Developer Pro tier profile was created or across US Regions for Free tier users. For more information,
          see the{' '}
          <Link href="#" external={true}>
            Amazon Q Developer documentation
          </Link>
          .
        </p>
      </TextContent>
    </Box>
  </SpaceBetween>
);

export const amazonQFooter = (
  <SpaceBetween size="xs">
    <PromptInput
      value=""
      disableSecondaryActionsPaddings={true}
      placeholder="Ask me anything about Amazon"
      actionButtonAriaLabel={'send'}
      actionButtonIconName={'send'}
    />
    <Box fontSize="body-s" color="text-body-secondary">
      Max 1000 characters
    </Box>
    <Box fontSize="body-s" color="text-body-secondary">
      You are using{' '}
      <Link href="#" external={true}>
        Free Tier
      </Link>
      . Amazon Q Developer uses generative AI. You may need to verify responses. See the{' '}
      <Link href="#" external={true}>
        AWS Responsible AI Policy.
      </Link>
    </Box>
  </SpaceBetween>
);
