import { defineStore } from 'pinia';
import {
  fetchSession,
  fetchRoles,
  login as loginApi,
  logout as logoutApi,
  selectRole as selectRoleApi,
} from '../api/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    loaded: false,
    isLoggedIn: false,
    token: null,
    role: null,
    roles: [],
  }),
  getters: {
    hasRole: (state) => Boolean(state.role?.roleId),
    canParticipate: (state) => state.isLoggedIn && state.role && state.role.level >= 5,
  },
  actions: {
    async loadSession() {
      const data = await fetchSession();
      this.isLoggedIn = Boolean(data.isLoggedIn);
      this.token = data.token ?? null;
      this.role = data.role ?? null;
      if (this.token) {
        localStorage.setItem('civ_event_token', this.token);
      } else {
        localStorage.removeItem('civ_event_token');
      }
      this.loaded = true;
    },
    async login() {
      const data = await loginApi({});
      this.token = data.token;
      this.isLoggedIn = true;
      localStorage.setItem('civ_event_token', data.token);
      await this.loadSession();
      return data;
    },
    async loadRoles() {
      const data = await fetchRoles();
      this.roles = data.roles ?? [];
      return this.roles;
    },
    async selectRole(roleId) {
      const data = await selectRoleApi({ roleId });
      this.role = data.role;
      await this.loadSession();
      return data.role;
    },
    setRole(role) {
      this.role = role;
    },
    async logout() {
      try {
        await logoutApi();
      } catch {
        // 本地也要清登录态，避免接口失败后卡在已登录
      }
      this.isLoggedIn = false;
      this.token = null;
      this.role = null;
      this.roles = [];
      localStorage.removeItem('civ_event_token');
    },
  },
});
