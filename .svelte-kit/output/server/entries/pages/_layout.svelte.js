import { c as create_ssr_component, e as escape, b as add_attribute, v as validate_component } from "../../chunks/ssr.js";
const MetaTags = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title = "" } = $$props;
  let { description = "" } = $$props;
  let { keywords = "" } = $$props;
  let { url = "" } = $$props;
  let { ogImage = "" } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0) $$bindings.description(description);
  if ($$props.keywords === void 0 && $$bindings.keywords && keywords !== void 0) $$bindings.keywords(keywords);
  if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);
  if ($$props.ogImage === void 0 && $$bindings.ogImage && ogImage !== void 0) $$bindings.ogImage(ogImage);
  return `${$$result.head += `<!-- HEAD_svelte-tcboxw_START -->${$$result.title = `<title>${escape(title)}</title>`, ""}<meta name="description"${add_attribute("content", description, 0)}><meta name="keywords"${add_attribute("content", keywords, 0)}><meta property="og:type" content="website"><meta property="og:url"${add_attribute("content", url, 0)}><meta property="og:title"${add_attribute("content", title, 0)}><meta property="og:description"${add_attribute("content", description, 0)}><meta property="og:image"${add_attribute("content", ogImage, 0)}><meta property="twitter:card" content="summary_large_image"><meta property="twitter:domain" content="codeclippy.aithal.dev"><meta property="twitter:url"${add_attribute("content", url, 0)}><meta name="twitter:title"${add_attribute("content", title, 0)}><meta name="twitter:description"${add_attribute("content", description, 0)}><meta name="twitter:image"${add_attribute("content", ogImage, 0)}><link rel="canonical"${add_attribute("href", url, 0)}><!-- HEAD_svelte-tcboxw_END -->`, ""}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(MetaTags, "MetaTags").$$render($$result, {}, {}, {})} <main class="container" style="margin-top: 2rem">${slots.default ? slots.default({}) : ``}</main>`;
});
export {
  Layout as default
};
