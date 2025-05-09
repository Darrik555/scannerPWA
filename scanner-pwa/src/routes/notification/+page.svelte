<script lang="ts">
  import { requestNotificationPermission } from "$lib/pushNotificationController";
  import { onMount } from "svelte";

  onMount(() => {
    requestNotificationPermission();
  });
</script>
