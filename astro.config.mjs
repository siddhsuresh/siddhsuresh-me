import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: 'https://siddharthsuresh.me',
  integrations: [mdx(), sitemap(), tailwind(), compress(), react()],
  output: "server",
  adapter: vercel()
});
