<script lang="ts">
  import { requestNotificationPermission } from "$lib/pushNotificationController";
  import { onMount } from "svelte";

  onMount(() => {
    requestNotificationPermission();
  });
</script>

<h1>Notifications</h1>
