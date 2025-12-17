<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-burgundy-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-burgundy-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="text-4xl text-white font-bold">🍽️</span>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-burgundy-700 bg-clip-text text-transparent mb-2">РесторанПро</h1>
        <p class="text-black-600">Система управления бронированиями</p>
      </div>

      <!-- Card -->
      <div class="card-glass p-8 mb-6">
        <h2 class="text-2xl font-bold text-black-900 mb-8">Вход в систему</h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-black-700 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              class="input-field"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-black-700 mb-2">Пароль</label>
            <input
              v-model="password"
              type="password"
              class="input-field"
              placeholder="••••••••"
            />
          </div>


          <button type="submit" class="btn-primary w-full">
            Войти в систему
          </button>
        </form>

        <!-- Demo Info -->
        <div class="mt-8 p-4 bg-gradient-to-r from-primary-50 to-burgundy-50 border border-primary-200 rounded-lg">
          <p class="text-sm text-black-800 font-medium mb-2">📝 Демо учетные данные:</p>
          <p class="text-xs text-black-700"><strong>Клиент:</strong> user@test.com</p>
          <p class="text-xs text-black-700"><strong>Администратор:</strong> admin@test.com</p>
          <p class="text-xs text-black-700"><strong>Пароль:</strong> любой текст</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('user@test.com')
const password = ref('demo')

const handleLogin = () => {
  const role = email.value === 'admin@test.com' ? 'admin' : 'user'
  authStore.login(email.value, password.value, role)

  if (role === 'admin') {
    router.push('/admin/dashboard')
  } else {
    router.push('/user/hall-map')
  }
}

// Initialize authStore from storage at the top level
authStore.initializeFromStorage()
</script>
