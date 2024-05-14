<script lang="ts" setup>
import AppCopyrights from './components/Copyrights.vue';
</script>

<template>
  <div id="nav">
    <router-link
      v-for="tab in [
        { name: 'Scan QR', link: '/' },
        { name: 'Create QR', link: '/create' },
      ]"
      :key="tab.name"
      :to="tab.link"
      >{{ tab.name }}</router-link
    >
  </div>

  <div class="app-content">
    <router-view />
  </div>

  <app-copyrights />
</template>

<style>
*,
*::after,
*::before {
  -webkit-tap-highlight-color: transparent;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  min-height: 100vh;

  background: -webkit-linear-gradient(
    90deg,
    #1485e6,
    #00c2f0,
    #2ceeb8
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    90deg,
    #1485e6,
    #00c2f0,
    #2ceeb8
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  display: flex;
  flex-direction: column;
  /* justify-content: flex-start; */
  align-items: stretch;
}

.app-content {
  flex: 1;
}

#nav {
  width: 100%;
  margin: auto;
  padding: 1rem;
}

#nav a {
  display: inline-block;
  min-width: 6.5rem;
  margin: 0.5rem;
  padding: 0.5rem 0.8rem 0.4rem;
  background-color: #fff;
  border-radius: 6px;
  font-weight: bold;
  line-height: 1;
  color: #2c3e50;
  transition: color 0.2s ease-out, background-color 0.2s ease-out;
  box-shadow: var(--va-card-box-shadow, var(--va-block-box-shadow));
}

#nav a:hover {
  background-color: #f1f1f1;
}

#nav a.router-link-exact-active {
  color: var(--va-primary);
}
</style>
