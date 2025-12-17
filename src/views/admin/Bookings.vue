<template>
  <div class="space-y-8">
    <div>
      <h1 class="section-title">Управление бронированиями и предзаказами</h1>
      <p class="text-black-600">Просмотрите все бронирования и предварительные заказы</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 border-b border-black-200">
      <button
        @click="activeTab = 'bookings'"
        :class="activeTab === 'bookings' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-black-600'"
        class="px-4 py-3 font-medium transition-colors"
      >
        Бронирования
      </button>
      <button
        @click="activeTab = 'orders'"
        :class="activeTab === 'orders' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-black-600'"
        class="px-4 py-3 font-medium transition-colors"
      >
        Предзаказы
      </button>
    </div>

    <!-- Bookings Tab -->
    <div v-if="activeTab === 'bookings'" class="space-y-6">
      <div class="flex gap-4">
        <div>
          <label class="block text-sm font-medium text-black-700 mb-2">Выберите дату</label>
          <input v-model="selectedDate" type="date" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-black-700 mb-2">Фильтр по статусу</label>
          <select v-model="filterStatus" class="input-field">
            <option value="">Все статусы</option>
            <option value="confirmed">Подтверждено</option>
            <option value="cancelled">Отменено</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-primary-50 to-burgundy-50 border-b border-black-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Клиент</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Email</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Стол</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Дата и время</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Гостей</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Статус</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-black-200">
            <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-primary-50 transition-colors">
              <td class="px-6 py-4 font-medium text-black-900">{{ booking.userName }}</td>
              <td class="px-6 py-4 text-black-600 text-sm">{{ booking.userEmail }}</td>
              <td class="px-6 py-4 text-black-600">№ {{ booking.tableNumber }}</td>
              <td class="px-6 py-4 text-black-600">{{ formatDate(booking.date) }} в {{ booking.time }}</td>
              <td class="px-6 py-4 text-black-600">{{ booking.guests }}</td>
              <td class="px-6 py-4">
                <span :class="statusClass(booking.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ statusLabel(booking.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button v-if="booking.status !== 'cancelled'" @click="cancelBooking(booking.id)"
                        class="px-3 py-1 bg-burgundy-100 text-burgundy-700 rounded text-sm font-medium hover:bg-burgundy-200">
                  Отменить
                </button>
                <span v-else class="text-black-400 text-sm">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Orders Tab -->
    <div v-else class="space-y-6">
      <div class="table-container">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-primary-50 to-burgundy-50 border-b border-black-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">ID Бронирования</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Стол</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Дата и время</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Блюда</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Сумма</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Примечания</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Статус</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-black-700">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-black-200">
            <tr v-for="order in restaurantStore.orders" :key="order.id" class="hover:bg-primary-50 transition-colors">
              <td class="px-6 py-4 font-medium text-black-900">#{{ order.bookingId }}</td>
              <td class="px-6 py-4 text-black-600">
                № {{ getBookingInfo(order.bookingId).tableNumber }}
              </td>
              <td class="px-6 py-4 text-black-600">
                {{ formatDate(getBookingInfo(order.bookingId).date) }} в {{ getBookingInfo(order.bookingId).time }}
              </td>
              <td class="px-6 py-4 text-black-600 text-sm">
                <div v-for="item in order.items" :key="item.dishId" class="text-black-600">
                  {{ item.name }} ({{ item.quantity }} x {{ item.price }} ₽)
                </div>
              </td>
              <td class="px-6 py-4 font-bold text-primary-600">{{ order.totalPrice }} ₽</td>
              <td class="px-6 py-4 text-black-600 text-sm">{{ order.notes || '-' }}</td>
              <td class="px-6 py-4">
                <span :class="order.status === 'pending' ? 'bg-burgundy-100 text-burgundy-800' : 'bg-primary-100 text-primary-800'"
                      class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ order.status === 'pending' ? 'На рассмотрении' : 'Выполнено' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button v-if="order.status === 'pending'" @click="confirmOrder(order.id)"
                        class="px-3 py-1 bg-primary-100 text-primary-700 rounded text-sm font-medium hover:bg-primary-200">
                  Подтвердить
                </button>
                <span v-else class="text-black-400 text-sm">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRestaurantStore } from '../../stores/restaurant'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

const restaurantStore = useRestaurantStore()
const activeTab = ref('bookings')
const filterStatus = ref('')
const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'))

const filteredBookings = computed(() => {
  let bookings = restaurantStore.bookings.filter(b => b.date === selectedDate.value)
  if (filterStatus.value) {
    bookings = bookings.filter(b => b.status === filterStatus.value)
  }
  return bookings
})

const getBookingInfo = (bookingId) => {
  const booking = restaurantStore.bookings.find(b => b.id === bookingId)
  if (!booking) {
    return { tableNumber: '-', date: '-', time: '-' }
  }
  return {
    tableNumber: booking.tableNumber,
    date: booking.date,
    time: booking.time
  }
}

const formatDate = (dateStr) => {
  return format(parseISO(dateStr), 'd MMMM yyyy', { locale: ru })
}

const statusLabel = (status) => {
  const labels = {
    'confirmed': 'Подтверждено',
    'cancelled': 'Отменено'
  }
  return labels[status] || status
}

const statusClass = (status) => {
  const classes = {
    'confirmed': 'bg-primary-100 text-primary-800 border border-primary-200',
    'cancelled': 'bg-burgundy-100 text-burgundy-800 border border-burgundy-200'
  }
  return classes[status] || 'bg-black-100 text-black-800'
}

const cancelBooking = (id) => {
  if (confirm('Отменить бронирование?')) {
    restaurantStore.cancelBooking(id)
  }
}

const confirmOrder = (id) => {
  if (confirm('Подтвердить предзаказ?')) {
    restaurantStore.updateOrder(id, { status: 'completed' })
  }
}
</script>
