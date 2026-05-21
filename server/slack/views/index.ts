import { customizations } from '../features/customizations';
import { limitedFallback } from '../features/limited-fallback';

export const views = [...customizations.views, ...limitedFallback.views];
