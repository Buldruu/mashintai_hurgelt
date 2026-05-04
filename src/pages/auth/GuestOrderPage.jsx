import { useState } from 'react'
import { TopBar } from '../../components/ui/TopBar'
import { Input, Select } from '../../components/ui/FormFields'
import { PrimaryBtn } from '../../components/ui/Button'
import { ITEM_SIZES, PAYMENT_METHODS } from '../../constants'
import { genTracking } from '../../store/helpers'

export default function GuestOrderPage({ onSubmit, onBack }) {
  const [form, setForm] = useState({
    sender_name: '', sender_phone: '', pickup_address: '',
    receiver_name: '', receiver_phone: '', dropoff_address: '',
    item_description: '', item_size: 'Жижиг', item_weight: '',
    note: '', payment_method: 'Бэлэн мөнгө', preferred_pickup_time: '',
  })
  const [done, setDone] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  if (done) return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ fontSize: 80 }}>✅</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a', marginBottom: 8 }}>Захиалга амжилттай!</div>
      <div style={{ fontSize: 15, color: '#555', marginBottom: 8 }}>Таны дагалдах код:</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: '#1a1a2e', background: '#e0e7ff',
        padding: '14px 36px', borderRadius: 16, marginBottom: 24, display: 'inline-block' }}>{done}</div>
      <div style={{ fontSize: 14, color: '#666', marginBottom: 28, maxWidth: 300 }}>
        Энэ кодоор захиалгаа хянах боломжтой.
      </div>
      <PrimaryBtn onClick={onBack} style={{ padding: '14px 32px' }}>← Буцах</PrimaryBtn>
    </div>
  )

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#f8f9fa', fontFamily: 'system-ui,sans-serif' }}>
      <TopBar title='Захиалга өгөх' onBack={onBack} />
      <div style={{ padding: 16, paddingBottom: 100 }}>
        <div style={{ background: '#eff6ff', borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 13, color: '#1d4ed8' }}>
          ℹ️ Нэвтрэлгүйгээр захиалга өгч болно. Дагалдах кодоо хадгалаарай.
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Илгээгч мэдээлэл</div>
        <Input label='Илгээгчийн нэр'  value={form.sender_name}    onChange={v => set('sender_name', v)} required />
        <Input label='Илгээгчийн утас' value={form.sender_phone}   onChange={v => set('sender_phone', v)} required />
        <Input label='Авах хаяг'       value={form.pickup_address} onChange={v => set('pickup_address', v)} placeholder='Дүүрэг, хороо, байр...' required />
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, marginTop: 8 }}>Хүлээн авагч мэдээлэл</div>
        <Input label='Хүлээн авагчийн нэр'  value={form.receiver_name}   onChange={v => set('receiver_name', v)} required />
        <Input label='Хүлээн авагчийн утас' value={form.receiver_phone}  onChange={v => set('receiver_phone', v)} required />
        <Input label='Хүргэх хаяг'          value={form.dropoff_address} onChange={v => set('dropoff_address', v)} placeholder='Дүүрэг, хороо, байр...' required />
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, marginTop: 8 }}>Барааны мэдээлэл</div>
        <Input label='Барааны тайлбар' value={form.item_description} onChange={v => set('item_description', v)} required />
        <Select label='Хэмжээ' value={form.item_size} onChange={v => set('item_size', v)} options={ITEM_SIZES.map(s => ({ value: s, label: s }))} />
        <Input label='Жин (кг)'  value={form.item_weight} onChange={v => set('item_weight', v)} />
        <Input label='Тэмдэглэл' value={form.note}         onChange={v => set('note', v)} placeholder='Онцгой заавар...' />
        <Select label='Төлбөрийн хэлбэр' value={form.payment_method} onChange={v => set('payment_method', v)} options={PAYMENT_METHODS.map(p => ({ value: p, label: p }))} />
        <Input label='Авах цаг' value={form.preferred_pickup_time} onChange={v => set('preferred_pickup_time', v)} type='time' />
        <PrimaryBtn full style={{ marginTop: 12 }} onClick={() => {
          if (!form.sender_name || !form.sender_phone || !form.pickup_address ||
              !form.receiver_name || !form.receiver_phone || !form.dropoff_address || !form.item_description) {
            alert('Шаардлагатай талбаруудыг бөглөнө үү (*)')
            return
          }
          const tracking = genTracking()
          onSubmit(form, tracking)
          setDone(tracking)
        }}>📦 Захиалга илгээх</PrimaryBtn>
      </div>
    </div>
  )
}
