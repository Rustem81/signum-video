<template>
<v-main>
  <router-view v-show="!(loading)"/>
</v-main>
</template>

<script>
export default {
  data () {
    return {
      loading: false
    }
  }
}
</script>
