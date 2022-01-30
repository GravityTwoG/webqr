<template>
  <p>
    <va-icon name="copyright" />
    WebQR {{ currentYear }}. Developed by
    <a class="author" href="https://github.com/GravityTwoG" target="_blank"
      >GravityTwoG</a
    >
  </p>
</template>

<style scoped>
p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}
.author {
  display: inline-block;
  vertical-align: baseline;
  background-color: #fff;
  padding: 0.25rem 0.3rem 0.1rem;

  color: black;
  line-height: 1;
  transition: background-color 0.2s ease-out;
  box-shadow: var(--va-card-box-shadow, var(--va-block-box-shadow));
  border-radius: 6px;
}
.author:hover {
  background-color: #f1f1f1;
}
</style>

<script>
import { Options, Vue } from 'vue-class-component';

@Options({
  data() {
    return {
      currentYear: new Date(Date.now()).getFullYear(),
    };
  },
})
export default class Copyrights extends Vue {}
</script>
