import { c as create_ssr_component, e as escape, f as each } from "../../chunks/ssr.js";
import "@highlight-ai/app-runtime";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let notes = [];
  return `<h1 data-svelte-h="svelte-16r2evl">Notes</h1> ${`<button data-svelte-h="svelte-sh78ae">Start Noting...</button>`} <textarea readonly>${escape("")}</textarea> ${each(notes, (note) => {
    return `<div><p>${escape(new Date(note.createdAt).toLocaleString())}</p> <p><!-- HTML_TAG_START -->${note.note}<!-- HTML_TAG_END --></p> </div>`;
  })}`;
});
export {
  Page as default
};
