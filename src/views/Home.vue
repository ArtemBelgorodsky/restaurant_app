<template>
  <div class="space-y-8">
    <div class="text-center py-12 bg-gradient-to-r from-primary-50 to-burgundy-50 rounded-2xl border border-primary-200">
      <h1 class="text-4xl font-bold text-black-900 mb-4">Добро пожаловать в РесторанПро</h1>
      <p class="text-xl text-black-600">Выберите действие ниже для начала работы</p>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <router-link 
        v-if="authStore.user.role === 'user'"
        to="/user/hall-map"
        class="group card-glass p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <div class="text-5xl mb-4">🗺️</div>
        <h2 class="text-2xl font-bold text-black-900 mb-2">Интерактивная карта зала</h2>
        <p class="text-black-600">Просмотрите доступные столы и сделайте бронирование</p>
      </router-link>

      <router-link
        v-if="authStore.user.role === 'user'"
        to="/user/my-bookings"
        class="group card-glass p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <div class="text-5xl mb-4">📅</div>
        <h2 class="text-2xl font-bold text-black-900 mb-2">Мои бронирования</h2>
        <p class="text-black-600">Просмотрите и управляйте своими бронированиями</p>
      </router-link>

      <router-link
        v-if="authStore.user.role === 'admin'"
        to="/admin/dashboard"
        class="group card-glass p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <div class="text-5xl mb-4">📊</div>
        <h2 class="text-2xl font-bold text-black-900 mb-2">Администраторский панель</h2>
        <p class="text-black-600">Просмотр статистики и управление рестораном</p>
      </router-link>

      <router-link
        v-if="authStore.user.role === 'admin'"
        to="/admin/tables"
        class="group card-glass p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <div class="text-5xl mb-4">🪑</div>
        <h2 class="text-2xl font-bold text-black-900 mb-2">Управление столами</h2>
        <p class="text-black-600">Добавляйте и редактируйте столы в ресторане</p>
      </router-link>

      <router-link
        v-if="authStore.user.role === 'admin'"
        to="/admin/menu"
        class="group card-glass p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <div class="text-5xl mb-4">🍽️</div>
        <h2 class="text-2xl font-bold text-black-900 mb-2">Управление меню</h2>
        <p class="text-black-600">Добавляйте и редактируйте блюда в меню</p>
      </router-link>

      <router-link
        v-if="authStore.user.role === 'admin'"
        to="/admin/bookings"
        class="group card-glass p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        <div class="text-5xl mb-4">📋</div>
        <h2 class="text-2xl font-bold text-black-900 mb-2">Все бронирования</h2>
        <p class="text-black-600">Просмотрите все бронирования и предзаказы</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>
