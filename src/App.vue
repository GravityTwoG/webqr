<template>
  <div id="nav">
    <va-tabs center>
      <template #tabs>
        <va-tab
          v-for="tab in [
            { name: 'Scan', link: '/' },
            { name: 'Create', link: '/create' },
          ]"
          :key="tab.name"
        >
          <router-link v-bind:to="tab.link">{{ tab.name }}</router-link>
        </va-tab>
      </template>
    </va-tabs>
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
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: var(--va-primary);
}
</style>

<script>
import { Options, Vue } from 'vue-class-component';
import AppCopyrights from './components/Copyrights.vue';

@Options({
  components: { AppCopyrights },
})
export default class App extends Vue {}
</script>
