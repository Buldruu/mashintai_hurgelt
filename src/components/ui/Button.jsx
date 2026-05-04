export function Btn({ children, onClick, color = '#111', bg = '#f5f5f5', disabled, full, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: bg, color, border: 'none', borderRadius: 12, padding: '12px 20px',
        fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        width: full ? '100%' : undefined, transition: 'transform 0.1s', ...style }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={e =>   !disabled && (e.currentTarget.style.transform = 'scale(1)')}
    >{children}</button>
  )
}
export const PrimaryBtn = (p) => <Btn {...p} color='#fff' style={{ background: '#1a1a2e', ...p.style }} />
export const DangerBtn  = (p) => <Btn {...p} color='#fff' bg='#dc2626' />
