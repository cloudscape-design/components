// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Form from '@cloudscape-design/components/form';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import SplitPanel from '@cloudscape-design/components/split-panel';
import TagEditor, { TagEditorProps } from '@cloudscape-design/components/tag-editor';

import { resourceManageTagsBreadcrumbs } from '../../common/breadcrumbs';
import { tagEditorI18nStrings } from '../../i18n-strings/tag-editor';
import {
  DemoTopNavigation,
  GlobalSplitPanelContent,
  Navigation,
  Notifications,
  useGlobalSplitPanel,
} from '../commons/common-components';
import { CustomAppLayout } from '../commons/common-components';
import { Info } from './components/info';
import { loadTagKeys, loadTags, loadTagValues } from './utils';

import '../../styles/top-navigation.scss';

export function App() {
  const [tags, setTags] = useState<TagEditorProps.Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();

  useEffect(() => {
    if (loading) {
      loadTags().then(tags => {
        setLoading(false);
        setTags(tags);
      });
    }
  }, [loading]);

  const onChange = ({ tags, valid }: TagEditorProps.ChangeDetail) => {
    setTags([...tags]);
    setIsValid(valid);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (isValid) {
      setTags(tags.map(tag => ({ ...tag, existing: true })).filter(tag => !tag.markedForRemoval));
    }
    event.preventDefault();
  };

  const onCancel = () => {
    setLoading(true);
  };

  return (
    <>
      <DemoTopNavigation />
      <CustomAppLayout
        contentType="form"
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={onSplitPanelToggle}
        splitPanelSize={splitPanelSize}
        onSplitPanelResize={onSplitPanelResize}
        splitPanelPreferences={splitPanelPreferences}
        splitPanel={
          <SplitPanel header="Design exploration">
            <GlobalSplitPanelContent />
          </SplitPanel>
        }
        content={
          <SpaceBetween size="m">
            <Header variant="h1">Manage tags</Header>
            <Info />
            <form onSubmit={onSubmit}>
              <Form
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button variant="link" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button variant="primary" disabled={loading || !isValid}>
                      Save changes
                    </Button>
                  </SpaceBetween>
                }
              >
                <Container
                  header={
                    <Header
                      variant="h2"
                      description="A tag is a label that you assign to an AWS resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your AWS costs."
                    >
                      Tags
                    </Header>
                  }
                >
                  <TagEditor
                    tags={tags}
                    onChange={e => onChange(e.detail)}
                    keysRequest={loadTagKeys}
                    valuesRequest={loadTagValues}
                    loading={loading}
                    i18nStrings={tagEditorI18nStrings}
                  />
                </Container>
              </Form>
            </form>
          </SpaceBetween>
        }
        breadcrumbs={
          <BreadcrumbGroup items={resourceManageTagsBreadcrumbs} expandAriaLabel="Show path" ariaLabel="Breadcrumbs" />
        }
        navigation={<Navigation activeHref="#/distributions" />}
        toolsHide={true}
        notifications={<Notifications />}
      />
    </>
  );
}
