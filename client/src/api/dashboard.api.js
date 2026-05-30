import { getProducts } from './product.api'
import { getOrders } from './order.api'
import { getSettings } from './shop.api'

export async function getDashboardStats() {
    const [products, orders, settings] = await Promise.all([
        getProducts(),
        getOrders(),
        getSettings()
    ]);

    return {
        products,
        orders,
        settings
    };
}
