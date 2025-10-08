<script lang="ts">
  import { requestNotificationPermission } from "./pushNotificationController";
  import { onMount } from "svelte";

  onMount(() => {
    requestNotificationPermission();
  });
</script>

<h1>Notifications</h1>

<button on:click={requestNotificationPermission}
  >Request Permission and Subscribe</button
>
