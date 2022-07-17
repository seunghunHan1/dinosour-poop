<template>
  <div>
    <InterfaceView :is-game-over="isGameOver" @re-start-game="reStartGame" />
    <canvas id="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import InterfaceView from "@/components/InterfaceView.vue";
import { CanvasElemClass, CanvasElemModel } from "@/types/canvasElemType";
import { onMounted, ref } from "@vue/runtime-core";

// 캔버스 정보
let canvas = {} as HTMLCanvasElement;
let ctx = {} as CanvasRenderingContext2D;

// 게임 정보
const isGameOver = ref<boolean>(false);

// 공룡 정보
let dino = new CanvasElemClass(10, 200, 60, 70);
let is_jumping = false;
const JUMP_SPEED = {
  up: 6,
  down: 7,
};

// 장애물 정보
let cactus = [] as CanvasElemModel[];
let CACTUS_CREATE_DELAY = 500;
let last_cactus_create_time = new Date().getTime();
const CACTUS_SPEED = 5;

// Interval
let frameInterval = 0;

// 이미지 리소스
const dinoImg = new Image();
const cactusImg = new Image();
dinoImg.src = require("@/assets/dinosour.png");
cactusImg.src = require("@/assets/cactus.png");

onMounted(() => {
  // 캔버스 정보 초기화
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  canvas.width = window.innerWidth - 100;
  canvas.height = window.innerHeight - 100;

  // 프레임마다 실행 시킬 함수
  runEveryFrame();

  // Dom Event
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !dino.jump) {
      is_jumping = true;
      dino.jump = true;
    }
  });
});

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

// 충돌체크
const checkCollision = () => {
  cactus.forEach((data) => {
    if (
      data.x - (dino.x + dino.width) < 0 &&
      data.y - (dino.y + dino.height) < 0
    ) {
      gameOver();
    }
  });
};

// 프레임 마다 실행항 작업
const runEveryFrame = () => {
  frameInterval = requestAnimationFrame(runEveryFrame);

  // 화면 지움
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 바닥 그림
  ctx.fillRect(0, 270, 600, 100);

  // CACTUS_CREATE_DELAY 마다 장애물 생성
  if (checkDelayTime(CACTUS_CREATE_DELAY, last_cactus_create_time)) {
    const rand_2_5 = Math.floor(Math.random() * 3) + 3;
    CACTUS_CREATE_DELAY = rand_2_5 * 1000;
    last_cactus_create_time = new Date().getTime();
    cactus.push(new CanvasElemClass(500, 220, 50, 50));
  }

  // 점프 중 일 떄
  if (dino.jump) {
    if (is_jumping && dino.y <= 100) {
      is_jumping = false;
    }
    dino.y = is_jumping
      ? dino.y - JUMP_SPEED.up
      : dino.y + JUMP_SPEED.down >= 200
      ? 200
      : dino.y + 3;

    dino.jump = dino.y < 200;
  }

  // 화면 그려 줌
  cactus.forEach((item, index, parent) => {
    // 화면에서 벗어 나면 제거
    item.x = item.x - CACTUS_SPEED;
    if (item.x < 0) {
      parent.splice(index, 1);
    }
    item.draw(ctx, cactusImg);
  });

  dino.draw(ctx, dinoImg);

  // 충돌 체크
  checkCollision();
};

// 게임 종료시
const gameOver = () => {
  cancelAnimationFrame(frameInterval);
  isGameOver.value = true;
};

// 게임 재시작
const reStartGame = () => {
  isGameOver.value = false;
  cactus = [] as CanvasElemModel[];
  runEveryFrame();
};
</script>
