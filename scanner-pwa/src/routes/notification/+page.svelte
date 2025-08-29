<script lang="ts">
  import { requestNotificationPermission } from "$lib/pushNotificationController";
  import { onMount } from "svelte";

  onMount(() => {
    requestNotificationPermission();
  });
</script>

<nav>
  <a href="/">scanner</a>
  <a href="/notification">notification</a>
  <a href="/map">map</a>
</nav>

<h1>Notifications</h1>
