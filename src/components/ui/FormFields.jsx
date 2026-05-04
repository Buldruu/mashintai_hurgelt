export function Input({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 13, color: '#555', marginBottom: 5, fontWeight: 500 }}>{label}{required && ' *'}</div>}
      <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder}
        style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', border: '1.5px solid #e0e0e0',
          borderRadius: 10, fontSize: 15, fontFamily: 'inherit', outline: 'none', background: '#fafafa' }} />
    </div>
  )
}

export function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 13, color: '#555', marginBottom: 5, fontWeight: 500 }}>{label}</div>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0',
          borderRadius: 10, fontSize: 15, fontFamily: 'inherit', background: '#fafafa' }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
