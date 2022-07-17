<template>
  <div class="score">{{ convertedScore }}</div>
  <div class="re-start" @click="reStartGame" v-show="isGameOver">RESTART</div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, PropType, computed, watch } from "vue";

const props = defineProps({
  isGameOver: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "reStartGame"): void;
}>();

const score = ref<number>(0);

const convertedScore = computed(() => {
  let zero = "";
  const digits = 5;
  const temp = score.value.toString();

  if (temp.length < digits) {
    for (var i = 0; i < digits - temp.length; i++) zero += "0";
  }
  return zero + temp;
});

let scoreInterval = setInterval(() => {
  score.value++;
}, 100);

const reStartGame = () => {
  emit("reStartGame");
  score.value = 0;
  scoreInterval = setInterval(() => {
    score.value++;
  }, 100);
};

watch(
  () => props.isGameOver,
  (newVal) => {
    if (newVal) {
      clearInterval(scoreInterval);
    }
  }
);
</script>

<style scoped>
.score {
  font-family: "Black Han Sans", sans-serif;
  position: fixed;
  top: 50px;
  left: 535px;
  font-size: 1.5rem;
}
.re-start {
  font-family: "Black Han Sans", sans-serif;
  position: fixed;
  top: 150px;
  left: 250px;
  font-size: 1.5rem;
  transition: color 0.5s;
  cursor: pointer;
}
.re-start:hover {
  color: dodgerblue;
}
</style>
