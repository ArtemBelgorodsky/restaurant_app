import { defineStore } from 'pinia';
import { ref } from 'vue';
import { addHours, parseISO } from 'date-fns';

export const useRestaurantStore = defineStore('restaurant', () => {
  const tables = ref([
    { id: 1, number: 7, seats: 4, section: 'Окно', status: 'available' },
    { id: 2, number: 8, seats: 2, section: 'Окно', status: 'available' },
    { id: 3, number: 3, seats: 6, section: 'Центр', status: 'available' },
    { id: 4, number: 4, seats: 4, section: 'Центр', status: 'available' },
    { id: 5, number: 1, seats: 8, section: 'ВИП', status: 'booked' },
    { id: 6, number: 2, seats: 4, section: 'ВИП', status: 'available' },
    { id: 7, number: 5, seats: 2, section: 'Центр', status: 'available' },
    { id: 8, number: 6, seats: 4, section: 'Центр', status: 'available' },
  ]);

  const menu = ref([
    {
      id: 1,
      name: 'Салат Цезарь',
      category: 'Салаты',
      price: 450,
      description: 'Классический салат с курицей',
      image:
        'https://laz.iceni.ru/wp-content/uploads/2021/09/цезарь-с-курицей.jpg',
    },
    {
      id: 2,
      name: 'Салат с морепродуктами',
      category: 'Салаты',
      price: 650,
      description: 'Свежий салат с креветками',
      image:
        'https://avatars.mds.yandex.net/i?id=b7f48f62c4dd6cdd1e3b7b1325ba03596d862378-5248587-images-thumbs&n=13',
    },
    {
      id: 3,
      name: 'Стейк из говядины',
      category: 'Основные',
      price: 1200,
      description: 'Сочный стейк на гриле',
      image:
        'https://avatars.mds.yandex.net/i?id=1a8a5ff12c27f16fbd30cdd9183061b6_l-7545000-images-thumbs&n=13',
    },
    {
      id: 4,
      name: 'Паста Болоньезе',
      category: 'Основные',
      price: 550,
      description: 'Традиционная паста с мясным соусом',
      image:
        'https://e3.edimdoma.ru/data/posts/0003/7983/37983-ed4_big_wide.jpg?1759386265',
    },
    {
      id: 5,
      name: 'Лосось на гриле',
      category: 'Рыба',
      price: 950,
      description: 'Филе лосося с овощами',
      image:
        'https://avatars.mds.yandex.net/i?id=10e92c9bbe4bacf36d48a6e5c501c97d_l-7998332-images-thumbs&n=13',
    },
    {
      id: 6,
      name: 'Куриная грудка',
      category: 'Основные',
      price: 650,
      description: 'Нежная куриная грудка',
      image:
        'https://pic.rutubelist.ru/video/2025-04-14/d5/4e/d54ea6f297e4a22e4cf91164eea59c66.jpg',
    },
    {
      id: 7,
      name: 'Суп-пюре из грибов',
      category: 'Супы',
      price: 350,
      description: 'Изысканный грибной суп',
      image:
        'https://i.pinimg.com/736x/b9/f0/a8/b9f0a8d19de33a32393c1841d19b2daf.jpg',
    },
    {
      id: 8,
      name: 'Борщ',
      category: 'Супы',
      price: 300,
      description: 'Традиционный борщ',
      image:
        'https://avatars.mds.yandex.net/i?id=1d415ff63ac6fc3abf46df25068a8b27_l-5233683-images-thumbs&n=13',
    },
    {
      id: 9,
      name: 'Тирамису',
      category: 'Десерты',
      price: 400,
      description: 'Классический итальянский десерт',
      image:
        'https://images.gastronom.ru/XLAqBnIt4HwFTUe-kaaz32vJv3WOH1PrlsWQaSx_aRQ/pr:article-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzL2M4NjJiOTk5LWQ0NTUtNDM4Zi1iY2ZiLWJlZmVmYmI5ZTMwYy5wbmc.webp',
    },
    {
      id: 10,
      name: 'Панна-котта',
      category: 'Десерты',
      price: 380,
      description: 'Нежный кремовый десерт',
      image:
        'https://cdnn21.img.ria.ru/images/155809/12/1558091284_0:0:2000:1333_900x0_80_0_0_c3c45bbe4ebd3a301cebd9004fca9e09.jpg',
    },
    {
      id: 11,
      name: 'Маргарита',
      category: 'Напитки',
      price: 250,
      description: 'Классический коктейль',
      image:
        'https://i.pinimg.com/originals/7e/63/85/7e638558b8aa34a2501ca7ced0439497.jpg',
    },
    {
      id: 12,
      name: 'Эспрессо',
      category: 'Напитки',
      price: 120,
      description: 'Крепкий черный кофе',
      image:
        'https://chillesta.ru/wp-content/uploads/2025/06/cup-coffee-with-word-latte-it.jpg',
    },
  ]);

  const bookings = ref([]);

  const orders = ref([]);

  const settings = ref({
    workingHoursStart: '11:00',
    workingHoursEnd: '23:00',
    bookingMinimumTime: 30,
    maxBookingDaysInAdvance: 30,
  });

  const addTable = (table) => {
    table.id = Math.max(...tables.value.map((t) => t.id), 0) + 1;
    tables.value.push(table);
  };

  const updateTable = (id, updates) => {
    const table = tables.value.find((t) => t.id === id);
    if (table) Object.assign(table, updates);
  };

  const deleteTable = (id) => {
    const index = tables.value.findIndex((t) => t.id === id);
    if (index > -1) tables.value.splice(index, 1);
  };

  const addDish = (dish) => {
    dish.id = Math.max(...menu.value.map((d) => d.id), 0) + 1;
    menu.value.push(dish);
  };

  const updateDish = (id, updates) => {
    const dish = menu.value.find((d) => d.id === id);
    if (dish) Object.assign(dish, updates);
  };

  const deleteDish = (id) => {
    const index = menu.value.findIndex((d) => d.id === id);
    if (index > -1) menu.value.splice(index, 1);
  };

  const addBooking = (booking) => {
    booking.id = Math.max(...bookings.value.map((b) => b.id), 0) + 1;
    booking.status = 'confirmed';
    booking.createdAt = new Date().toISOString();
    // Calculate end time as 1 hour after start time
    const startDateTime = parseISO(`${booking.date}T${booking.time}`);
    const endDateTime = addHours(startDateTime, 1);
    booking.endTime = endDateTime.toISOString().split('T')[1];
    bookings.value.push(booking);
  };

  const updateBooking = (id, updates) => {
    const booking = bookings.value.find((b) => b.id === id);
    if (booking) Object.assign(booking, updates);
  };

  const cancelBooking = (id) => {
    const booking = bookings.value.find((b) => b.id === id);
    if (booking) booking.status = 'cancelled';
  };

  const addOrder = (order) => {
    order.id = Math.max(...orders.value.map((o) => o.id), 0) + 1;
    order.status = 'pending';
    order.createdAt = new Date().toISOString();
    orders.value.push(order);
  };

  const updateOrder = (id, updates) => {
    const order = orders.value.find((o) => o.id === id);
    if (order) Object.assign(order, updates);
  };

  const getTableById = (id) => tables.value.find((t) => t.id === id);

  const getAvailableTables = (date, time, guests) => {
    return tables.value.filter((table) => {
      if (table.seats < guests) return false;
      const hasBooking = bookings.value.some(
        (b) =>
          b.tableId === table.id && b.date === date && b.status !== 'cancelled'
      );
      return !hasBooking;
    });
  };

  return {
    tables,
    menu,
    bookings,
    orders,
    settings,
    addTable,
    updateTable,
    deleteTable,
    addDish,
    updateDish,
    deleteDish,
    addBooking,
    updateBooking,
    cancelBooking,
    addOrder,
    updateOrder,
    getTableById,
    getAvailableTables,
  };
});
