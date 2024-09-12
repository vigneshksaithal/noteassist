

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.d2Q-U2gb.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.C0yU1EK2.js"];
export const stylesheets = [];
export const fonts = [];
