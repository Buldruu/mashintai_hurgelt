export default function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick}
      style={{ background: '#fff', borderRadius: 16, border: '1px solid #eee',
        padding: 16, marginBottom: 12, cursor: onClick ? 'pointer' : undefined, ...style }}>
      {children}
    </div>
  )
}
