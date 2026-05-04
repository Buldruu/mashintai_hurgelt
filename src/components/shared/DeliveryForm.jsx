import { useState } from 'react'
import { Input, Select } from '../ui/FormFields'
import { PrimaryBtn } from '../ui/Button'
import { ITEM_SIZES, PAYMENT_METHODS } from '../../constants'
import { genTracking } from '../../store/helpers'

const EMPTY = {
  sender_name: '', sender_phone: '', pickup_address: '',
  receiver_name: '', receiver_phone: '', dropoff_address: '',
  item_description: '', item_size: 'Жижиг', item_weight: '',
  note: '', payment_method: 'Бэлэн мөнгө', preferred_pickup_time: '',
}

export default function DeliveryForm({ defaultSender, onSubmit }) {
  const [form, setForm] = useState({ ...EMPTY, sender_name: defaultSender?.name || '', sender_phone: defaultSender?.phone || '' })
  const [done, setDone] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  if (done) return (
    <div style={{ padding: 24, textAlign: 'center', paddingBottom: 80 }}>
      <div style={{ fontSize: 64 }}>✅</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a', marginBottom: 8 }}>Захиалга амжилттай!</div>
      <div style={{ fontSize: 15, color: '#444', marginBottom: 4 }}>Дагалдах код:</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', background: '#e0e7ff', padding: '12px 24px', borderRadius: 14, display: 'inline-block', marginBottom: 20 }}>{done}</div>
      <br />
      <PrimaryBtn onClick={() => onSubmit(null)} style={{ padding: '14px 32px' }}>Захиалгын жагсаалт харах</PrimaryBtn>
    </div>
  )

  return (
    <div style={{ padding: 16, paddingBottom: 100 }}>
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
  )
}
