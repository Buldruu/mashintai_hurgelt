export const genId       = () => Math.random().toString(36).substr(2, 9)
export const genTracking = () => 'HRG-' + Math.floor(100000 + Math.random() * 900000)
export const now         = () => new Date().toISOString()
export const fmtTime     = (iso) => iso ? new Date(iso).toLocaleString('mn-MN') : '-'
export const estDist     = (d) =>
  ((Math.abs(d.pickup_lat - d.dropoff_lat) + Math.abs(d.pickup_lng - d.dropoff_lng)) * 111).toFixed(1) + ' км'
