<template>
  <div class="min-h-screen bg-gradient-to-br from-black-50 via-primary-50 to-burgundy-50">
    <!-- Навигационное меню -->
    <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-primary-200 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-burgundy-600 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-lg">РП</span>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-primary-600 to-burgundy-700 bg-clip-text text-transparent">РесторанПро</span>
          </div>

          <div class="flex items-center space-x-6">
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/login"
              class="nav-link"
            >
              Вход
            </router-link>

            <div v-else class="flex items-center space-x-4">
              <router-link
                v-if="authStore.user.role !== 'admin'"
                to="/user/my-bookings"
                class="nav-link"
              >
                Мои бронирования
              </router-link>
              <span class="text-sm text-black-600">
                <span class="font-semibold text-black-900">{{ authStore.user.name }}</span>
                <span class="mx-2 text-primary-400">•</span>
                <span class="accent-gold">{{ roleLabel }}</span>
              </span>
              <button
                @click="logout"
                class="px-4 py-2 bg-gradient-to-r from-black-100 to-black-200 hover:from-black-200 hover:to-black-300 text-black-700 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm"
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Основной контент -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const roleLabel = computed(() => {
  return authStore.user.role === 'admin' ? 'Администратор' : 'Клиент'
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
