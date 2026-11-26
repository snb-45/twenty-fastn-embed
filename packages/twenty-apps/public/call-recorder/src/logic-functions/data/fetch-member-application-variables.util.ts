import { MetadataApiClient } from 'twenty-client-sdk/metadata';

import { type MemberApplicationVariables } from 'src/logic-functions/types/member-application-variables.type';
import { fetchWithRateLimitRetry } from 'src/logic-functions/utils/fetch-with-rate-limit-retry.util';

export const fetchMemberApplicationVariables = async (): Promise<
  MemberApplicationVariables[]
> => {
  // Without runAs, a run started by a member only gets that member's values.
  const metadataClient = new MetadataApiClient({
    fetch: fetchWithRateLimitRetry,
    runAs: 'application',
  });
  const { myUserApplicationVariables } = await metadataClient.query({
    myUserApplicationVariables: {
      userWorkspaceId: true,
      workspaceMemberId: true,
      variables: { key: true, value: true },
    },
  });

  return myUserApplicationVariables;
};
