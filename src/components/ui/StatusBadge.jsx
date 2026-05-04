import { STATUS_CONFIG } from '../../constants'

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      padding: size === 'lg' ? '6px 14px' : '3px 10px',
      borderRadius: 20, fontSize: size === 'lg' ? 15 : 12,
      fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  )
}
