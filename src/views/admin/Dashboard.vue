<template>
  <div class="space-y-8">
    <div>
      <h1 class="section-title">Администраторская панель</h1>
      <p class="text-black-600 text-lg">Обзор деятельности ресторана</p>
    </div>

    <!-- Statistics -->
    <div class="grid md:grid-cols-4 gap-6">
      <div class="card-glass p-6 border-l-4 border-primary-500">
        <div class="text-4xl mb-2">📅</div>
        <p class="text-black-600 text-sm mb-1">Бронирований сегодня</p>
        <p class="text-3xl font-bold text-black-900">{{ todayBookings }}</p>
      </div>

      <div class="card-glass p-6 border-l-4 border-burgundy-500">
        <div class="text-4xl mb-2">🪑</div>
        <p class="text-black-600 text-sm mb-1">Доступных столов</p>
        <p class="text-3xl font-bold text-black-900">{{ availableTables }}/{{ restaurantStore.tables.length }}</p>
      </div>

      <div class="card-glass p-6 border-l-4 border-primary-600">
        <div class="text-4xl mb-2">🍽️</div>
        <p class="text-black-600 text-sm mb-1">Блюд в меню</p>
        <p class="text-3xl font-bold text-black-900">{{ restaurantStore.menu.length }}</p>
      </div>

      <div class="card-glass p-6 border-l-4 border-burgundy-600">
        <div class="text-4xl mb-2">💰</div>
        <p class="text-black-600 text-sm mb-1">Предзаказано на сумму</p>
        <p class="text-3xl font-bold text-primary-600">{{ totalOrdersPrice }} ₽</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card-glass p-8">
      <h2 class="text-2xl font-bold text-black-900 mb-6">Быстрые действия</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <router-link to="/admin/tables" class="btn-primary text-center">
          Управление столами
        </router-link>
        <router-link to="/admin/menu" class="btn-burgundy text-center">
          Управление меню
        </router-link>
        <router-link to="/admin/bookings" class="btn-secondary text-center">
          Просмотр бронирований
        </router-link>
      </div>
    </div>

    <!-- Recent Bookings -->
    <div class="card-glass p-8">
      <h2 class="text-2xl font-bold text-black-900 mb-6">Последние бронирования</h2>
      <div v-if="restaurantStore.bookings.length === 0" class="text-center py-8 text-black-500">
        Нет бронирований
      </div>
      <div v-else class="table-container">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-primary-50 to-burgundy-50 border-b border-black-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Клиент</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Стол</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Дата и время</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Гостей</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Статус</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-black-200">
            <tr v-for="booking in restaurantStore.bookings.slice(0, 5)" :key="booking.id" class="hover:bg-primary-50 transition-colors">
              <td class="px-6 py-4 text-black-900 font-medium">{{ booking.userName }}</td>
              <td class="px-6 py-4 text-black-600">№ {{ booking.tableNumber }}</td>
              <td class="px-6 py-4 text-black-600">{{ formatDate(booking.date) }} в {{ booking.time }}</td>
              <td class="px-6 py-4 text-black-600">{{ booking.guests }}</td>
              <td class="px-6 py-4">
                <span :class="statusClass(booking.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ statusLabel(booking.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRestaurantStore } from '../../stores/restaurant'
import { format, parseISO, isToday } from 'date-fns'
import { ru } from 'date-fns/locale'

const restaurantStore = useRestaurantStore()

const todayBookings = computed(() => {
  return restaurantStore.bookings.filter(b => 
    isToday(parseISO(b.date)) && b.status === 'confirmed'
  ).length
})

const availableTables = computed(() => {
  const today = format(new Date(), 'yyyy-MM-dd')
  return restaurantStore.tables.filter(t =>
    !restaurantStore.bookings.some(b =>
      b.tableId === t.id &&
      b.date === today &&
      b.status === 'confirmed'
    )
  ).length
})

const totalOrdersPrice = computed(() => {
  return restaurantStore.orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.totalPrice : 0), 0)
})

const formatDate = (dateStr) => {
  return format(parseISO(dateStr), 'd MMMM yyyy', { locale: ru })
}

const statusLabel = (status) => {
  const labels = {
    'confirmed': 'Подтверждено',
    'pending': 'Ожидание',
    'cancelled': 'Отменено'
  }
  return labels[status] || status
}

const statusClass = (status) => {
  const classes = {
    'confirmed': 'bg-primary-100 text-primary-800 border border-primary-200',
    'pending': 'bg-burgundy-100 text-burgundy-800 border border-burgundy-200',
    'cancelled': 'bg-black-100 text-black-800 border border-black-200'
  }
  return classes[status] || 'bg-black-100 text-black-800'
}
</script>
