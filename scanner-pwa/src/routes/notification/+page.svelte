<script lang="ts">
  import { requestNotificationPermission } from "$lib/pushNotificationController";
</script>

<h1>Notifications</h1>

<button on:click={requestNotificationPermission}
  >Request Permission and Subscribe</button
>
