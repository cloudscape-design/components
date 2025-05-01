// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

interface ContainerProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
}

function Container({ children, direction = 'vertical' }: ContainerProps) {
  return <div className={clsx(styles['card-container'], styles[`position-${direction}`])}>{children}</div>;
}

interface CardHeaderProps {
  children: React.ReactNode;
}

function Header({ children }: CardHeaderProps) {
  return <div className={styles['card-header']}>{children}</div>;
}

export interface CardMediaProps {
  children: React.ReactNode;
  position?: 'vertical' | 'horizontal';
  maxSize?: string | number;
}
function Media({ children, maxSize, position = 'vertical' }: CardMediaProps) {
  return (
    <div
      className={styles['card-media']}
      style={position === 'vertical' ? { height: maxSize || '' } : { width: maxSize || '' }}
    >
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
}

function Content({ children }: CardContentProps) {
  return <div className={styles['card-content']}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
}

function Footer({ children }: CardFooterProps) {
  return <div className={styles['card-footer']}>{children}</div>;
}

interface CardTouchAreaProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function TouchArea({ children, ...rest }: CardTouchAreaProps) {
  return (
    <button className={styles['card-touch-area']} {...rest}>
      <span className={styles['card-focus-highlight']} />
      {children}
    </button>
  );
}

export default {
  Container,
  Header,
  Media,
  Content,
  Footer,
  TouchArea,
};
