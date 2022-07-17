<template>
  <InterfaceView :is-game-over="isGameOver" @re-start-game="reStartGame" />
  <canvas id="canvas"></canvas>
</template>

<script lang="ts" setup>
import InterfaceView from "@/components/InterfaceView.vue";
import { CanvasElemClass, CanvasElemModel } from "@/types/canvasElemType";
import { onMounted, reactive, ref, watch } from "vue";
// 캔버스 정보
let canvas = {} as HTMLCanvasElement;
let ctx = {} as CanvasRenderingContext2D;

// 게임 정보
const isGameOver = ref<boolean>(false);

let keyBoardPressInfo = reactive<{
  status: boolean;
  keyCode: number;
}>({
  status: false,
  keyCode: 0,
});

// 주인공 정보
let hero = new CanvasElemClass(30, 473, 60, 80);
let is_jumping = false;
const HERO_SPEED = 2;
const JUMP_SPEED = {
  up: 6,
  down: 5,
};

// 장애물 정보
let poopList = [] as CanvasElemModel[];
let POOP_CREATE_DELAY = 500;
let last_poop_create_time = 0;
const POOP_SPEED = 8;
// Interval
let frameInterval = 0;
let keyInterval = 0;

// 이미지 리소스
const heroImg = new Image();
heroImg.src = require("@/assets/hero.png");
const poopImg = new Image();
poopImg.src = require("@/assets/poop.png");

onMounted(() => {
  // 캔버스 정보 초기화
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  canvas.width = window.innerWidth - 100;
  canvas.height = window.innerHeight - 20;

  // 프레임마다 실행 시킬 함수
  runEveryFrame();

  // Dom Event
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
});

const runEveryFrame = () => {
  frameInterval = requestAnimationFrame(runEveryFrame);

  // 화면 지움
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 바닥 그림
  ctx.fillRect(0, 550, 1000, 50);

  // POOP_CREATE_DELAY 마다 장애물 생성
  if (checkDelayTime(POOP_CREATE_DELAY, last_poop_create_time)) {
    const create_rand = Math.floor(Math.random() * 3) + 1;
    POOP_CREATE_DELAY = create_rand * 1000;
    last_poop_create_time = new Date().getTime();

    const pos_rand = Math.floor(Math.random() * 10);
    poopList.push(new CanvasElemClass(pos_rand * 100, 0, 50, 50));
  }

  // 점프 중 일 떄
  if (hero.jump) {
    if (is_jumping && hero.y <= 380) {
      is_jumping = false;
    }
    hero.y = is_jumping
      ? hero.y - JUMP_SPEED.up
      : hero.y + JUMP_SPEED.down <= 380
      ? 380
      : hero.y + JUMP_SPEED.down;

    hero.jump = hero.y < 473;
  }

  // 화면 그려 줌
  poopList.forEach((item, index, parent) => {
    // 화면에서 벗어 나면 제거
    item.y = item.y + POOP_SPEED;
    if (item.y > 500) {
      parent.splice(index, 1);
    }
    item.draw(ctx, poopImg);
  });
  hero.draw(ctx, heroImg);

  // 충돌 체크
  checkCollision();
};

// 충돌체크
const checkCollision = () => {
  poopList.forEach((data) => {
    console.log();
    if (
      data.x - hero.x < hero.width &&
      data.x - hero.x >= -data.width &&
      hero.y - data.y <= 0
    ) {
      gameOver();
    }
  });
};

// fromTime으로 부터 DelayTime까지 지났는지 체크
const checkDelayTime = (delayTime: number, fromTime: number): boolean => {
  var curTime = new Date().getTime();
  var diff = curTime - fromTime;

  if (diff > delayTime) {
    fromTime = curTime;
    return true;
  } else {
    return false;
  }
};

const onKeyDown = (e: KeyboardEvent) => {
  const keyCode = e.keyCode;
  const TOP = 38;
  const LEFT = 37;
  const RIGHT = 39;
  switch (keyCode) {
    case TOP:
      if (!hero.jump) {
        is_jumping = true;
        hero.jump = true;
      }
      break;
    case LEFT:
      keyBoardPressInfo.status = true;
      keyBoardPressInfo.keyCode = LEFT;
      break;
    case RIGHT:
      keyBoardPressInfo.status = true;
      keyBoardPressInfo.keyCode = RIGHT;
      break;
  }
};

const onKeyUp = (e: KeyboardEvent) => {
  const keyCode = e.keyCode;

  const LEFT = 37;
  const RIGHT = 39;
  if (keyCode === LEFT || keyCode === RIGHT) {
    keyBoardPressInfo.status = false;
    keyBoardPressInfo.keyCode = 0;
  }
};

watch(
  () => keyBoardPressInfo.status,
  (newVal: boolean) => {
    if (newVal) {
      keyInterval = setInterval(() => {
        hero.x =
          keyBoardPressInfo.keyCode === 37
            ? hero.x - HERO_SPEED
            : hero.x + HERO_SPEED;
        if (hero.x >= 850) {
          hero.x = 850;
        } else if (hero.x <= 0) hero.x = 0;
      });
    } else {
      clearInterval(keyInterval);
    }
  }
);

// 게임 종료시
const gameOver = () => {
  cancelAnimationFrame(frameInterval);
  isGameOver.value = true;
};

// 게임 재시작
const reStartGame = () => {
  isGameOver.value = false;
  hero = new CanvasElemClass(30, 473, 60, 80);
  is_jumping = false;
  poopList = [] as CanvasElemModel[];
  runEveryFrame();
};
</script>
