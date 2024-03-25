// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//import fetch from "node-fetch";
import { graphql } from "@octokit/graphql"
//global.fetch = fetch;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: process.env.TOKEN,
  },
});

async function lockDiscussions(ids) {
  for (let discussionId of ids) {
    try {
      await graphqlWithAuth(
        `
          mutation lock ($id: ID!) {
            lockLockable(input:{lockableId: $id}) {
                clientMutationId
            }
          }
        `,
        {
          id: discussionId,
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
}

async function main () {
  const unlockedNodes = []
  const oneDay = 1000 * 60 * 60 * 24; // one day in ms
  const today = new Date();
  let readDiscussions = true
  let cursor = null
  while (readDiscussions) {
    const {repository} = await graphqlWithAuth(`
        query discussionListQuery ($owner: String!, $repo: String!, $lastId: String) {
            repository(owner:$owner, name:$repo) {
                discussions(states:[OPEN], first:4, after: $lastId) {
                    totalCount
                    nodes {
                        id
                        answerChosenAt
                        createdAt
                        updatedAt
                        locked
                        title
                        category {
                          name
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    } 
                }
            }
        }
    `, {
      owner: "cloudscape-design",
      repo: "components",
      lastId: cursor,
    });

    repository.discussions.nodes.forEach(discussion => {
      if (!discussion.locked) {
        const isQA = discussion.category.name === 'Q&A'
        const lockQA = !!discussion.answerChosenAt
          && (today - new Date(discussion.answerChosenAt).getTime()) / oneDay > 7

        // there is no reliable way to detect if it was answered,
        // so we give it 2 weeks
        const lockGeneral = !!discussion.updatedAt
          && discussion.updatedAt !== discussion.createdAt
          && (today - new Date(discussion.updatedAt).getTime()) / oneDay > 14

        const shouldBeLocked = isQA ? lockQA : lockGeneral;
        if (shouldBeLocked) {
          unlockedNodes.push(discussion.id)
        }
      }
    })
    const {endCursor, hasNextPage} = repository.discussions.pageInfo;
    readDiscussions = hasNextPage
    cursor = endCursor
  }

  console.log(`Discussions to lock: ${unlockedNodes.length}`);
  if (unlockedNodes.length) {
    await lockDiscussions(unlockedNodes);
  }
  console.log('Locking completed');
}

main();