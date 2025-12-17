<template>
  <div class="space-y-8">
    <div class="flex justify-between items-start">
      <div>
        <h1 class="section-title">Управление столами</h1>
        <p class="text-slate-600">Добавляйте, редактируйте и удаляйте столы в ресторане</p>
      </div>
      <button @click="showForm = true" class="btn-primary">
        + Добавить стол
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="card-glass p-8">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">{{ editingTable ? 'Редактировать' : 'Новый' }} стол</h2>
      <form @submit.prevent="saveTable" class="grid md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Номер стола</label>
          <input v-model.number="form.number" type="number" class="input-field" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Количество мест</label>
          <input v-model.number="form.seats" type="number" class="input-field" min="1" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Раздел зала</label>
          <select v-model="form.section" class="input-field">
            <option>Окно</option>
            <option>Центр</option>
            <option>ВИП</option>
            <option>Бар</option>
          </select>
        </div>
        <div class="flex items-end gap-4">
          <button type="submit" class="btn-primary">
            {{ editingTable ? 'Обновить' : 'Добавить' }}
          </button>
          <button type="button" @click="resetForm" class="btn-secondary">
            Отмена
          </button>
        </div>
      </form>
    </div>

    <!-- Tables List -->
    <div class="table-container">
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">№ Стола</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Места</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Раздел</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Статус</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="table in restaurantStore.tables" :key="table.id" class="hover:bg-slate-50">
            <td class="px-6 py-4 font-bold text-slate-900">#{{ table.number }}</td>
            <td class="px-6 py-4 text-slate-600">{{ table.seats }} мест{{ getPlural(table.seats) }}</td>
            <td class="px-6 py-4 text-slate-600">{{ table.section }}</td>
            <td class="px-6 py-4">
              <span :class="table.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                    class="px-3 py-1 rounded-full text-sm font-medium">
                {{ table.status === 'available' ? 'Свободен' : 'Забронирован' }}
              </span>
            </td>
            <td class="px-6 py-4 flex gap-2">
              <button @click="editTable(table)" class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">
                Изменить
              </button>
              <button @click="deleteTableConfirm(table.id)" class="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRestaurantStore } from '../../stores/restaurant'

const restaurantStore = useRestaurantStore()
const showForm = ref(false)
const editingTable = ref(null)
const form = ref({
  number: '',
  seats: '',
  section: 'Центр'
})

const saveTable = () => {
  if (editingTable.value) {
    restaurantStore.updateTable(editingTable.value.id, form.value)
  } else {
    restaurantStore.addTable({ ...form.value, status: 'available' })
  }
  resetForm()
}

const editTable = (table) => {
  editingTable.value = table
  form.value = { ...table }
  showForm.value = true
}

const resetForm = () => {
  showForm.value = false
  editingTable.value = null
  form.value = { number: '', seats: '', section: 'Центр' }
}

const deleteTableConfirm = (id) => {
  if (confirm('Вы уверены?')) {
    restaurantStore.deleteTable(id)
  }
}

const getPlural = (num) => {
  if (num === 1) return ''
  if (num >= 2 && num <= 4) return 'а'
  return ''
}
</script>
