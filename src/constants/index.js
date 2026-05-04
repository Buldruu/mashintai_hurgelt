export const STATUS_CONFIG = {
  pending:    { label: 'Хүлээгдэж буй', color: '#d97706', bg: '#fef3c7', icon: '⏳' },
  accepted:   { label: 'Хүлээн авсан',  color: '#2563eb', bg: '#dbeafe', icon: '✓'  },
  picked_up:  { label: 'Авсан',          color: '#7c3aed', bg: '#ede9fe', icon: '📦' },
  on_the_way: { label: 'Замдаа',         color: '#ea580c', bg: '#ffedd5', icon: '🚀' },
  delivered:  { label: 'Хүргэсэн',       color: '#16a34a', bg: '#dcfce7', icon: '✅' },
  cancelled:  { label: 'Цуцалсан',       color: '#dc2626', bg: '#fee2e2', icon: '✕'  },
}

export const VEHICLE_TYPES  = ['Мотоцикл', 'Машин', 'Хөнгөн ачааны машин']
export const PAYMENT_METHODS = ['Бэлэн мөнгө', 'Картаар', 'QPay']
export const ITEM_SIZES      = ['Жижиг', 'Дунд', 'Том', 'Маш том']

export const INITIAL_STATE = {
  users: [
    { id: 'admin1',  role: 'admin',    full_name: 'Админ Систем',       phone: '99000000', email: 'admin@hurgelt.mn',   password: 'admin123',  status: 'active' },
    { id: 'driver1', role: 'driver',   full_name: 'Батболд Нарансүх',   phone: '99112233', email: 'driver1@hurgelt.mn', password: 'driver123', status: 'active' },
    { id: 'driver2', role: 'driver',   full_name: 'Мөнхбаяр Гантулга', phone: '88223344', email: 'driver2@hurgelt.mn', password: 'driver123', status: 'active' },
    { id: 'cust1',   role: 'customer', full_name: 'Оюунцэцэг Дагва',   phone: '99887766', email: 'cust1@example.mn',   password: 'cust123',   status: 'active' },
  ],
  drivers: [
    { id: 'drv1', user_id: 'driver1', vehicle_type: 'Мотоцикл', vehicle_plate: 'УНА-1234', license_number: 'DL-98765', is_online: true,  is_available: true  },
    { id: 'drv2', user_id: 'driver2', vehicle_type: 'Машин',    vehicle_plate: 'УНБ-5678', license_number: 'DL-54321', is_online: false, is_available: false },
  ],
  deliveries: [
    {
      id: 'del1', tracking_code: 'HRG-112233', customer_id: 'cust1',
      sender_name: 'Оюунцэцэг Д', sender_phone: '99887766',
      pickup_address: 'Сүхбаатар дүүрэг, 3-р хороо', pickup_lat: 47.91, pickup_lng: 106.89,
      receiver_name: 'Болормаа Нямаа', receiver_phone: '88334455',
      dropoff_address: 'Баянгол дүүрэг, 5-р хороо', dropoff_lat: 47.90, dropoff_lng: 106.86,
      item_description: 'Ном, баримт бичиг', item_size: 'Жижиг', item_weight: '1кг',
      note: 'Нарийн хандах хэрэгтэй', payment_method: 'Бэлэн мөнгө',
      preferred_pickup_time: '14:00', status: 'pending', assigned_driver_id: null,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      accepted_at: null, picked_up_at: null, delivered_at: null, cancelled_at: null,
      status_logs: [{ old_status: null, new_status: 'pending', note: 'Захиалга үүссэн', created_at: new Date(Date.now() - 3600000).toISOString() }],
    },
  ],
}
