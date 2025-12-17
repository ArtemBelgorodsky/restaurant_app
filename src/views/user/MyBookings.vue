<template>
  <div class="space-y-8">
    <div>
      <h1 class="section-title">📅 Мои бронирования</h1>
      <p class="text-slate-600">Просмотрите и управляйте своими бронированиями</p>
    </div>

    <div v-if="myBookings.length === 0" class="card-glass p-12 text-center">
      <div class="text-6xl mb-4">🍽️</div>
      <h2 class="text-2xl font-bold text-slate-900 mb-2">Нет бронирований</h2>
      <p class="text-slate-600 mb-6">Забронируйте стол в нашем ресторане и откройте новые вкусовые впечатления</p>
      <router-link to="/user/hall-map" class="btn-primary inline-block">
        Забронировать стол
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div v-for="booking in myBookings" :key="booking.id" 
           :class="{ 'opacity-60': booking.status === 'cancelled' }"
           class="card-glass p-6 border-l-4 transition-all hover:shadow-lg"
           :style="{ borderColor: booking.status === 'confirmed' ? '#059669' : '#dc2626' }">
        
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-2xl font-bold text-slate-900">Стол №{{ booking.tableNumber }}</h3>
            <p class="text-slate-600">Бронирование #{{ booking.id }}</p>
          </div>
          <span :class="booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-3 py-1 rounded-full text-sm font-medium">
            {{ booking.status === 'confirmed' ? 'Подтверждено' : 'Отменено' }}
          </span>
        </div>

        <div class="grid md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-200">
          <div>
            <p class="text-sm text-slate-600 mb-1">📅 Дата</p>
            <p class="font-semibold text-slate-900">{{ formatDate(booking.date) }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600 mb-1">🕐 Время</p>
            <p class="font-semibold text-slate-900">{{ booking.time }}</p>
          </div>
          <div>
            <p class="text-sm text-slate-600 mb-1">👥 Гостей</p>
            <p class="font-semibold text-slate-900">{{ booking.guests }} человек</p>
          </div>
        </div>

        <!-- Order Info -->
        <div v-if="getOrderForBooking(booking.id)" class="mb-6 pb-6 border-b border-slate-200">
          <h4 class="font-semibold text-slate-900 mb-3">📦 Предзаказ:</h4>
          <div class="bg-slate-50 p-4 rounded-lg">
            <div v-for="item in getOrderForBooking(booking.id).items" :key="item.dishId" 
                 class="flex justify-between text-sm mb-2 last:mb-0">
              <span class="text-slate-700">{{ item.name }} × {{ item.quantity }}</span>
              <span class="font-medium text-slate-900">{{ item.quantity * item.price }} ₽</span>
            </div>
            <div class="border-t border-slate-200 mt-3 pt-3 flex justify-between font-bold text-slate-900">
              <span>Итого:</span>
              <span class="text-primary-600">{{ getOrderForBooking(booking.id).totalPrice }} ₽</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="booking.status === 'confirmed'" class="flex gap-2">
          <router-link :to="`/user/edit-booking/${booking.id}`" class="btn-secondary text-center flex-1">
            Редактировать бронь
          </router-link>
          <router-link :to="`/user/order/${booking.id}`" class="btn-secondary text-center flex-1">
            Изменить заказ
          </router-link>
          <button @click="cancelBooking(booking.id)" class="btn-secondary flex-1">
            Отменить бронирование
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card-glass p-8 text-center">
      <p class="text-slate-600 mb-4">Хотите забронировать еще один стол?</p>
      <router-link to="/user/hall-map" class="btn-primary inline-block">
        Забронировать стол
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRestaurantStore } from '../../stores/restaurant'
import { parseISO, format } from 'date-fns'
import { ru } from 'date-fns/locale'

const authStore = useAuthStore()
const restaurantStore = useRestaurantStore()

const myBookings = computed(() => {
  return restaurantStore.bookings.filter(b => b.userEmail === authStore.user.email)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'EEEE, d MMMM yyyy', { locale: ru })
  } catch {
    return dateStr
  }
}

const getOrderForBooking = (bookingId) => {
  return restaurantStore.orders.find(o => o.bookingId === bookingId)
}

const cancelBooking = (bookingId) => {
  if (confirm('Вы уверены? Это действие необратимо.')) {
    restaurantStore.cancelBooking(bookingId)
  }
}
</script>
