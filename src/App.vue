<template>
  <div class="app">
    <mobile />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import mobile from "./components/mobileTerminal.vue";

export default {
  name: "app",
  components: {
    HelloWorld,
    mobile,
  },
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.app {
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
}
</style>
