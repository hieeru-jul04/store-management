import { ORDER_STATUS } from '../../constants/orderStatus'
import { Badge } from '../ui/Badge'

export function OrderStatusBadge({ status }) {
  const meta = ORDER_STATUS[status] ?? ORDER_STATUS.pending
  return <Badge color={meta.color}>{meta.label}</Badge>
}
