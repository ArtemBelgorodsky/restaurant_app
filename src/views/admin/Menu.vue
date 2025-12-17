<template>
  <div class="space-y-8">
    <div class="flex justify-between items-start">
      <div>
        <h1 class="section-title">Управление меню</h1>
        <p class="text-slate-600">Добавляйте и редактируйте блюда в меню ресторана</p>
      </div>
      <button @click="showForm = true" class="btn-primary">
        + Добавить блюдо
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="card-glass p-8">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">{{ editingDish ? 'Редактировать' : 'Новое' }} блюдо</h2>
      <form @submit.prevent="saveDish" class="grid md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Название блюда</label>
          <input v-model="form.name" type="text" class="input-field" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Категория</label>
          <select v-model="form.category" class="input-field">
            <option>Салаты</option>
            <option>Супы</option>
            <option>Основные</option>
            <option>Рыба</option>
            <option>Десерты</option>
            <option>Напитки</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Цена (₽)</label>
          <input v-model.number="form.price" type="number" class="input-field" min="0" step="10" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Ссылка на изображение</label>
          <input v-model="form.image" type="text" class="input-field" placeholder="https://example.com/image.jpg" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-2">Описание</label>
          <textarea v-model="form.description" class="input-field" rows="3"></textarea>
        </div>
        <div class="md:col-span-2 flex gap-4">
          <button type="submit" class="btn-primary">
            {{ editingDish ? 'Обновить' : 'Добавить' }}
          </button>
          <button type="button" @click="resetForm" class="btn-secondary">
            Отмена
          </button>
        </div>
      </form>
    </div>

    <!-- Categories -->
    <div class="space-y-6">
      <div v-for="category in categories" :key="category" class="card-glass p-6">
        <h3 class="text-xl font-bold text-slate-900 mb-4">{{ category }}</h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="dish in getDishesInCategory(category)" :key="dish.id" 
               class="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-2">
              <img :src="dish.image" :alt="dish.name" class="w-16 h-16 object-cover rounded" />
              <span class="text-lg font-bold text-primary-600">{{ dish.price }} ₽</span>
            </div>
            <h4 class="font-semibold text-slate-900">{{ dish.name }}</h4>
            <p class="text-sm text-slate-600 mt-1">{{ dish.description }}</p>
            <div class="flex gap-2 mt-4">
              <button @click="editDish(dish)" class="flex-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200">
                Изменить
              </button>
              <button @click="deleteDishConfirm(dish.id)" class="flex-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200">
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRestaurantStore } from '../../stores/restaurant'

const restaurantStore = useRestaurantStore()
const showForm = ref(false)
const editingDish = ref(null)
const form = ref({
  name: '',
  category: 'Основные',
  price: '',
  description: '',
  image: ''
})

const categories = computed(() => {
  return [...new Set(restaurantStore.menu.map(d => d.category))]
})

const getDishesInCategory = (category) => {
  return restaurantStore.menu.filter(d => d.category === category)
}

const saveDish = () => {
  if (editingDish.value) {
    restaurantStore.updateDish(editingDish.value.id, form.value)
  } else {
    restaurantStore.addDish(form.value)
  }
  resetForm()
}

const editDish = (dish) => {
  editingDish.value = dish
  form.value = { ...dish }
  showForm.value = true
}

const resetForm = () => {
  showForm.value = false
  editingDish.value = null
  form.value = { name: '', category: 'Основные', price: '', description: '', image: '' }
}

const deleteDishConfirm = (id) => {
  if (confirm('Вы уверены?')) {
    restaurantStore.deleteDish(id)
  }
}
</script>
