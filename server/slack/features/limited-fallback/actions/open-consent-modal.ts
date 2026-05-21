import type {
  AllMiddlewareArgs,
  BlockAction,
  ButtonAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt';
import { buildLimitedFallbackConsentModal } from '../view';
import { decodeLimitedFallbackMetadata } from '../metadata';

export const name = 'limited_fallback_open_consent';

export async function execute({
  ack,
  body,
  client,
}: SlackActionMiddlewareArgs<BlockAction<ButtonAction>> &
  AllMiddlewareArgs): Promise<void> {
  await ack();
  const action = body.actions?.[0];
  const metadata = decodeLimitedFallbackMetadata(
    typeof action?.value === 'string' ? action.value : undefined
  );
  if (!metadata) {
    return;
  }
  await client.views.open({
    trigger_id: body.trigger_id,
    view: buildLimitedFallbackConsentModal(metadata),
  });
}
