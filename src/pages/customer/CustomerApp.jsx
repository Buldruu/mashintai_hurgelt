import { useState } from 'react'
import { TopBar, LogoutBtn } from '../../components/ui/TopBar'
import BottomNav from '../../components/ui/BottomNav'
import StatusBadge from '../../components/ui/StatusBadge'
import Card from '../../components/ui/Card'
import { PrimaryBtn } from '../../components/ui/Button'
import DeliveryForm from '../../components/shared/DeliveryForm'
import { STATUS_CONFIG } from '../../constants'
import { fmtTime } from '../../store/helpers'

const TABS = [
  { id:'home',    icon:'🏠', label:'Нүүр'      },
  { id:'create',  icon:'➕', label:'Захиалах'   },
  { id:'orders',  icon:'📦', label:'Захиалгууд' },
  { id:'profile', icon:'👤', label:'Профайл'    },
]
const STEPS = ['pending','accepted','picked_up','on_the_way','delivered']

export default function CustomerApp({ state, dispatch, user, onLogout }) {
  const [tab, setTab] = useState('home')
  const [sel, setSel] = useState(null)

  const myDels    = state.deliveries.filter(d => d.customer_id === user.id)
  const getDrvUser = id => { const drv = state.drivers.find(d=>d.id===id); return drv?state.users.find(u=>u.id===drv.user_id):null }

  return (
    <div style={{ maxWidth:480,margin:'0 auto',minHeight:'100vh',background:'#f8f9fa',fontFamily:'system-ui,sans-serif' }}>
      <TopBar title={{home:'Нүүр хуудас',create:'Захиалга үүсгэх',orders:'Миний захиалгууд',track:'Захиалга хянах',profile:'Профайл'}[tab]||''} onBack={tab==='track'?()=>setTab('orders'):null} right={<LogoutBtn onLogout={onLogout}/>} />

      {tab==='home'&&(
        <div style={{ padding:16,paddingBottom:80 }}>
          <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)',borderRadius:20,padding:20,color:'#fff',marginBottom:16 }}>
            <div style={{ fontSize:14,opacity:0.7 }}>Сайн уу,</div>
            <div style={{ fontSize:22,fontWeight:800 }}>{user.full_name}</div>
            <div style={{ fontSize:13,opacity:0.7 }}>📞 {user.phone}</div>
          </div>
          <PrimaryBtn full onClick={()=>setTab('create')} style={{ marginBottom:16,fontSize:17,padding:'16px 20px' }}>+ Шинэ захиалга үүсгэх</PrimaryBtn>
          <div style={{ fontWeight:700,fontSize:15,marginBottom:10 }}>Сүүлийн захиалгууд</div>
          {myDels.length===0&&<div style={{ textAlign:'center',padding:24,color:'#999' }}>Захиалга байхгүй</div>}
          {[...myDels].reverse().slice(0,3).map(d=>{const f=state.deliveries.find(x=>x.id===d.id)||d;return(
            <Card key={d.id} onClick={()=>{setSel(f);setTab('track')}}>
              <div style={{ display:'flex',justifyContent:'space-between' }}>
                <div><div style={{ fontWeight:600,fontSize:14 }}>{f.tracking_code}</div><div style={{ fontSize:12,color:'#666' }}>{f.item_description}</div><div style={{ fontSize:11,color:'#999' }}>{fmtTime(f.created_at)}</div></div>
                <StatusBadge status={f.status}/>
              </div>
            </Card>
          )})}
        </div>
      )}

      {tab==='create'&&(
        <DeliveryForm defaultSender={{name:user.full_name,phone:user.phone}} onSubmit={(form,tracking)=>{
          if(form) dispatch({type:'CREATE_DELIVERY',customerId:user.id,form,tracking})
          else setTab('orders')
        }}/>
      )}

      {tab==='orders'&&(
        <div style={{ padding:16,paddingBottom:80 }}>
          {myDels.length===0&&<div style={{ textAlign:'center',padding:32,color:'#999' }}>Захиалга байхгүй</div>}
          {[...myDels].reverse().map(d=>{const f=state.deliveries.find(x=>x.id===d.id)||d;return(
            <Card key={d.id} onClick={()=>{setSel(f);setTab('track')}}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:6 }}><div style={{ fontWeight:700 }}>{f.tracking_code}</div><StatusBadge status={f.status}/></div>
              <div style={{ fontSize:13,color:'#555' }}>📦 {f.item_description}</div>
              <div style={{ fontSize:12,color:'#888' }}>📍 {f.pickup_address}</div>
              <div style={{ fontSize:12,color:'#888' }}>🎯 {f.dropoff_address}</div>
              <div style={{ fontSize:11,color:'#bbb',marginTop:4 }}>{fmtTime(f.created_at)}</div>
            </Card>
          )})}
        </div>
      )}

      {tab==='track'&&sel&&(()=>{
        const d=state.deliveries.find(x=>x.id===sel.id)||sel
        const drvUser=d.assigned_driver_id?getDrvUser(d.assigned_driver_id):null
        const curIdx=STEPS.indexOf(d.status)
        return(
          <div style={{ padding:16,paddingBottom:80 }}>
            <div style={{ fontWeight:800,fontSize:17,marginBottom:4 }}>{d.tracking_code}</div>
            <div style={{ marginBottom:16 }}><StatusBadge status={d.status} size='lg'/></div>
            <div style={{ marginBottom:16 }}>
              {STEPS.map((s,i)=>{
                const done=i<=curIdx&&d.status!=='cancelled'
                const active=i===curIdx&&d.status!=='cancelled'
                return(
                  <div key={s} style={{ display:'flex',gap:12,marginBottom:8,alignItems:'flex-start' }}>
                    <div style={{ display:'flex',flexDirection:'column',alignItems:'center' }}>
                      <div style={{ width:28,height:28,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,background:done?'#1a1a2e':'#f0f0f0',color:done?'#fff':'#999',fontWeight:700 }}>{done?'✓':i+1}</div>
                      {i<STEPS.length-1&&<div style={{ width:2,height:20,background:done&&i<curIdx?'#1a1a2e':'#e0e0e0',marginTop:2 }}/>}
                    </div>
                    <div style={{ paddingTop:4 }}>
                      <div style={{ fontSize:14,fontWeight:active?700:500,color:active?'#1a1a2e':done?'#444':'#999' }}>{STATUS_CONFIG[s]?.label}</div>
                      {d.status_logs?.find(l=>l.new_status===s)&&<div style={{ fontSize:11,color:'#999' }}>{fmtTime(d.status_logs.find(l=>l.new_status===s)?.created_at)}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
            {drvUser&&<Card style={{ background:'#eff6ff' }}><div style={{ fontWeight:600,marginBottom:6 }}>🚗 Таны жолооч</div><div style={{ fontSize:14 }}>{drvUser.full_name}</div><div style={{ fontSize:14 }}>📞 <a href={`tel:${drvUser.phone}`} style={{ color:'#2563eb' }}>{drvUser.phone}</a></div></Card>}
            <Card>
              <div style={{ fontWeight:600,marginBottom:8 }}>Захиалгын дэлгэрэнгүй</div>
              <div style={{ fontSize:13,color:'#444',marginBottom:3 }}>📦 {d.item_description} · {d.item_size}</div>
              <div style={{ fontSize:13,color:'#444',marginBottom:3 }}>📍 {d.pickup_address}</div>
              <div style={{ fontSize:13,color:'#444' }}>🎯 {d.dropoff_address}</div>
            </Card>
          </div>
        )
      })()}

      {tab==='profile'&&(
        <div style={{ padding:16,paddingBottom:80 }}>
          <div style={{ background:'linear-gradient(135deg,#1a1a2e,#0f3460)',borderRadius:20,padding:24,color:'#fff',textAlign:'center',marginBottom:16 }}>
            <div style={{ width:72,height:72,borderRadius:36,background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',fontSize:32,fontWeight:700 }}>{user.full_name[0]}</div>
            <div style={{ fontSize:20,fontWeight:700 }}>{user.full_name}</div>
            <div style={{ fontSize:13,opacity:0.7 }}>{user.email}</div>
            <div style={{ fontSize:13,opacity:0.7 }}>📞 {user.phone}</div>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
            <div style={{ background:'#eff6ff',borderRadius:14,padding:16,textAlign:'center' }}><div style={{ fontSize:24,fontWeight:800,color:'#2563eb' }}>{myDels.length}</div><div style={{ fontSize:12,color:'#666' }}>Нийт захиалга</div></div>
            <div style={{ background:'#f0fdf4',borderRadius:14,padding:16,textAlign:'center' }}><div style={{ fontSize:24,fontWeight:800,color:'#16a34a' }}>{myDels.filter(d=>state.deliveries.find(x=>x.id===d.id)?.status==='delivered').length}</div><div style={{ fontSize:12,color:'#666' }}>Хүргэгдсэн</div></div>
          </div>
        </div>
      )}

      {tab!=='track'&&<BottomNav tabs={TABS} active={tab} onSelect={setTab}/>}
    </div>
  )
}
