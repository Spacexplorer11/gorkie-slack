import { customizations } from '../features/customizations';
import { limitedFallback } from '../features/limited-fallback';

export const actions = [...customizations.actions, ...limitedFallback.actions];
