<template>
  <div class="content"></div>
</template>

<script>
export default {
  data() {
    return {
      id: "1415188751176568832",
    };
  },
  created() {
    this.$axios.getMobileList(this.id).then((res) => {
      console.log(res);
    });
  },
};
</script>

<style>
</style>