import { genId, now } from './helpers'

export function reducer(state, action) {
  switch (action.type) {

    case 'LOGIN':
      return { ...state, currentUser: action.user }

    case 'LOGOUT':
      return { ...state, currentUser: null }

    case 'REGISTER': {
      const u = { id: genId(), role: 'customer', status: 'active', ...action.data }
      return { ...state, users: [...state.users, u], currentUser: u }
    }

    case 'TOGGLE_DRIVER_ONLINE':
      return {
        ...state,
        drivers: state.drivers.map(d =>
          d.id === action.driverId ? { ...d, is_online: !d.is_online, is_available: !d.is_online } : d
        ),
      }

    case 'TOGGLE_DRIVER_STATUS':
      return {
        ...state,
        drivers: state.drivers.map(d =>
          d.id === action.driverId ? { ...d, is_online: !d.is_online } : d
        ),
      }

    case 'ADD_DRIVER': {
      const uid = genId(), did = genId()
      const u   = { id: uid, role: 'driver', status: 'active', full_name: action.data.full_name, phone: action.data.phone, email: action.data.email, password: action.data.password }
      const drv = { id: did, user_id: uid, vehicle_type: action.data.vehicle_type, vehicle_plate: action.data.vehicle_plate, license_number: action.data.license_number, is_online: false, is_available: false }
      return { ...state, users: [...state.users, u], drivers: [...state.drivers, drv] }
    }

    case 'CREATE_DELIVERY': {
      const d = {
        id: genId(), tracking_code: action.tracking, customer_id: action.customerId || null,
        ...action.form,
        pickup_lat: 47.9 + Math.random() * 0.05, pickup_lng: 106.85 + Math.random() * 0.1,
        dropoff_lat: 47.9 + Math.random() * 0.05, dropoff_lng: 106.85 + Math.random() * 0.1,
        status: 'pending', assigned_driver_id: null,
        created_at: now(), accepted_at: null, picked_up_at: null, delivered_at: null, cancelled_at: null,
        status_logs: [{ old_status: null, new_status: 'pending', note: 'Захиалга үүссэн', created_at: now() }],
      }
      return { ...state, deliveries: [...state.deliveries, d] }
    }

    case 'ACCEPT_DELIVERY':
      return {
        ...state,
        deliveries: state.deliveries.map(d =>
          d.id === action.deliveryId
            ? { ...d, status: 'accepted', assigned_driver_id: action.driverId, accepted_at: now(),
                status_logs: [...(d.status_logs || []), { old_status: 'pending', new_status: 'accepted', note: 'Жолооч хүлээн авлаа', driver_id: action.driverId, created_at: now() }] }
            : d
        ),
        drivers: state.drivers.map(d => d.id === action.driverId ? { ...d, is_available: false } : d),
      }

    case 'UPDATE_STATUS': {
      const d = state.deliveries.find(x => x.id === action.deliveryId)
      const tsMap = { picked_up: 'picked_up_at', delivered: 'delivered_at' }
      const upd = {
        status: action.newStatus,
        status_logs: [...(d.status_logs || []), { old_status: d.status, new_status: action.newStatus, driver_id: action.driverId, created_at: now() }],
      }
      if (tsMap[action.newStatus]) upd[tsMap[action.newStatus]] = now()
      return {
        ...state,
        deliveries: state.deliveries.map(x => x.id === action.deliveryId ? { ...x, ...upd } : x),
        drivers: action.newStatus === 'delivered'
          ? state.drivers.map(d => d.id === action.driverId ? { ...d, is_available: true } : d)
          : state.drivers,
      }
    }

    case 'CANCEL_DELIVERY':
      return {
        ...state,
        deliveries: state.deliveries.map(x =>
          x.id === action.deliveryId
            ? { ...x, status: 'cancelled', cancelled_at: now(), assigned_driver_id: null,
                status_logs: [...(x.status_logs || []), { old_status: x.status, new_status: 'cancelled', note: action.note, driver_id: action.driverId, created_at: now() }] }
            : x
        ),
        drivers: state.drivers.map(d => d.id === action.driverId ? { ...d, is_available: true } : d),
      }

    default:
      return state
  }
}
