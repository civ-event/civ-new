import { defineStore } from 'pinia';
import {
  fetchSession,
  fetchRoles,
  login as loginApi,
  logout as logoutApi,
  selectRole as selectRoleApi,
} from '../api/user';

const TOKEN_KEY = 'accessToken';

export const useUserStore = defineStore('user', {
  state: () => ({
    loaded: false,
    isLoggedIn: false,
    token: null,
    userName: null,
    role: null,
    roles: [],
  }),
  getters: {
    hasRole: (state) => Boolean(state.role?.roleId),
    canParticipate: (state) => state.isLoggedIn && state.role && state.role.level >= 5,
    displayName: (state) => state.userName || state.role?.roleName || '',
  },
  actions: {
    async loadSession() {
      const data = await fetchSession();
      this.isLoggedIn = Boolean(data.isLoggedIn);
      this.token = data.token ?? null;
      this.userName = data.userName ?? null;
      this.role = data.role ?? null;
      if (this.token) {
        localStorage.setItem(TOKEN_KEY, this.token);
        localStorage.setItem('civ_event_token', this.token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('civ_event_token');
      }
      this.loaded = true;
    },
    async login(payload = {}) {
      const data = await loginApi(payload);
      this.token = data.token;
      this.isLoggedIn = true;
      localStorage.setItem(TOKEN_KEY, data.token);
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
        // 本地也要清登录态
      }
      this.isLoggedIn = false;
      this.token = null;
      this.userName = null;
      this.role = null;
      this.roles = [];
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('civ_event_token');
    },
  },
});
