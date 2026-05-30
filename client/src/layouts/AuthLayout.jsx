import { Link, Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50 to-slate-100 dark:from-slate-900 dark:via-brand-900/20 dark:to-slate-800 transition-colors">
      <div className="w-full flex min-h-screen flex-col lg:flex-row">
        <aside className="w-1/2 hidden overflow-hidden bg-brand-900 dark:bg-slate-950 px-16 py-12 text-white lg:flex lg:w-1/2 lg:flex-col lg:justify-between border-r border-transparent dark:border-slate-800">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">
                🏪
              </span>
              StoreManager
            </Link>
            <h1 className="mt-12 text-4xl font-bold leading-tight text-white">
              Quản lý cửa hàng
              <br />
              <span className="text-brand-100 dark:text-brand-400">đơn giản & hiệu quả</span>
            </h1>
            <p className="mt-4 max-w-md text-brand-100/90 dark:text-slate-300 leading-relaxed">
              Đăng ký miễn phí, tạo tài khoản cho cửa hàng của bạn và bắt đầu quản lý
              sản phẩm, đơn hàng, kho hàng trên một nền tảng duy nhất.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-brand-100/80 dark:text-slate-400">
            <li className="flex items-center gap-2">✓ Dành cho mọi loại hình cửa hàng</li>
            <li className="flex items-center gap-2">✓ Thiết lập nhanh trong vài phút</li>
            <li className="flex items-center gap-2">✓ Dữ liệu riêng biệt theo từng shop</li>
          </ul>
        </aside>

        <main className="w-1/2 flex items-center justify-center px-4 py-10 sm:px-8 w-full lg:w-1/2">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold text-brand-900 dark:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white text-xl">
                  🏪
                </span>
                StoreManager
              </Link>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
