<script setup lang="ts">
import InlineSvg from 'vue-inline-svg';
</script>

<template>
  <div class="navbar">
    <router-link class="link" key="/" to="/">
      <InlineSvg src="/Camera.svg" aria-label="Scan QR with Camera" />
    </router-link>

    <router-link class="link" key="/scan-image" to="/scan-image">
      <InlineSvg src="/Image.svg" aria-label="Scan QR with Camera" />
    </router-link>

    <router-link class="link" key="/create" to="/create">
      Create
      <InlineSvg src="/QRCode.svg" aria-label="Scan QR with Camera" />
    </router-link>
  </div>
</template>

<style scoped>
.navbar {
  margin: auto;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  padding: 1rem;
  display: flex;
  overflow: auto;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.navbar .link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--color-paper);
  border-radius: 2rem;
  font-weight: bold;
  line-height: 1;
  transition: color 0.2s ease-out, background-color 0.2s ease-out;
  box-shadow: var(--shadow-paper);
  text-decoration: none;
  color: var(--color-text);
  text-align: center;
}

.navbar .link svg {
  width: 2rem;
  height: 2rem;
  fill: var(--color-text);
}

.navbar .link:hover {
  background-color: var(--color-deco);
}

.navbar .link.router-link-exact-active svg {
  fill: var(--color-accent);
}

.navbar .link.router-link-exact-active {
  color: var(--color-accent);
}
</style>
