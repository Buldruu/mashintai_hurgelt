import { useState } from 'react'
import { TopBar, LogoutBtn } from '../../components/ui/TopBar'
import BottomNav from '../../components/ui/BottomNav'
import StatusBadge from '../../components/ui/StatusBadge'
import Card from '../../components/ui/Card'
import { PrimaryBtn, DangerBtn, Btn } from '../../components/ui/Button'
import { fmtTime, estDist } from '../../store/helpers'

const TABS = [
  { id:'home',      icon:'🏠', label:'Нүүр'      },
  { id:'available', icon:'📦', label:'Боломжтой'  },
  { id:'active',    icon:'🚀', label:'Идэвхтэй'   },
  { id:'history',   icon:'📋', label:'Түүх'       },
  { id:'profile',   icon:'👤', label:'Профайл'    },
]
const TITLES = { home:'Нүүр хуудас',available:'Боломжтой захиалга',preview:'Захиалгын дэлгэрэнгүй',active:'Идэвхтэй захиалга',history:'Түүх',profile:'Профайл' }
const NEXT = { accepted:{next:'picked_up',label:'📦 Авсан гэж тэмдэглэх'},picked_up:{next:'on_the_way',label:'🚀 Замдаа гэж тэмдэглэх'},on_the_way:{next:'delivered',label:'✅ Хүргэсэн гэж тэмдэглэх'} }

export default function DriverApp({ state, dispatch, user, onLogout }) {
  const [tab, setTab]   = useState('home')
  const [sel, setSel]   = useState(null)
  const [cancelNote, setCancelNote] = useState('')
  const [showCancel,  setShowCancel]  = useState(false)

  const drv      = state.drivers.find(d => d.user_id === user.id)
  const getUser  = id => state.users.find(u => u.id === id)
  const avail    = state.deliveries.filter(d => d.status==='pending' && drv?.is_online && drv?.is_available)
  const myActive = state.deliveries.find(d => d.assigned_driver_id===drv?.id && ['accepted','picked_up','on_the_way'].includes(d.status))
  const myHist   = state.deliveries.filter(d => d.assigned_driver_id===drv?.id && ['delivered','cancelled'].includes(d.status))

  return (
    <div style={{ maxWidth:480,margin:'0 auto',minHeight:'100vh',background:'#f8f9fa',fontFamily:'system-ui,sans-serif' }}>
      <TopBar title={TITLES[tab]||''} onBack={tab==='preview'?()=>setTab('available'):null} right={<LogoutBtn onLogout={onLogout}/>} />

      {tab==='home' && (
        <div style={{ padding:16,paddingBottom:80 }}>
          <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)',borderRadius:20,padding:20,color:'#fff',marginBottom:16 }}>
            <div style={{ fontSize:14,opacity:0.7 }}>Сайн уу,</div>
            <div style={{ fontSize:22,fontWeight:800 }}>{user.full_name}</div>
            <div style={{ fontSize:13,opacity:0.7 }}>{drv?.vehicle_type} · {drv?.vehicle_plate}</div>
            <div style={{ marginTop:16,display:'flex',alignItems:'center',gap:10 }}>
              <div style={{ width:12,height:12,borderRadius:6,background:drv?.is_online?'#22c55e':'#888' }}/>
              <span style={{ fontSize:14 }}>{drv?.is_online?'Онлайн':'Офлайн'}</span>
              <button onClick={()=>dispatch({type:'TOGGLE_DRIVER_ONLINE',driverId:drv?.id})}
                style={{ marginLeft:'auto',background:'rgba(255,255,255,0.2)',border:'none',borderRadius:20,padding:'6px 16px',color:'#fff',cursor:'pointer',fontFamily:'inherit',fontSize:13 }}>
                {drv?.is_online?'Офлайн болох':'Онлайн болох'}
              </button>
            </div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16 }}>
            <div style={{ background:'#eff6ff',borderRadius:14,padding:14 }}><div style={{ fontSize:24,fontWeight:800,color:'#2563eb' }}>{avail.length}</div><div style={{ fontSize:12,color:'#666' }}>Боломжтой</div></div>
            <div style={{ background:'#fef3c7',borderRadius:14,padding:14 }}><div style={{ fontSize:24,fontWeight:800,color:'#d97706' }}>{myHist.length}</div><div style={{ fontSize:12,color:'#666' }}>Нийт хүргэлт</div></div>
          </div>
          {myActive && (
            <Card style={{ border:'2px solid #ea580c' }}>
              <div style={{ fontWeight:700,color:'#ea580c',marginBottom:8 }}>🚀 Идэвхтэй захиалга</div>
              <div style={{ fontSize:14 }}>{myActive.tracking_code}</div>
              <div style={{ fontSize:13,color:'#666' }}>📍 {myActive.pickup_address}</div>
              <div style={{ fontSize:13,color:'#666' }}>🎯 {myActive.dropoff_address}</div>
              <PrimaryBtn full style={{ marginTop:10 }} onClick={()=>setTab('active')}>Дэлгэрэнгүй харах</PrimaryBtn>
            </Card>
          )}
        </div>
      )}

      {tab==='available' && (
        <div style={{ padding:16,paddingBottom:80 }}>
          {!drv?.is_online&&<div style={{ background:'#fef3c7',borderRadius:12,padding:14,marginBottom:16,fontSize:14,color:'#92400e' }}>⚠️ Онлайн болно уу</div>}
          {myActive&&<div style={{ background:'#fee2e2',borderRadius:12,padding:14,marginBottom:16,fontSize:14,color:'#991b1b' }}>❌ Одоо нэг захиалга хийж байна</div>}
          {avail.length===0&&!myActive&&drv?.is_online&&<div style={{ textAlign:'center',padding:40,color:'#999' }}><div style={{ fontSize:48 }}>📭</div><div style={{ fontSize:16,marginTop:8 }}>Боломжтой захиалга байхгүй</div></div>}
          {avail.map(d => (
            <Card key={d.id} onClick={()=>{setSel(d);setTab('preview')}}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                <div style={{ fontWeight:700 }}>{d.item_description}</div>
                <span style={{ fontSize:12,background:'#f0fdf4',color:'#16a34a',padding:'3px 10px',borderRadius:20,fontWeight:600 }}>{estDist(d)}</span>
              </div>
              <div style={{ fontSize:13,color:'#555',marginBottom:3 }}>📍 {d.pickup_address}</div>
              <div style={{ fontSize:13,color:'#555',marginBottom:8 }}>🎯 {d.dropoff_address}</div>
              <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                <span style={{ fontSize:12,background:'#f5f5f5',padding:'4px 10px',borderRadius:20,color:'#555' }}>📦 {d.item_size}</span>
                {d.preferred_pickup_time&&<span style={{ fontSize:12,background:'#f5f5f5',padding:'4px 10px',borderRadius:20,color:'#555' }}>⏰ {d.preferred_pickup_time}</span>}
              </div>
              {d.note&&<div style={{ fontSize:12,color:'#888',marginTop:6 }}>📝 {d.note}</div>}
            </Card>
          ))}
        </div>
      )}

      {tab==='preview'&&sel&&(
        <div style={{ padding:16,paddingBottom:100 }}>
          <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)',borderRadius:16,padding:20,color:'#fff',marginBottom:16 }}>
            <div style={{ fontSize:13,opacity:0.7,marginBottom:4 }}>Захиалга</div>
            <div style={{ fontSize:20,fontWeight:800 }}>{sel.item_description}</div>
            <div style={{ fontSize:14,opacity:0.8,marginTop:4 }}>{estDist(sel)} · {sel.item_size}</div>
          </div>
          <Card><div style={{ fontWeight:600,marginBottom:6 }}>Авах газар</div><div style={{ fontSize:14,color:'#444' }}>📍 {sel.pickup_address}</div></Card>
          <Card><div style={{ fontWeight:600,marginBottom:6 }}>Хүргэх газар</div><div style={{ fontSize:14,color:'#444' }}>🎯 {sel.dropoff_address}</div></Card>
          {sel.note&&<Card><div style={{ fontWeight:600,marginBottom:4 }}>Тэмдэглэл</div><div style={{ fontSize:14,color:'#444' }}>{sel.note}</div></Card>}
          <div style={{ background:'#fef3c7',borderRadius:12,padding:12,marginBottom:16,fontSize:13,color:'#92400e' }}>ℹ️ Хүлээн авсны дараа дэлгэрэнгүй мэдээлэл харагдана</div>
          <PrimaryBtn full disabled={!!myActive} onClick={()=>{dispatch({type:'ACCEPT_DELIVERY',deliveryId:sel.id,driverId:drv.id});setTab('active')}}>
            {myActive?'Одоо захиалга хийж байна':'✓ Захиалга хүлээн авах'}
          </PrimaryBtn>
        </div>
      )}

      {tab==='active'&&(
        <div style={{ padding:16,paddingBottom:100 }}>
          {!myActive?(
            <div style={{ textAlign:'center',padding:40,color:'#999' }}><div style={{ fontSize:48 }}>📭</div><div style={{ marginTop:8 }}>Идэвхтэй захиалга байхгүй</div></div>
          ):(
            <>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
                <div style={{ fontWeight:800,fontSize:17 }}>{myActive.tracking_code}</div>
                <StatusBadge status={myActive.status} size='lg'/>
              </div>
              <Card>
                <div style={{ fontWeight:600,marginBottom:8 }}>Илгээгч</div>
                <div style={{ fontSize:14 }}>👤 {myActive.sender_name}</div>
                <div style={{ fontSize:14 }}>📞 <a href={`tel:${myActive.sender_phone}`} style={{ color:'#2563eb' }}>{myActive.sender_phone}</a></div>
                <div style={{ fontSize:13,color:'#555' }}>📍 {myActive.pickup_address}</div>
                <a href={`https://maps.google.com/?q=${myActive.pickup_lat},${myActive.pickup_lng}`} target='_blank' rel='noreferrer' style={{ display:'inline-block',marginTop:8,fontSize:13,color:'#2563eb' }}>🗺️ Google Maps</a>
              </Card>
              <Card>
                <div style={{ fontWeight:600,marginBottom:8 }}>Хүлээн авагч</div>
                <div style={{ fontSize:14 }}>👤 {myActive.receiver_name}</div>
                <div style={{ fontSize:14 }}>📞 <a href={`tel:${myActive.receiver_phone}`} style={{ color:'#2563eb' }}>{myActive.receiver_phone}</a></div>
                <div style={{ fontSize:13,color:'#555' }}>🎯 {myActive.dropoff_address}</div>
                <a href={`https://maps.google.com/?q=${myActive.dropoff_lat},${myActive.dropoff_lng}`} target='_blank' rel='noreferrer' style={{ display:'inline-block',marginTop:8,fontSize:13,color:'#2563eb' }}>🗺️ Google Maps</a>
              </Card>
              <Card><div style={{ fontSize:14 }}>📦 {myActive.item_description} · {myActive.item_size}</div>{myActive.note&&<div style={{ fontSize:13,color:'#666',marginTop:4 }}>📝 {myActive.note}</div>}</Card>
              {NEXT[myActive.status]&&<PrimaryBtn full style={{ marginBottom:10 }} onClick={()=>dispatch({type:'UPDATE_STATUS',deliveryId:myActive.id,newStatus:NEXT[myActive.status].next,driverId:drv.id})}>{NEXT[myActive.status].label}</PrimaryBtn>}
              <DangerBtn full onClick={()=>setShowCancel(true)}>✕ Цуцлах</DangerBtn>
              {showCancel&&(
                <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center' }}>
                  <div style={{ background:'#fff',borderRadius:'20px 20px 0 0',padding:24,width:'100%',maxWidth:480 }}>
                    <div style={{ fontSize:16,fontWeight:700,marginBottom:12 }}>Цуцлах шалтгаан</div>
                    <textarea value={cancelNote} onChange={e=>setCancelNote(e.target.value)} placeholder='Шалтгаанаа бичнэ үү...'
                      style={{ width:'100%',boxSizing:'border-box',minHeight:80,padding:12,border:'1.5px solid #e0e0e0',borderRadius:10,fontSize:14,fontFamily:'inherit',marginBottom:12 }}/>
                    <div style={{ display:'flex',gap:10 }}>
                      <Btn full onClick={()=>setShowCancel(false)}>Болих</Btn>
                      <DangerBtn full onClick={()=>{dispatch({type:'CANCEL_DELIVERY',deliveryId:myActive.id,driverId:drv.id,note:cancelNote});setShowCancel(false);setCancelNote('')}}>Цуцлах</DangerBtn>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab==='history'&&(
        <div style={{ padding:16,paddingBottom:80 }}>
          {myHist.length===0&&<div style={{ textAlign:'center',padding:32,color:'#999' }}>Түүх байхгүй</div>}
          {[...myHist].reverse().map(d=>(
            <Card key={d.id}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:6 }}><div style={{ fontWeight:700 }}>{d.tracking_code}</div><StatusBadge status={d.status}/></div>
              <div style={{ fontSize:13,color:'#555' }}>📍 {d.pickup_address}</div>
              <div style={{ fontSize:13,color:'#555' }}>🎯 {d.dropoff_address}</div>
              <div style={{ fontSize:11,color:'#999',marginTop:4 }}>{fmtTime(d.created_at)}</div>
            </Card>
          ))}
        </div>
      )}

      {tab==='profile'&&(
        <div style={{ padding:16,paddingBottom:80 }}>
          <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)',borderRadius:20,padding:24,color:'#fff',textAlign:'center',marginBottom:16 }}>
            <div style={{ width:72,height:72,borderRadius:36,background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',fontSize:32,fontWeight:700 }}>{user.full_name[0]}</div>
            <div style={{ fontSize:20,fontWeight:700 }}>{user.full_name}</div>
            <div style={{ fontSize:14,opacity:0.7 }}>{user.phone}</div>
          </div>
          <Card>
            <div style={{ fontWeight:600,marginBottom:10 }}>Тээврийн мэдээлэл</div>
            {[['Тээврийн хэрэгсэл',drv?.vehicle_type],['Улсын дугаар',drv?.vehicle_plate],['Жолооны үнэмлэх',drv?.license_number]].map(([k,v])=>(
              <div key={k} style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                <div style={{ fontSize:13,color:'#666' }}>{k}</div>
                <div style={{ fontSize:13,fontWeight:600 }}>{v}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab!=='preview'&&<BottomNav tabs={TABS} active={tab} onSelect={setTab}/>}
    </div>
  )
}
