<template>
  <div id="root-app">
    <AppNav />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
import ChatWidget from '@/components/ChatWidget.vue'
</script>

<style scoped>
#root-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
