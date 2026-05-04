import { useState } from 'react'
import { Input } from '../../components/ui/FormFields'
import { PrimaryBtn } from '../../components/ui/Button'

export default function LoginPage({ onLogin, onGoRegister, onGuestOrder }) {
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [err,   setErr]   = useState('')

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>🚀</div>
        <div style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>Хүргэлтийн Апп</div>
        <div style={{ color: '#a0aec0', fontSize: 14, marginTop: 4 }}>Монголын хурдан хүргэлт</div>
      </div>
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 380 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Нэвтрэх</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Систем таны дүрийг автоматаар тодорхойлно</div>

        <Input label='Имэйл'   value={email} onChange={v => { setEmail(v); setErr('') }} type='email' placeholder='example@mail.mn' required />
        <Input label='Нууц үг' value={pass}  onChange={v => { setPass(v);  setErr('') }} type='password' placeholder='••••••••' required />

        {err && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 12, background: '#fee2e2', padding: '8px 12px', borderRadius: 8 }}>{err}</div>}

        <PrimaryBtn full style={{ marginBottom: 12 }} onClick={() => {
          if (!email || !pass) { setErr('Бүх талбарыг бөглөнө үү'); return }
          if (!onLogin(email, pass)) setErr('Имэйл эсвэл нууц үг буруу байна')
        }}>Нэвтрэх</PrimaryBtn>

        <button onClick={onGuestOrder}
          style={{ width: '100%', padding: '12px 20px', border: '2px dashed #d0d0d0', borderRadius: 12,
            background: '#fafafa', color: '#444', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', marginBottom: 18 }}>
          📦 Нэвтрэлгүйгээр захиалга өгөх
        </button>

        <div style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>
          Бүртгэл байхгүй юу?{' '}
          <span onClick={onGoRegister} style={{ color: '#1a1a2e', fontWeight: 600, cursor: 'pointer' }}>Бүртгүүлэх</span>
        </div>

        <div style={{ marginTop: 20, padding: 12, background: '#f8f9fa', borderRadius: 10, fontSize: 12, color: '#888', lineHeight: 1.8 }}>
          <strong>Туршилтын бүртгэлүүд:</strong><br />
          Админ: admin@hurgelt.mn / admin123<br />
          Жолооч: driver1@hurgelt.mn / driver123<br />
          Хэрэглэгч: cust1@example.mn / cust123
        </div>
      </div>
    </div>
  )
}
