<template>
  <div class="navigation">
    <h2>Game List</h2>
    <router-link :to="{ name: 'dinosour' }">Dinosour Game</router-link>
    <router-link :to="{ name: 'poop' }">Poop Game</router-link>
  </div>
</template>

<style scoped>
.navigation {
  display: flex;
  flex-direction: column;
  font-family: "Black Han Sans", sans-serif;
  align-items: center;
  margin-top: 10rem;
}
.navigation h2 {
  font-size: 3rem;
}
.navigation a {
  color: black;
  text-decoration: none;
  margin-right: 0.5rem;
  transition: color 0.3s;
  margin-bottom: 2rem;
}
.navigation a:hover {
  color: dodgerblue;
}
</style>
