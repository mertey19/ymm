import { publications } from './publications';
export const articles = publications.filter((p) => p.kind === 'makaleler');
