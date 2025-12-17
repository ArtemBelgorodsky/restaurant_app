<template>
  <div class="space-y-8">
    <div>
      <h1 class="section-title">Интерактивная карта зала</h1>
      <p class="text-black-600">Выберите стол и забронируйте место в нашем ресторане</p>
    </div>

    <!-- Filters -->
    <div class="card-glass p-6 flex flex-wrap gap-4">
      <div class="flex-1 min-w-max">
        <label class="block text-sm font-medium text-black-700 mb-2">Дата</label>
        <input v-model="selectedDate" type="date" class="input-field" />
      </div>
      <div class="flex-1 min-w-max">
        <label class="block text-sm font-medium text-black-700 mb-2">Время</label>
        <input v-model="selectedTime" type="time" class="input-field" />
      </div>
      <div class="flex-1 min-w-max">
        <label class="block text-sm font-medium text-black-700 mb-2">Количество гостей</label>
        <input v-model.number="selectedGuests" type="number" min="1" max="20" class="input-field" />
      </div>
      <div class="flex items-end">
        <button @click="searchAvailable" class="btn-primary">
          Поиск столов
        </button>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex gap-6 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-primary-500 rounded-lg"></div>
        <span class="text-black-700">Доступен</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-burgundy-500 rounded-lg"></div>
        <span class="text-black-700">Забронирован</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-black-400 rounded-lg"></div>
        <span class="text-black-700">Мало мест</span>
      </div>
    </div>

    <!-- Hall Layout -->
    <div class="card-glass p-8">
      <h2 class="text-2xl font-bold text-black-900 mb-6 text-center">Схема зала ресторана</h2>

      <!-- Stage -->
      <div class="mb-8 text-center">
        <div class="inline-block bg-gradient-to-r from-primary-600 to-burgundy-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg">
          🎤 Сцена
        </div>
      </div>

      <!-- VIP Section -->
      <div class="card-glass p-6 mb-8">
        <h3 class="text-lg font-semibold text-black-800 mb-4 text-center">👑 ВИП-зона</h3>
        <div class="flex justify-center gap-8">
          <button
            v-for="table in getTablesInSection('ВИП')"
            :key="table.id"
            @click="selectTable(table)"
            :disabled="!isTableAvailable(table)"
            :class="getTableButtonClass(table)"
            class="table-button vip-table"
          >
            <div class="table-icon">💎</div>
            <div class="table-number">{{ table.number }}</div>
            <div class="table-seats">{{ table.seats }} чел</div>
          </button>
        </div>
      </div>

      <!-- Main Hall Grid -->
      <div class="relative bg-gradient-to-br from-primary-50 to-burgundy-50 rounded-2xl p-8 shadow-inner">
        <!-- Upper Row: Window and Center Sections -->
        <div class="grid md:grid-cols-2 gap-8 mb-8">
          <!-- Center Section -->
          <div>
            <h3 class="text-lg font-semibold text-black-800 mb-4 text-center">🏛️ Центральная зона</h3>
            <div class="grid grid-cols-1 gap-6 justify-items-center">
              <button
                v-for="table in getTablesInSection('Центр')"
                :key="table.id"
                @click="selectTable(table)"
                :disabled="!isTableAvailable(table)"
                :class="getTableButtonClass(table)"
                class="table-button"
              >
                <div class="table-icon">🪑</div>
                <div class="table-number">{{ table.number }}</div>
                <div class="table-seats">{{ table.seats }} чел</div>
              </button>
            </div>
          </div>

          <!-- Window Section -->
          <div>
            <h3 class="text-lg font-semibold text-black-800 mb-4 text-center">🌅 Зона у окна</h3>
            <div class="grid grid-cols-1 gap-6 justify-items-center">
              <button
                v-for="table in getTablesInSection('Окно')"
                :key="table.id"
                @click="selectTable(table)"
                :disabled="!isTableAvailable(table)"
                :class="getTableButtonClass(table)"
                class="table-button"
              >
                <div class="table-icon">🪑</div>
                <div class="table-number">{{ table.number }}</div>
                <div class="table-seats">{{ table.seats }} чел</div>
              </button>
            </div>
            <!-- Entrance -->
            <div class="mt-6 text-center">
              <div class="inline-block bg-gradient-to-r from-primary-500 to-burgundy-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg enter">
                Вход в ресторан
              </div>
            </div>
          </div>
        </div>

        <!-- Bar Section -->
        <div class="text-center">
          <div class="inline-block bg-gradient-to-r from-primary-600 to-burgundy-600 text-white px-6 py-3 rounded-lg font-bold mb-4 shadow-lg">
            🍸 Барная стойка
          </div>
          <div class="flex justify-center gap-6 flex-wrap">
            <button
              v-for="table in getTablesInSection('Бар')"
              :key="table.id"
              @click="selectTable(table)"
              :disabled="!isTableAvailable(table)"
              :class="getTableButtonClass(table)"
              class="table-button"
            >
              <div class="table-icon">🪑</div>
              <div class="table-number">{{ table.number }}</div>
              <div class="table-seats">{{ table.seats }} чел</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <dialog ref="bookingDialog" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 card-glass p-8 border-2 border-primary-500 rounded-2xl max-w-md backdrop:bg-black/50">
      <div v-if="selectedTable" class="space-y-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-3xl font-bold text-black-900">Выбранный стол №{{ selectedTable.number }}</h2>
            <p class="text-black-600 mt-1">Раздел: {{ selectedTable.section }} • Мест: {{ selectedTable.seats }}</p>
          </div>
          <button @click="bookingDialog.close()" class="text-black-400 hover:text-black-600 text-2xl">
            ✕
          </button>
        </div>

        <div class="flex gap-3">
          <router-link
            :to="{ path: `/user/booking/${selectedTable.id}`, query: { date: selectedDate, time: selectedTime, guests: selectedGuests } }"
            @click="bookingDialog.close()"
            class="btn-primary flex-1 text-center"
          >
            Перейти к бронированию
          </router-link>
          <button @click="bookingDialog.close()" class="btn-secondary flex-1">
            Отмена
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRestaurantStore } from '../../stores/restaurant'
import { format, addDays } from 'date-fns'

const restaurantStore = useRestaurantStore()
const selectedDate = ref(format(addDays(new Date(), 1), 'yyyy-MM-dd'))
const selectedTime = ref('19:00')
const selectedGuests = ref(2)
const selectedTable = ref(null)
const bookingDialog = ref(null)

const sections = computed(() => {
  return [...new Set(restaurantStore.tables.map(t => t.section))]
})

const getTablesInSection = (section) => {
  return restaurantStore.tables.filter(t => t.section === section)
}

const isTableAvailable = (table) => {
  if (table.seats < selectedGuests.value) return false
  return !restaurantStore.bookings.some(b =>
    b.tableId === table.id &&
    b.date === selectedDate.value &&
    b.status === 'confirmed' &&
    selectedTime.value >= b.time &&
    selectedTime.value < b.endTime
  )
}

const getTableButtonClass = (table) => {
  if (!isTableAvailable(table)) {
    if (table.seats < selectedGuests.value) {
      return 'table-button-disabled-gray'
    }
    return 'table-button-disabled-red'
  }
  return table.section === 'ВИП' ? 'table-button vip-table' : 'table-button'
}

const selectTable = (table) => {
  if (isTableAvailable(table)) {
    selectedTable.value = table
    bookingDialog.value.showModal()
  }
}

const searchAvailable = () => {
  selectedTable.value = null
}
</script>

<style scoped>
.table-button {
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: bold;
  color: white;
  transition: all 0.3s;
  min-width: 80px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.table-button:hover:not(:disabled) {
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
  transform: translateY(-2px) scale(1.05);
}

.table-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.table-button-disabled-gray {
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: bold;
  color: white;
  min-width: 80px;
  background: linear-gradient(135deg, #6b7280, #4b5563);
  cursor: not-allowed;
  opacity: 0.5;
}

.table-button-disabled-red {
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: bold;
  color: white;
  min-width: 80px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  cursor: not-allowed;
  opacity: 0.5;
}

.table-button.vip-table {
  background: linear-gradient(135deg, #800020, #722f37);
  box-shadow: 0 4px 15px rgba(128, 0, 32, 0.3);
}

.table-button.vip-table:hover:not(:disabled) {
  box-shadow: 0 8px 25px rgba(128, 0, 32, 0.4);
}

.table-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.table-number {
  font-size: 0.875rem;
  font-weight: bold;
}

.table-seats {
  font-size: 0.75rem;
  opacity: 0.9;
}
</style>
