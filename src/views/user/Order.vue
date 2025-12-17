<template>
  <div class="space-y-8">
    <div>
      <h1 class="section-title">Предварительный заказ</h1>
      <p class="text-slate-600">Бронирование: {{ booking?.tableNumber }} стол на {{ formatDate(booking?.date) }} в {{ booking?.time }}</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Menu -->
      <div class="lg:col-span-2 space-y-6">
        <div v-for="category in categories" :key="category" class="card-glass p-6">
          <h3 class="text-xl font-bold text-slate-900 mb-4">{{ category }}</h3>
          <div class="grid gap-4">
            <div v-for="dish in getDishesInCategory(category)" :key="dish.id"
                 class="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <div class="flex items-start gap-3 mb-1">
                    <img :src="dish.image" :alt="dish.name" class="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div>
                      <h4 class="font-semibold text-slate-900">{{ dish.name }}</h4>
                      <p class="text-sm text-slate-600 mt-1">{{ dish.description }}</p>
                    </div>
                  </div>
                </div>
                <span class="text-lg font-bold text-primary-600 whitespace-nowrap ml-4">{{ dish.price }} ₽</span>
              </div>
              <div class="flex items-center gap-2">
                <button @click="removeDish(dish.id)"
                        class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
                  −
                </button>
                <input v-model.number="quantities[dish.id]" type="number" min="0" max="99"
                       class="w-16 px-2 py-1 border border-slate-200 rounded text-center" />
                <button @click="addDish(dish)"
                        class="w-8 h-8 rounded-lg bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart -->
      <div class="lg:sticky lg:top-24 lg:h-fit">
        <div class="card-glass p-8">
          <h3 class="text-xl font-bold text-slate-900 mb-6">Ваш заказ</h3>
          
          <div v-if="cartItems.length === 0" class="text-center py-8 text-slate-500">
            Добавьте блюда в заказ
          </div>

          <div v-else class="space-y-4">
            <div v-for="item in cartItems" :key="item.id" class="border-b border-slate-200 pb-3 last:border-b-0">
              <div class="flex justify-between mb-1">
                <span class="font-medium text-slate-900">{{ item.name }}</span>
                <span class="text-slate-600">x{{ item.quantity }}</span>
              </div>
              <div class="text-sm text-right text-slate-600">
                {{ item.quantity }} × {{ item.price }} = {{ item.quantity * item.price }} ₽
              </div>
            </div>

            <div class="border-t border-slate-200 pt-4 mt-4">
              <div class="flex justify-between items-center mb-4">
                <span class="text-lg font-bold text-slate-900">Итого:</span>
                <span class="text-2xl font-bold text-primary-600">{{ totalPrice }} ₽</span>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Примечания к заказу</label>
                <textarea v-model="orderNotes" class="input-field" rows="3" 
                         placeholder="Пожелания, аллергии, особые требования..."></textarea>
              </div>

              <div class="flex gap-3 mt-6">
                <button @click="submitOrder" class="btn-primary flex-1">
                  Подтвердить заказ
                </button>
                <router-link to="/user/my-bookings" class="btn-secondary flex-1 text-center p-5">
                  Позже
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRestaurantStore } from '../../stores/restaurant'
import { parseISO, format } from 'date-fns'
import { ru } from 'date-fns/locale'

const route = useRoute()
const router = useRouter()
const restaurantStore = useRestaurantStore()

const bookingId = parseInt(route.params.bookingId)
const booking = computed(() => restaurantStore.bookings.find(b => b.id === bookingId))
const existingOrder = computed(() => restaurantStore.orders.find(o => o.bookingId === bookingId))
const quantities = ref({})
const orderNotes = ref('')

// Initialize quantities
const initializeQuantities = () => {
  restaurantStore.menu.forEach(dish => {
    quantities.value[dish.id] = 0
  })

  // Load existing order quantities
  if (existingOrder.value) {
    existingOrder.value.items.forEach(item => {
      quantities.value[item.dishId] = item.quantity
    })
    orderNotes.value = existingOrder.value.notes || ''
  }

  // Override with saved changes
  const savedQuantities = localStorage.getItem(`order_quantities_${bookingId}`)
  if (savedQuantities) {
    const saved = JSON.parse(savedQuantities)
    Object.assign(quantities.value, saved)
  }

  const savedNotes = localStorage.getItem(`order_notes_${bookingId}`)
  if (savedNotes) {
    orderNotes.value = savedNotes
  }
}

onMounted(() => {
  initializeQuantities()
})

// Watch for changes and save to localStorage
watch(quantities, (newVal) => {
  localStorage.setItem(`order_quantities_${bookingId}`, JSON.stringify(newVal))
}, { deep: true, immediate: false })

watch(orderNotes, (newVal) => {
  localStorage.setItem(`order_notes_${bookingId}`, newVal)
}, { immediate: false })

const categories = computed(() => {
  return [...new Set(restaurantStore.menu.map(d => d.category))]
})

const getDishesInCategory = (category) => {
  return restaurantStore.menu.filter(d => d.category === category)
}

const cartItems = computed(() => {
  return restaurantStore.menu
    .filter(dish => quantities.value[dish.id] > 0)
    .map(dish => ({
      ...dish,
      quantity: quantities.value[dish.id]
    }))
})

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const buttonText = computed(() => existingOrder.value ? 'Обновить заказ' : 'Подтвердить заказ')

const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'd MMMM yyyy', { locale: ru })
  } catch {
    return dateStr
  }
}

const addDish = (dish) => {
  quantities.value[dish.id] = (quantities.value[dish.id] || 0) + 1
}

const removeDish = (dishId) => {
  if (quantities.value[dishId] > 0) {
    quantities.value[dishId]--
  }
}

const submitOrder = () => {
  if (cartItems.value.length === 0) {
    alert('Добавьте блюда в заказ')
    return
  }

  if (existingOrder.value) {
    restaurantStore.updateOrder(existingOrder.value.id, {
      items: cartItems.value,
      totalPrice: totalPrice.value,
      notes: orderNotes.value
    })
  } else {
    restaurantStore.addOrder({
      bookingId,
      items: cartItems.value,
      totalPrice: totalPrice.value,
      notes: orderNotes.value
    })
  }

  alert('✅ Заказ подтвержден! Спасибо за ваш заказ.')
  router.push('/user/my-bookings')
}
</script>
