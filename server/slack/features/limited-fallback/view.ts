import { Blocks, Modal } from 'slack-block-builder';
import type { SlackModalDto } from 'slack-block-builder/dist/internal';
import type { LimitedFallbackMetadata } from './metadata';
import { encodeLimitedFallbackMetadata } from './metadata';

export function buildLimitedFallbackConsentModal(
  metadata: LimitedFallbackMetadata
): SlackModalDto {
  return Modal({
    title: 'Out of Credits',
    submit: 'I Consent',
    close: 'Cancel',
    callbackId: 'limited_fallback_submit_consent',
    privateMetaData: encodeLimitedFallbackMetadata(metadata),
  })
    .blocks(
      Blocks.Section({
        text: "*You're out of credits.* If you wish, you can use a limited Gorkie mode powered by Gemini Flash.",
      }),
      Blocks.Section({
        text: 'By continuing, you consent to Google processing only the message that pinged Gorkie in this thread. No other thread history will be sent.',
      })
    )
    .buildToObject();
}
