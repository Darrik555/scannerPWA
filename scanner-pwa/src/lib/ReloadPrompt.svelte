<script lang="ts">
  import { useRegisterSW } from "virtual:pwa-register/svelte";

  // replaced dynamically
  const buildDate = __DATE__;

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      r &&
        setInterval(async () => {
          if (r.installing || !navigator) return;

          if ("connection" in navigator && !navigator.onLine) return;

          const resp = await fetch(swUrl, {
            cache: "no-store",
            headers: {
              cache: "no-store",
              "cache-control": "no-cache",
            },
          });

          if (resp?.status === 200) await r.update();
        }, 20000 /* 20s for testing purposes */);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });
  const close = () => {
    offlineReady.set(false);
    needRefresh.set(false);
  };

  const toast = $derived($offlineReady || $needRefresh);
</script>

{#if toast}
  <div class="pwa-toast" role="alert">
    <div class="message">
      {#if $offlineReady}
        <span> App ready to work offline </span>
      {:else}
        <span> New content available, click on reload button to update. </span>
      {/if}
    </div>
    {#if $needRefresh}
      <button onclick={() => updateServiceWorker(true)}> Reload </button>
    {/if}
    <button onclick={close}> Close </button>
  </div>
{/if}

<div class="pwa-date">
  {buildDate}
</div>

<style>
  .pwa-date {
    visibility: hidden;
  }
  .pwa-toast {
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 16px;
    padding: 12px;
    border: 1px solid #8885;
    border-radius: 4px;
    z-index: 2;
    text-align: left;
    box-shadow: 3px 4px 5px 0 #8885;
    background-color: white;
  }
  .pwa-toast .message {
    margin-bottom: 8px;
  }
  .pwa-toast button {
    border: 1px solid #8885;
    outline: none;
    margin-right: 5px;
    border-radius: 2px;
    padding: 3px 10px;
  }
</style>
