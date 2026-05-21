import * as openConsentModal from './actions/open-consent-modal';
import * as submitConsentModal from './views/submit-consent-modal';

export const limitedFallback = {
  actions: [{ name: openConsentModal.name, execute: openConsentModal.execute }],
  views: [{ name: submitConsentModal.name, execute: submitConsentModal.execute }],
};
