import { getProducts } from './product.api'
import { getOrders } from './order.api'
import { getSettings } from './shop.api'

export async function getDashboardStats() {
    const [products, orders, settings] = await Promise.all([
        getProducts(),
        getOrders(),
        getSettings()
    ]);
    
    const LOW_STOCK_THRESHOLD = settings?.lowStockThreshold ?? 10;
    const today = new Date().toDateString();
    
    const ordersToday = orders.filter(
        (o) => new Date(o.createdAt).toDateString() === today
    );
    
    const revenueToday = ordersToday
        .filter((o) => o.status !== 'CANCELLED' && o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0);
        
    const lowStock = products.filter(
        (p) => p.status === 'active' && p.stock <= LOW_STOCK_THRESHOLD
    );
    
    return {
        totalProducts: products.filter((p) => p.status === 'active').length,
        totalOrders: orders.length,
        ordersToday: ordersToday.length,
        revenueToday,
        lowStockCount: lowStock.length,
        recentOrders: [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5),
        lowStockProducts: lowStock.slice(0, 5),
    };
}
