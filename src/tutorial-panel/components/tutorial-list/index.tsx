// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';
import styles from './styles.css.js';
import { TutorialPanelProps } from '../../interfaces';
import InternalBox from '../../../box/internal';
import { InternalButton } from '../../../button/internal';
import InternalStatusIndicator from '../../../status-indicator/internal';
import InternalSpaceBetween from '../../../space-between/internal';
import { fireNonCancelableEvent } from '../../../internal/events/index.js';
import clsx from 'clsx';
import InternalAlert from '../../../alert/internal';
import InternalLink from '../../../link/internal';
import { useUniqueId } from '../../../internal/hooks/use-unique-id/index.js';
import { CSSTransition } from 'react-transition-group';
import { HotspotContext } from '../../../annotation-context/context.js';
import InternalIcon from '../../../icon/internal';
import useFocusVisible from '../../../internal/hooks/focus-visible/index.js';
import { useVisualRefresh } from '../../../internal/hooks/use-visual-mode';
import { checkSafeUrl } from '../../../internal/utils/check-safe-url';

export interface TutorialListProps {
  loading?: boolean;
  tutorials: TutorialPanelProps['tutorials'];
  onStartTutorial: HotspotContext['onStartTutorial'];
  filteringFunction: (tutorial: TutorialPanelProps.Tutorial, searchTerm: string) => boolean;
  i18nStrings: TutorialPanelProps['i18nStrings'];
  downloadUrl: TutorialPanelProps['downloadUrl'];
}

export default function TutorialList({
  i18nStrings,
  tutorials,
  loading = false,
  onStartTutorial,
  downloadUrl,
}: TutorialListProps) {
  checkSafeUrl('TutorialPanel', downloadUrl);

  /*
  // Filtering is not available in the Beta release.

  const [searchTerm, setSearchTerm] = useState('');

  const onSearchChangeCallback: InputProps['onChange'] = useCallback(event => setSearchTerm(event.detail.value), [
    setSearchTerm
  ]);

  const filteredTutorials = tutorials.filter(tutorial => filteringFunction(tutorial, searchTerm))
  */

  const focusVisible = useFocusVisible();
  const isRefresh = useVisualRefresh();

  return (
    <>
      <InternalSpaceBetween size="s">
        <InternalSpaceBetween size="m">
          <InternalBox variant="h2" fontSize={isRefresh ? 'heading-m' : 'heading-l'} padding={{ bottom: 'n' }}>
            {i18nStrings.tutorialListTitle}
          </InternalBox>
          <InternalBox variant="p" color="text-body-secondary" padding="n">
            {i18nStrings.tutorialListDescription}
          </InternalBox>
        </InternalSpaceBetween>
        <InternalSpaceBetween size="l">
          <a
            {...focusVisible}
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles['download-link']}
          >
            <InternalIcon name="download" />
            <InternalBox padding={{ left: 'xs' }} color="inherit" fontWeight="bold" display="inline">
              {i18nStrings.tutorialListDownloadLinkText}
            </InternalBox>
          </a>

          {/*
          <FormField label="Filter tutorials">
            <Input type="search" value={searchTerm} placeholder="Filter tutorials" onChange={onSearchChangeCallback} />
          </FormField>
        */}
          {loading ? (
            <InternalStatusIndicator type="loading">{i18nStrings.loadingText}</InternalStatusIndicator>
          ) : (
            <>
              <ul className={styles['tutorial-list']} role="list">
                {tutorials.map((tutorial, index) => (
                  <Tutorial
                    tutorial={tutorial}
                    key={index}
                    onStartTutorial={onStartTutorial}
                    i18nStrings={i18nStrings}
                  />
                ))}
              </ul>
              {/* {filteredTutorials.length === 0 && searchTerm && <Box>No tutorials match this search filter.</Box>} */}
            </>
          )}
        </InternalSpaceBetween>
      </InternalSpaceBetween>
    </>
  );
}

function Tutorial({
  tutorial,
  onStartTutorial: onStartTutorialEventHandler,
  i18nStrings,
}: {
  tutorial: TutorialPanelProps.Tutorial;
  onStartTutorial: HotspotContext['onStartTutorial'];
  i18nStrings: TutorialPanelProps['i18nStrings'];
}) {
  checkSafeUrl('TutorialPanel', tutorial.learnMoreUrl);
  const controlId = useUniqueId();
  const triggerControldId = useUniqueId();
  const headerId = useUniqueId();

  const isRefresh = useVisualRefresh();

  const onStartTutorial = useCallback(() => {
    fireNonCancelableEvent(onStartTutorialEventHandler, { tutorial });
  }, [onStartTutorialEventHandler, tutorial]);

  const [expanded, setExpanded] = useState(!tutorial.prerequisitesNeeded && !tutorial.completed);

  const onClick = useCallback(() => {
    setExpanded(expanded => !expanded);
  }, []);

  return (
    <li className={styles['tutorial-box']} role="listitem">
      <InternalSpaceBetween size="xs">
        <div className={styles['tutorial-box-title']}>
          <InternalBox
            variant="h3"
            fontSize={isRefresh ? 'heading-s' : 'heading-m'}
            id={headerId}
            margin={{ right: 'xs' }}
            padding="n"
            className={styles.title}
          >
            {tutorial.title}
          </InternalBox>
          <div className={styles['button-wrapper']}>
            <InternalButton
              id={triggerControldId}
              variant="icon"
              ariaExpanded={expanded}
              __nativeAttributes={{
                'aria-controls': controlId,
                'aria-labelledby': headerId,
              }}
              formAction="none"
              onClick={onClick}
              className={expanded ? styles['collapse-button'] : styles['expand-button']}
              iconName={expanded ? 'angle-up' : 'angle-down'}
            />
          </div>
        </div>

        {tutorial.completed ? (
          <InternalStatusIndicator __size="inherit" type="success" className={styles.completed} wrapText={true}>
            {i18nStrings.tutorialCompletedText}
          </InternalStatusIndicator>
        ) : null}
      </InternalSpaceBetween>

      <div aria-live="polite">
        <CSSTransition in={expanded} timeout={30} classNames={{ enter: styles['content-enter'] }}>
          <div className={clsx(styles['expandable-section'], expanded && styles.expanded)} id={controlId}>
            <InternalSpaceBetween size="l">
              <InternalSpaceBetween size="m">
                {tutorial.prerequisitesNeeded && tutorial.prerequisitesAlert && (
                  <InternalAlert type="info" className={styles['prerequisites-alert']}>
                    {tutorial.prerequisitesAlert}
                  </InternalAlert>
                )}
                <InternalSpaceBetween size="s">
                  <InternalBox color="text-body-secondary">
                    <div
                      className={clsx(
                        styles['tutorial-description'],
                        typeof tutorial.description === 'string' && styles['tutorial-description-plaintext']
                      )}
                    >
                      {tutorial.description}
                    </div>
                  </InternalBox>
                  {tutorial.learnMoreUrl && (
                    <InternalLink
                      href={tutorial.learnMoreUrl}
                      className={styles['learn-more-link']}
                      externalIconAriaLabel={i18nStrings.labelLearnMoreExternalIcon}
                      external={true}
                    >
                      {i18nStrings.learnMoreLinkText}
                    </InternalLink>
                  )}
                </InternalSpaceBetween>
              </InternalSpaceBetween>

              <InternalBox margin={{ bottom: 'xxs' }}>
                <InternalButton
                  onClick={onStartTutorial}
                  disabled={tutorial.prerequisitesNeeded ?? false}
                  formAction="none"
                  className={styles.start}
                >
                  {tutorial.completed ? i18nStrings.restartTutorialButtonText : i18nStrings.startTutorialButtonText}
                </InternalButton>
              </InternalBox>
            </InternalSpaceBetween>
          </div>
        </CSSTransition>
      </div>
    </li>
  );
}
