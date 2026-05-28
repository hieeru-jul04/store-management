# Hệ Thống Quản Lý Cửa Hàng (Store Management Web App)

Đây là một hệ thống Web Application toàn diện giúp các chủ cửa hàng bán lẻ/bán buôn quản lý toàn bộ quy trình kinh doanh từ Nhập kho, Quản lý sản phẩm, Bán hàng, đến Quản lý khách hàng. Điểm nổi bật của hệ thống là khả năng tính toán lợi nhuận tự động và chính xác dựa trên thuật toán **FIFO (First-In, First-Out)** đối với các lô nhập hàng.

---

## 🌟 Các Tính Năng Nổi Bật

### 1. Hệ thống Tài khoản & Xác thực (Authentication)
- Cung cấp cơ chế Đăng ký và Đăng nhập bảo mật bằng **JWT (JSON Web Token)**.
- Mỗi người dùng sẽ được cấp một Không gian Cửa hàng (Shop) độc lập. Dữ liệu của các cửa hàng hoàn toàn được tách biệt.
- Giao diện thân thiện, bảo mật, phiên đăng nhập được lưu trữ an toàn dưới Frontend.

### 2. Quản Lý Sản Phẩm & Danh Mục
- Tạo mới, cập nhật, xóa Danh mục sản phẩm để dễ dàng phân loại.
- Quản lý thông tin Sản phẩm: Tên, Hình ảnh (URL), Mô tả, Trạng thái (Đang bán/Ngừng bán).
- Tự động sinh mã SKU cho sản phẩm mới. Quản lý trạng thái tồn kho tổng thể theo thời gian thực.

### 3. Quản Lý Nhập Kho (Lô Hàng - Import Batches)
- Hàng hóa không có giá nhập cố định. Thay vào đó, mỗi lần nhập kho sẽ tạo thành một **Lô hàng (Import Batch)**.
- Hệ thống ghi nhận: Số lượng nhập, Giá nhập tại xưởng, và **Phí vận chuyển từ xưởng về cửa hàng** cho từng lô.
- Cho phép xem lại lịch sử nhập kho chi tiết của từng loại sản phẩm.

### 4. Quản Lý Đơn Hàng (Bán Hàng)
- Cho phép tạo đơn hàng gồm **nhiều sản phẩm cùng lúc**.
- Nhập thông tin Khách hàng (có thể chọn khách cũ hoặc tạo mới ngay trên form).
- Ghi nhận Giá bán thực tế cho từng sản phẩm và **Phí vận chuyển giao tới nhà khách hàng**.
- Hỗ trợ thiết lập "Ngày mua hàng" ở quá khứ đối với các đơn hàng bị sót chưa kịp nhập vào hệ thống.
- Theo dõi các trạng thái đơn hàng: Chờ xử lý, Đang giao, Đã hoàn thành, Đã hủy.

### 5. Thuật Toán Tính Lợi Nhuận Tự Động (FIFO)
Khi tạo đơn hàng, Backend sẽ tự động quét các lô hàng trong kho theo nguyên tắc **Nhập trước - Xuất trước (FIFO)**:
- Hàng lấy từ lô nào sẽ tự động trừ tồn kho của lô đó.
- Lợi nhuận = Tổng tiền thu khách - (Giá nhập x Số lượng xuất từ lô tương ứng) - (Phí VC từ xưởng x Số lượng xuất) - (Phí VC giao cho khách).
- Đảm bảo lợi nhuận được tính toán cực kỳ chính xác kể cả khi giá nhập/phí vận chuyển thay đổi liên tục theo từng thời điểm nhập kho.

### 6. Quản Lý Khách Hàng
- Tự động lưu hồ sơ khách hàng khi lên đơn hàng thành công.
- Lưu trữ Tên, Số điện thoại và Địa chỉ giao hàng.
- Xem danh sách khách hàng thân thiết.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend (Client-side)
- **Framework**: React.js (phiên bản ^18.2).
- **Build Tool**: Vite (giúp khởi động server dev cực nhanh).
- **Styling**: TailwindCSS (dễ dàng tùy biến giao diện hiện đại, responsive).
- **Router**: React Router DOM (quản lý điều hướng trang SPA mượt mà).
- **State Management & Call API**: Custom hooks, Fetch API.
- **Icons**: Lucide React.

### Backend (Server-side)
- **Framework**: Spring Boot 3 (Java 21).
- **Security**: Spring Security kết hợp với JWT Filter.
- **ORM**: Hibernate & Spring Data JPA.
- **Database**: MySQL.
- **Tools**: Lombok, Maven.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
manage-store-web-app/
├── client/                      # Mã nguồn Frontend (React)
│   ├── src/
│   │   ├── api/                 # Các hàm gọi API tới Backend
│   │   ├── components/          # UI Components dùng chung (Button, Input, Modal, Layout...)
│   │   ├── constants/           # Định nghĩa các hằng số (Status, v.v...)
│   │   ├── contexts/            # React Context (AuthContext)
│   │   ├── pages/               # Các màn hình chính (Orders, Products, Inventory...)
│   │   └── utils/               # Các hàm hỗ trợ (Format Tiền tệ, Ngày tháng...)
│   └── package.json
│
├── server/                      # Mã nguồn Backend (Spring Boot)
│   ├── src/main/java/com/store_management/
│   │   ├── config/              # Cấu hình Security, CORS, JWT
│   │   ├── controllers/         # Các REST API Endpoints
│   │   ├── dtos/                # Data Transfer Objects (nhận và trả dữ liệu)
│   │   ├── entities/            # Các Entity map với Database
│   │   ├── repositories/        # JPA Repositories truy xuất Database
│   │   └── services/            # Chứa các Business Logic cốt lõi (như logic FIFO)
│   └── pom.xml
│
├── .gitignore
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt Và Khởi Chạy

### Yêu cầu hệ thống:
- Java JDK 21 trở lên.
- Node.js (phiên bản 18+).
- MySQL Server (đang chạy ở cổng mặc định 3306).

### 1. Cấu hình Database
Mở Terminal/CMD hoặc công cụ quản lý MySQL (như DBeaver, Navicat) và tạo cơ sở dữ liệu:
```sql
CREATE DATABASE store_management;
```
*(Nếu MySQL của bạn có Username hoặc Password khác mặc định `root`/để trống, hãy sửa lại cấu hình trong file `server/src/main/resources/application.properties`)*.

### 2. Khởi chạy Backend (Spring Boot)
Mở cửa sổ Terminal thứ nhất:
```bash
cd server
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```
- Backend sẽ chạy tại: **http://localhost:8080**
- *Lưu ý: Ngay lần chạy đầu tiên, Hibernate sẽ tự động phân tích các Entities và tạo sẵn toàn bộ các bảng trong cơ sở dữ liệu.*

### 3. Khởi chạy Frontend (React)
Mở cửa sổ Terminal thứ hai:
```bash
cd client
npm install
npm run dev
```
- Frontend sẽ chạy tại: **http://localhost:5173**

### 4. Bắt đầu sử dụng
- Mở trình duyệt web và truy cập `http://localhost:5173`.
- Bấm vào **"Đăng ký"** để tạo một tài khoản và tên Cửa hàng mới cho bạn.
- Sau khi Đăng ký thành công, hệ thống sẽ tự động Đăng nhập và chuyển bạn vào màn hình Dashboard (Bảng điều khiển).
- Thử nghiệm ngay các luồng: **Tạo Danh mục -> Tạo Sản phẩm -> Nhập kho -> Tạo Đơn hàng**.
