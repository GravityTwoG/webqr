<template>
  <div class="navbar">
    <router-link
      v-for="tab in [
        { name: 'Scan', link: '/' },
        { name: 'Scan Image', link: '/scan-image' },
        { name: 'Create', link: '/create' },
      ]"
      class="link"
      :key="tab.name"
      :to="tab.link"
    >
      {{ tab.name }}
    </router-link>

    <slot />
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
  gap: 0.5rem;
}

.navbar .link {
  display: inline-block;
  min-width: 6.5rem;
  padding: 0.5rem 0.5rem 0.4rem;
  background-color: var(--color-paper);
  border-radius: 6px;
  font-weight: bold;
  line-height: 1;
  transition: color 0.2s ease-out, background-color 0.2s ease-out;
  box-shadow: var(--shadow-paper);
  text-decoration: none;
  color: var(--color-text);
  text-align: center;
}

.navbar .link:hover {
  background-color: var(--color-deco);
}

.navbar .link.router-link-exact-active {
  color: var(--color-accent);
}
</style>
