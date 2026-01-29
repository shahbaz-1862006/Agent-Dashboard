import { createRouter as createVueRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from './auth/authStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/invite',
  },
  {
    path: '/invite',
    component: () => import('@/pages/auth/InviteEntryPage.vue'),
  },
  {
    path: '/login',
    component: () => import('@/pages/auth/LoginPage.vue'),
  },
  {
    path: '/register',
    component: () => import('@/pages/auth/RegisterPage.vue'),
  },
  // Backwards compatible redirects
  {
    path: '/auth/login',
    redirect: '/login',
  },
  {
    path: '/auth/register',
    redirect: '/register',
  },
  {
    path: '/dashboard',
    component: () => import('@/app/shell/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: 'home',
      },
      {
        path: 'home',
        component: () => import('@/pages/dashboard/HomePage.vue'),
      },
      {
        path: 'wallet',
        component: () => import('@/pages/dashboard/WalletPage.vue'),
      },
      {
        path: 'players',
        component: () => import('@/pages/dashboard/PlayersPage.vue'),
      },
      {
        path: 'players/:playerId',
        component: () => import('@/pages/dashboard/PlayerDetailPage.vue'),
      },
      {
        path: 'invites',
        component: () => import('@/pages/dashboard/InvitesPage.vue'),
      },
      {
        path: 'payouts',
        component: () => import('@/pages/dashboard/PayoutsPage.vue'),
      },
      {
        path: 'commissions',
        component: () => import('@/pages/dashboard/CommissionsPage.vue'),
      },
      {
        path: 'commissions/statements/:statementId',
        component: () => import('@/pages/dashboard/StatementDetailPage.vue'),
      },
      {
        path: 'clan',
        component: () => import('@/pages/dashboard/ClanOverviewPage.vue'),
      },
      {
        path: 'clan/goals',
        component: () => import('@/pages/dashboard/ClanGoalsPage.vue'),
      },
      {
        path: 'clan/wars',
        component: () => import('@/pages/dashboard/ClanWarsPage.vue'),
      },
      {
        path: 'clan/wars/:warId',
        component: () => import('@/pages/dashboard/WarDetailPage.vue'),
      },
      {
        path: 'settings',
        component: () => import('@/pages/dashboard/SettingsPage.vue'),
      },
    ],
  },
  {
    path: '/404',
    component: () => import('@/pages/misc/NotFoundPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

export function createRouter(): Router {
  const router = createVueRouter({
    history: createWebHashHistory(),
    routes,
  })

  // Auth guard
  router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.meta.requiresAuth

    if (requiresAuth && !authStore.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  })

  return router
}
