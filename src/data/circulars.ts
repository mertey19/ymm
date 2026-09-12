import { publications } from './publications';
export const circulars = publications.filter((p) => p.kind === 'sirkulerler');
