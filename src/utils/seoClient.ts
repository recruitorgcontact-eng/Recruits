import {
  CANONICAL_DOMAIN,
  OG_IMAGE_PATH,
  resolveSeoRoute,
  buildStructuredDataGraph,
  buildHreflangAlternates,
  SeoRouteMeta,
} from "../seo/panIndiaSeo";

function upsertMetaTag(attrName: "name" | "property", attrValue: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function syncHreflangTags(alternates: Array<{ hreflang: string; href: string }>) {
  if (typeof document === "undefined") return;
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove());
  for (const alt of alternates) {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", alt.hreflang);
    link.setAttribute("href", alt.href);
    document.head.appendChild(link);
  }
}

export function applyClientSeoMetadata(pathname: string): SeoRouteMeta {
  const meta = resolveSeoRoute(pathname);
  if (typeof document === "undefined" || typeof window === "undefined") return meta;

  const origin =
    window.location.hostname === "recruits.org.in" || window.location.hostname === "www.recruits.org.in"
      ? CANONICAL_DOMAIN
      : window.location.origin;

  const canonicalUrl = `${origin}${meta.canonicalPath === "/" ? "/" : meta.canonicalPath}`;
  const ogImageUrl = `${origin}${OG_IMAGE_PATH}`;

  document.documentElement.lang = meta.htmlLang;
  document.title = meta.title;
  upsertMetaTag("name", "description", meta.description);
  upsertMetaTag("name", "keywords", meta.keywords.join(", "));
  upsertMetaTag("property", "og:locale", meta.ogLocale);
  upsertMetaTag("property", "og:title", meta.title);
  upsertMetaTag("property", "og:description", meta.description);
  upsertMetaTag("property", "og:url", canonicalUrl);
  upsertMetaTag("property", "og:image", ogImageUrl);
  upsertMetaTag("name", "twitter:title", meta.title);
  upsertMetaTag("name", "twitter:description", meta.description);
  upsertMetaTag("name", "twitter:image", ogImageUrl);

  upsertCanonical(canonicalUrl);
  syncHreflangTags(buildHreflangAlternates(meta, origin));

  const jsonLdObj = buildStructuredDataGraph(meta, origin);
  let scriptEl = document.getElementById("recruits-seo-jsonld") as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement("script");
    scriptEl.id = "recruits-seo-jsonld";
    scriptEl.type = "application/ld+json";
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(jsonLdObj);

  return meta;
}
