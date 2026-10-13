export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path = '') => `${base}/${path.replace(/^\//, '')}`;
export const image = (name: string, width = 1600) => url(`images/${name}-${width}.webp`);
