export default function BottomNav({ tabs, active, onSelect }) {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: 'min(480px,100%)', background: '#fff', borderTop: '1px solid #eee',
      display: 'flex', zIndex: 100 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onSelect(t.id)}
          style={{ flex: 1, padding: '10px 4px 12px', background: 'none', border: 'none',
            cursor: 'pointer', color: active === t.id ? '#1a1a2e' : '#aaa',
            fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 22 }}>{t.icon}</span>{t.label}
        </button>
      ))}
    </div>
  )
}
