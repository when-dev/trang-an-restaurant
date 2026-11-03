// OpenNext configuration for Cloudflare Workers.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // All pages are prerendered at build time (Cache Components). This read-only cache serves those
  // prerendered pages from the existing ASSETS binding — without any incremental cache the Worker
  // re-renders every request and the Cache Components render never completes.
  // Switch to R2 (r2-incremental-cache + an `r2_buckets` binding) only if on-demand revalidation is
  // ever needed. See https://opennext.js.org/cloudflare/caching
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
