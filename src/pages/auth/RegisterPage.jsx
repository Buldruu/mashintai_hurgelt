import { useState } from 'react'
import { Input } from '../../components/ui/FormFields'
import { PrimaryBtn } from '../../components/ui/Button'

export default function RegisterPage({ onRegister, onBack }) {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', password: '', confirm: '' })
  const [err, setErr] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#1a1a2e,#0f3460)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 380 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Бүртгүүлэх</div>
        <Input label='Бүтэн нэр'      value={form.full_name} onChange={v => set('full_name', v)} required />
        <Input label='Утасны дугаар'  value={form.phone}     onChange={v => set('phone', v)} required />
        <Input label='Имэйл'          value={form.email}     onChange={v => set('email', v)} type='email' required />
        <Input label='Нууц үг'        value={form.password}  onChange={v => set('password', v)} type='password' required />
        <Input label='Нууц үг давтах' value={form.confirm}   onChange={v => set('confirm', v)} type='password' required />
        {err && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 10 }}>{err}</div>}
        <PrimaryBtn full onClick={() => {
          if (!form.full_name || !form.phone || !form.email || !form.password) { setErr('Бүх талбарыг бөглөнө үү'); return }
          if (form.password !== form.confirm) { setErr('Нууц үг таарахгүй байна'); return }
          onRegister(form)
        }}>Бүртгүүлэх</PrimaryBtn>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span onClick={onBack} style={{ color: '#1a1a2e', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>← Буцах</span>
        </div>
      </div>
    </div>
  )
}
