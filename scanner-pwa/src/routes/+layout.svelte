<script lang="ts">
  import { pwaInfo } from "virtual:pwa-info";

  let { children } = $props();

  const webManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "");
</script>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html webManifest}
</svelte:head>

<nav>
  <a href="/">scanner</a>
  <a href="/notification">notification</a>
  <a href="/map">map</a>
</nav>

<main>
  {@render children()}
</main>

{#await import("$lib/ReloadPrompt.svelte") then { default: ReloadPrompt }}
  <ReloadPrompt />
{/await}
