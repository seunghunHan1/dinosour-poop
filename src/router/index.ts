import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DinosourView from "../views/DinosourView.vue";
import PoopView from "../views/PoopView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/dinosour",
    name: "dinosour",
    component: DinosourView,
  },
  {
    path: "/poop",
    name: "poop",
    component: PoopView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
