<script setup lang="ts">
import FlagIcon from "./icons/FlagIcon.vue";
</script>

<template>
  <div class="dessertmenu">
    <h2>
      <FlagIcon />
      <span class="title word-1"> Dessert </span>
      <span class="title word-2"> menu </span><FlagIcon />
    </h2>
    <div class="flex-list">
      <ul>
        <li>
          <a
            href="https://github.com/blueboxes/serverless-workflow-visualizer-signalr"
            >GitHub Repo</a
          >
          (the star of our desserts ⭐)
        </li>
        <li>Blog post (the chef is still working on this ✍️)</li>
        <li>
          <a href="https://www.youtube.com/watch?v=FmxAf8TfFkc"
            >Signalr on YouTube</a
          >
        </li>
      </ul>
    </div>
    <p>Contact <a href="https://twitter.com/johnkilmister">the chef</a> 🧑‍🍳</p>
  </div>
</template>

<style scoped>
.dessertmenu {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
}

.dessertmenu h2 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  border-bottom: 0.2rem solid var(--color-accent);
}

.dessertmenu p {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 0.2rem solid var(--color-accent);
}

ul {
  margin-top: 0.5rem;
}

li {
  margin-bottom: 0.5rem;
}

h2,
p {
  text-align: center;
}

.flex-list {
  display: flex;
  justify-content: center;
  text-align: left;
}

@media (min-width: 1024px) {
  h2,
  p {
    text-align: left;
  }
}
</style>
