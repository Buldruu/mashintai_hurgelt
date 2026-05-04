import { useState } from 'react'
import { TopBar, LogoutBtn } from '../../components/ui/TopBar'
import BottomNav from '../../components/ui/BottomNav'
import StatusBadge from '../../components/ui/StatusBadge'
import Card from '../../components/ui/Card'
import { PrimaryBtn, Btn } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/FormFields'
import DeliveryForm from '../../components/shared/DeliveryForm'
import { STATUS_CONFIG, VEHICLE_TYPES } from '../../constants'
import { fmtTime } from '../../store/helpers'

const TABS = [
  { id: 'dashboard',  icon: '📊', label: 'Хяналт'   },
  { id: 'deliveries', icon: '📦', label: 'Захиалга'  },
  { id: 'create',     icon: '➕', label: 'Үүсгэх'    },
  { id: 'drivers',    icon: '🚗', label: 'Жолооч'    },
  { id: 'customers',  icon: '👥', label: 'Хэрэглэгч' },
]
const TITLES = { dashboard: 'Хяналтын самбар', deliveries: 'Захиалгууд', create: 'Захиалга үүсгэх', drivers: 'Жолоочид', customers: 'Хэрэглэгчид', detail: 'Дэлгэрэнгүй' }

export default function AdminApp({ state, dispatch, user, onLogout }) {
  const [tab, setTab]   = useState('dashboard')
  const [sel, setSel]   = useState(null)
  const [modal, setModal] = useState(null)
  const [fStatus, setFStatus] = useState('all')
  const [fDate,   setFDate]   = useState('')

  const { deliveries, drivers, users } = state
  const getUser   = id => users.find(u => u.id === id)
  const getDriver = id => drivers.find(d => d.id === id)

  const stats = {
    total: deliveries.length,
    active: deliveries.filter(d => ['accepted','picked_up','on_the_way'].includes(d.status)).length,
    completed: deliveries.filter(d => d.status === 'delivered').length,
    cancelled: deliveries.filter(d => d.status === 'cancelled').length,
  }

  const filtered = deliveries.filter(d => {
    if (fStatus !== 'all' && d.status !== fStatus) return false
    if (fDate && !d.created_at.startsWith(fDate)) return false
    return true
  })

  const goDetail = d => { setSel(d); setTab('detail') }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#f8f9fa', fontFamily: 'system-ui,sans-serif' }}>
      <TopBar title={TITLES[tab] || ''} onBack={tab === 'detail' ? () => setTab('deliveries') : null} right={<LogoutBtn onLogout={onLogout} />} />

      {tab === 'dashboard' && (
        <div style={{ padding: 16, paddingBottom: 80 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[['Нийт захиалга',stats.total,'#1a1a2e','#f0f0ff'],['Идэвхтэй',stats.active,'#ea580c','#fff7ed'],['Хүргэгдсэн',stats.completed,'#16a34a','#f0fdf4'],['Цуцлагдсан',stats.cancelled,'#dc2626','#fef2f2']].map(([l,v,c,b]) => (
              <div key={l} style={{ background: b, borderRadius: 14, padding: '16px 14px' }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: c }}>{v}</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Сүүлийн захиалгууд</div>
          {[...deliveries].reverse().slice(0,5).map(d => (
            <Card key={d.id} onClick={() => goDetail(d)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{d.tracking_code}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{d.sender_name} → {d.receiver_name}</div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{fmtTime(d.created_at)}</div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            </Card>
          ))}
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, marginTop: 8 }}>Жолоочдын байдал</div>
          {drivers.map(drv => {
            const u = getUser(drv.user_id)
            return (
              <Card key={drv.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: '#1a1a2e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>{u?.full_name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{u?.full_name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{drv.vehicle_type} · {drv.vehicle_plate}</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: drv.is_online?(drv.is_available?'#dcfce7':'#fef3c7'):'#f5f5f5', color: drv.is_online?(drv.is_available?'#16a34a':'#d97706'):'#999' }}>
                    {drv.is_online?(drv.is_available?'Боломжтой':'Завгүй'):'Офлайн'}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'deliveries' && (
        <div style={{ padding: 16, paddingBottom: 80 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {['all',...Object.keys(STATUS_CONFIG)].map(s => (
              <button key={s} onClick={() => setFStatus(s)} style={{ padding: '7px 14px', border: 'none', borderRadius: 20, cursor: 'pointer', whiteSpace: 'nowrap', background: fStatus===s?'#1a1a2e':'#f0f0f0', color: fStatus===s?'#fff':'#444', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
                {s==='all'?'Бүгд':STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
          <Input label='' value={fDate} onChange={setFDate} type='date' />
          {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#999', padding: 32 }}>Захиалга олдсонгүй</div>}
          {[...filtered].reverse().map(d => {
            const drvUser = d.assigned_driver_id ? getUser(getDriver(d.assigned_driver_id)?.user_id) : null
            return (
              <Card key={d.id} onClick={() => goDetail(d)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{d.tracking_code}</div>
                  <StatusBadge status={d.status} />
                </div>
                <div style={{ fontSize: 13, color: '#444' }}>📍 {d.pickup_address}</div>
                <div style={{ fontSize: 13, color: '#444' }}>🎯 {d.dropoff_address}</div>
                {drvUser && <div style={{ fontSize: 12, color: '#2563eb', marginTop: 4 }}>🚗 {drvUser.full_name}</div>}
                {!d.customer_id && <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>👤 Зочны захиалга</div>}
                <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{fmtTime(d.created_at)}</div>
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'create' && (
        <DeliveryForm defaultSender={{ name: '', phone: '' }} onSubmit={(form, tracking) => {
          if (form) dispatch({ type: 'CREATE_DELIVERY', customerId: null, form, tracking })
          else setTab('deliveries')
        }} />
      )}

      {tab === 'drivers' && (
        <div style={{ padding: 16, paddingBottom: 80 }}>
          <PrimaryBtn full onClick={() => setModal({})} style={{ marginBottom: 16 }}>+ Жолооч нэмэх</PrimaryBtn>
          {drivers.map(drv => {
            const u = getUser(drv.user_id)
            const act = deliveries.find(d => d.assigned_driver_id===drv.id && ['accepted','picked_up','on_the_way'].includes(d.status))
            return (
              <Card key={drv.id}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 24, background: '#1a1a2e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, flexShrink: 0 }}>{u?.full_name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{u?.full_name}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>📞 {u?.phone}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>🚗 {drv.vehicle_type} · {drv.vehicle_plate}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>🪪 {drv.license_number}</div>
                    {act && <div style={{ fontSize: 12, color: '#ea580c', marginTop: 4 }}>📦 {act.tracking_code}</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    <div style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: drv.is_online?'#dcfce7':'#f5f5f5', color: drv.is_online?'#16a34a':'#999' }}>{drv.is_online?'Онлайн':'Офлайн'}</div>
                    <button onClick={() => dispatch({ type: 'TOGGLE_DRIVER_STATUS', driverId: drv.id })}
                      style={{ fontSize: 11, background: '#f0f0f0', border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {drv.is_online?'Идэвхгүй':'Идэвхтэй'}
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
          {modal !== null && <AddDriverModal onSave={data => { dispatch({ type: 'ADD_DRIVER', data }); setModal(null) }} onClose={() => setModal(null)} />}
        </div>
      )}

      {tab === 'customers' && (
        <div style={{ padding: 16, paddingBottom: 80 }}>
          {users.filter(u => u.role==='customer').map(c => (
            <Card key={c.id}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>{c.full_name[0]}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.full_name}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>📞 {c.phone}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>📦 {deliveries.filter(d=>d.customer_id===c.id).length} захиалга</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'detail' && sel && (() => {
        const d = deliveries.find(x => x.id===sel.id)||sel
        const drv = d.assigned_driver_id ? getDriver(d.assigned_driver_id) : null
        const drvUser = drv ? getUser(drv.user_id) : null
        return (
          <div style={{ padding: 16, paddingBottom: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{d.tracking_code}</div>
              <StatusBadge status={d.status} size='lg' />
            </div>
            <Card><div style={{ fontWeight: 600, marginBottom: 8, color: '#444' }}>Илгээгч</div><div style={{ fontSize: 14 }}>👤 {d.sender_name}</div><div style={{ fontSize: 14 }}>📞 {d.sender_phone}</div><div style={{ fontSize: 13, color: '#666' }}>📍 {d.pickup_address}</div></Card>
            <Card><div style={{ fontWeight: 600, marginBottom: 8, color: '#444' }}>Хүлээн авагч</div><div style={{ fontSize: 14 }}>👤 {d.receiver_name}</div><div style={{ fontSize: 14 }}>📞 {d.receiver_phone}</div><div style={{ fontSize: 13, color: '#666' }}>🎯 {d.dropoff_address}</div></Card>
            <Card><div style={{ fontWeight: 600, marginBottom: 8, color: '#444' }}>Бараа</div><div style={{ fontSize: 14 }}>📦 {d.item_description} · {d.item_size}</div><div style={{ fontSize: 13, color: '#666' }}>💳 {d.payment_method}</div>{d.note&&<div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>📝 {d.note}</div>}</Card>
            {drvUser && <Card><div style={{ fontWeight: 600, marginBottom: 8, color: '#444' }}>Жолооч</div><div style={{ fontSize: 14 }}>👤 {drvUser.full_name}</div><div style={{ fontSize: 14 }}>📞 {drvUser.phone}</div></Card>}
            <Card>
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#444' }}>Статусын түүх</div>
              {(d.status_logs||[]).map((log,i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: i<d.status_logs.length-1?'1px solid #f0f0f0':'none' }}>
                  <div style={{ fontSize: 11, color: '#999', minWidth: 130 }}>{fmtTime(log.created_at)}</div>
                  <div>{log.new_status&&<StatusBadge status={log.new_status} />}{log.note&&<div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{log.note}</div>}</div>
                </div>
              ))}
            </Card>
          </div>
        )
      })()}

      {tab !== 'detail' && <BottomNav tabs={TABS} active={tab} onSelect={setTab} />}
    </div>
  )
}

function AddDriverModal({ onSave, onClose }) {
  const [f, setF] = useState({ full_name:'',phone:'',email:'',password:'',vehicle_type:'Мотоцикл',vehicle_plate:'',license_number:'' })
  const set = (k,v) => setF(x => ({...x,[k]:v}))
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center' }}>
      <div style={{ background:'#fff',borderRadius:'20px 20px 0 0',padding:24,width:'100%',maxWidth:480,maxHeight:'90vh',overflowY:'auto' }}>
        <div style={{ fontSize:18,fontWeight:700,marginBottom:16 }}>Жолооч нэмэх</div>
        <Input label='Бүтэн нэр'          value={f.full_name}      onChange={v=>set('full_name',v)} required />
        <Input label='Утасны дугаар'      value={f.phone}          onChange={v=>set('phone',v)} required />
        <Input label='Имэйл'              value={f.email}          onChange={v=>set('email',v)} type='email' required />
        <Input label='Нууц үг'            value={f.password}       onChange={v=>set('password',v)} type='password' required />
        <Select label='Тээврийн хэрэгсэл' value={f.vehicle_type}   onChange={v=>set('vehicle_type',v)} options={VEHICLE_TYPES.map(v=>({value:v,label:v}))} />
        <Input label='Улсын дугаар'       value={f.vehicle_plate}  onChange={v=>set('vehicle_plate',v)} required />
        <Input label='Жолооны үнэмлэх №'  value={f.license_number} onChange={v=>set('license_number',v)} required />
        <div style={{ display:'flex',gap:10,marginTop:8 }}>
          <Btn full onClick={onClose}>Болих</Btn>
          <PrimaryBtn full onClick={() => { if(!f.full_name||!f.phone||!f.email||!f.vehicle_plate||!f.license_number)return; onSave(f) }}>Нэмэх</PrimaryBtn>
        </div>
      </div>
    </div>
  )
}
