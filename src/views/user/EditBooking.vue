<template>
  <div class="space-y-8">
    <div>
      <h1 class="section-title">Редактирование бронирования стола №{{ table?.number }}</h1>
      <p class="text-slate-600">Измените детали вашего бронирования</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Form -->
      <div class="lg:col-span-2">
        <form @submit.prevent="submitBooking" class="card-glass p-8 space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Дата</label>
              <input v-model="form.date" type="date" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Время</label>
              <input v-model="form.time" type="time" class="input-field" required />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Количество гостей</label>
              <input v-model.number="form.guests" type="number" min="1" :max="table?.seats" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Имя</label>
              <input v-model="form.name" type="text" class="input-field" required />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input v-model="form.email" type="email" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Телефон</label>
              <input v-model="form.phone" type="tel" class="input-field" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Специальные пожелания</label>
            <textarea v-model="form.notes" class="input-field" rows="4" placeholder="Например: день рождения, романтический ужин..."></textarea>
          </div>

          <div class="flex gap-4">
            <button type="submit" class="btn-primary flex-1">
              Сохранить изменения
            </button>
            <router-link to="/user/my-bookings" class="btn-secondary flex-1 text-center">
              Отмена
            </router-link>
          </div>
        </form>
      </div>

      <!-- Summary -->
      <div class="card-glass p-8 h-fit sticky top-24">
        <h3 class="text-xl font-bold text-slate-900 mb-6">Сводка бронирования</h3>
        <div class="space-y-4 border-b border-slate-200 pb-6">
          <div class="flex justify-between">
            <span class="text-slate-600">Стол:</span>
            <span class="font-semibold text-slate-900">№{{ table?.number }} ({{ table?.section }})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600">Дата:</span>
            <span class="font-semibold text-slate-900">{{ formatDate(form.date) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600">Время:</span>
            <span class="font-semibold text-slate-900">{{ form.time }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600">Гостей:</span>
            <span class="font-semibold text-slate-900">{{ form.guests }} из {{ table?.seats }} мест</span>
          </div>
        </div>
        <div class="mt-6 text-sm text-slate-600">
          <p class="mb-4">📋 После сохранения изменений:</p>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <span class="text-primary-600 font-bold">✓</span>
              <span>Вы сможете изменить предварительный заказ меню</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-600 font-bold">✓</span>
              <span>Получить обновленное подтверждение</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useRestaurantStore } from '../../stores/restaurant'
import { parseISO, format } from 'date-fns'
import { ru } from 'date-fns/locale'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const restaurantStore = useRestaurantStore()

const bookingId = parseInt(route.params.bookingId)
const booking = computed(() => restaurantStore.bookings.find(b => b.id === bookingId && b.userEmail === authStore.user.email))
const table = computed(() => restaurantStore.getTableById(booking.value?.tableId))

const form = ref({
  date: '',
  time: '',
  guests: 2,
  name: '',
  email: '',
  phone: '',
  notes: ''
})

onMounted(() => {
  if (booking.value) {
    form.value = {
      date: booking.value.date,
      time: booking.value.time,
      guests: booking.value.guests,
      name: booking.value.userName,
      email: booking.value.userEmail,
      phone: '',
      notes: ''
    }
  } else {
    router.push('/user/my-bookings')
  }
})

const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'EEEE, d MMMM yyyy', { locale: ru })
  } catch {
    return dateStr
  }
}

const submitBooking = () => {
  if (booking.value) {
    restaurantStore.updateBooking(bookingId, {
      guests: form.value.guests,
      date: form.value.date,
      time: form.value.time,
      userName: form.value.name,
      userEmail: form.value.email
    })

    alert('✅ Бронирование обновлено!')
    router.push('/user/my-bookings')
  }
}
</script>