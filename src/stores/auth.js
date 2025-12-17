import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null)
  const isAuthenticated = computed(() => user.value !== null)

  const login = (email, password, role) => {
    user.value = {
      id: Math.random(),
      email,
      name: role === "admin" ? "Администратор Ресторана" : "Иван Петров",
      role,
    }
    localStorage.setItem("user", JSON.stringify(user.value))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem("user")
  }

  const initializeFromStorage = () => {
    const stored = localStorage.getItem("user")
    if (stored) {
      user.value = JSON.parse(stored)
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initializeFromStorage,
  }
})
