import type {
  AllMiddlewareArgs,
  SlackViewMiddlewareArgs,
  ViewSubmitAction,
} from '@slack/bolt';
import { getTime } from '~/utils/time';
import { decodeLimitedFallbackMetadata } from '../metadata';
import { generateResponse } from '../../../events/message-create/utils/respond';
import type { ChatRequestHints, SlackMessageContext } from '~/types';

export const name = 'limited_fallback_submit_consent';

export async function execute({
  ack,
  view,
  client,
  context,
}: SlackViewMiddlewareArgs<ViewSubmitAction> &
  AllMiddlewareArgs): Promise<void> {
  await ack();
  const metadata = decodeLimitedFallbackMetadata(view.private_metadata);
  if (!metadata) {
    return;
  }

  const history = await client.conversations.history({
    channel: metadata.channel,
    latest: metadata.ts,
    oldest: metadata.ts,
    inclusive: true,
    limit: 1,
  });
  const source = history.messages?.[0];
  const sourceText = typeof source?.text === 'string' ? source.text : null;
  if (!sourceText) {
    await client.chat.postMessage({
      channel: metadata.channel,
      thread_ts: metadata.threadTs ?? metadata.ts,
      text: 'I could not read the original ping message for limited mode. Please ping me again.',
    });
    return;
  }

  const limitedContext: SlackMessageContext = {
    client,
    botUserId: context.botUserId,
    teamId: metadata.teamId,
    event: {
      channel: metadata.channel,
      channel_type: metadata.channelType,
      event_ts: metadata.ts,
      text: sourceText,
      thread_ts: metadata.threadTs,
      ts: metadata.ts,
      user: metadata.user,
    },
  };
  const requestHints: ChatRequestHints = {
    channel: 'this channel',
    server: 'this workspace',
    time: getTime(),
    joined: Date.now(),
    status: 'active',
    activity: 'none',
  };
  const result = await generateResponse(limitedContext, [], requestHints, {
    modelKey: 'limited-chat-model',
    limitedContextOnly: true,
  });
  if (!result.success && result.error) {
    await client.chat.postMessage({
      channel: metadata.channel,
      thread_ts: metadata.threadTs ?? metadata.ts,
      text: result.error,
    });
  }
}
