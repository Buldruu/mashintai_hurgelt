export function TopBar({ title, onBack, right }) {
  return (
    <div style={{ background: '#1a1a2e', color: '#fff', padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
      {onBack && (
        <button onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', padding: 0 }}>
          ←
        </button>
      )}
      <div style={{ flex: 1, fontSize: 17, fontWeight: 700 }}>{title}</div>
      {right}
    </div>
  )
}

export function LogoutBtn({ onLogout }) {
  return (
    <button onClick={onLogout}
      style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 8,
        color: '#fff', padding: '6px 14px', fontSize: 13, cursor: 'pointer',
        fontFamily: 'inherit', fontWeight: 600, whiteSpace: 'nowrap' }}>
      Гарах
    </button>
  )
}
