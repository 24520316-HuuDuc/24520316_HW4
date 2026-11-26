# 24520316 — Homework 4

```
24520316_HW4/
├── Bai1_PhotoGallery/frontend/      # React + Vite + react-router-dom
├── Bai2_SwipeDeck/
│   ├── frontend/                    # React + Vite
│   └── backend/                     # Express + Mongoose 8
├── Bai3_FairPlayAppeal/frontend/    # React + Vite + react-router-dom
├── .gitignore
└── README.md
```

Yêu cầu: Node.js 18+ (khuyến nghị 20+). Bài 2 cần thêm MongoDB (cài trên máy hoặc dùng MongoDB Atlas).

---

## Bài 1 — PhotoGalleryLayout.jsx & Native HTML5 `<dialog>` Modal

Thư viện ảnh dùng `<dialog>` gốc của HTML5. Trạng thái modal được đồng bộ với URL qua `useSearchParams`, và focus được quản lý theo WCAG 2.2 AA.

### Cách chạy

```bash
cd Bai1_PhotoGallery/frontend
npm install
npm run dev
```

Mở `http://localhost:5173`.

### Các điểm chính trong code (`src/components/PhotoGalleryLayout.jsx`)

| # | Yêu cầu | Cách làm |
|---|---------|----------|
| 1 | Đồng bộ URL query string | `const [searchParams, setSearchParams] = useSearchParams()` |
| 2 | Trạng thái modal lấy từ URL | `searchParams.get('photoId')`, không dùng `useState` riêng |
| 3 | Gắn ref cho `<dialog>` | `const dialogRef = useRef(null)` |
| 4 | Focus trap & mở modal (WCAG 2.2 AA) | `useEffect` gọi `showModal()` / `close()` khi `photoId` đổi |
| 5 | Đóng modal → cập nhật lại URL | `<dialog onClose={...}>` gọi `setSearchParams({})` |

### Accessibility (WCAG 2.2 AA)

- `showModal()` tự giữ focus trong dialog và làm phần còn lại của trang không tương tác được.
- Phím **Esc** đóng modal (hành vi gốc của `<dialog>`).
- Khi mở, focus vào nút **Đóng** (`autoFocus`). Khi đóng, focus quay về đúng ảnh vừa bấm.
- `aria-labelledby` gắn tiêu đề cho dialog, `aria-haspopup="dialog"` trên nút mở.
- Nút đóng có kích thước 44×44px (2.5.8 Target Size).
- Viền focus hiển thị rõ bằng `:focus-visible` (2.4.7).
- Tắt hiệu ứng chuyển động khi người dùng bật `prefers-reduced-motion`.

### Kiểm tra nhanh

1. Bấm vào một ảnh → URL thành `?photoId=2`, modal mở.
2. Tải lại trang → modal vẫn mở đúng ảnh đó (deep link).
3. Bấm Esc / nút ✕ / vùng tối bên ngoài → modal đóng, URL mất `photoId`, focus về lại ảnh.
4. Bấm nút Back của trình duyệt sau khi mở ảnh → modal đóng.
5. Dùng Tab khi modal mở → focus không thoát ra ngoài modal.

---

## Bài 2 — SwipeDeck.jsx (Frontend) + Express/Mongoose 8 (Backend)

"Hẹn Hò Nhưng Không Yêu" Edition.

### Cách chạy

**Backend** (terminal 1):

```bash
cd Bai2_SwipeDeck/backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
# sửa MONGODB_URI trong .env nếu cần
npm start
```

Server chạy ở `http://localhost:5000`. Lần chạy đầu sẽ tự thêm 5 profile mẫu.

**Frontend** (terminal 2):

```bash
cd Bai2_SwipeDeck/frontend
npm install
npm run dev
```

Mở `http://localhost:5173`. Vite tự chuyển các request `/api` sang cổng 5000 (cấu hình `proxy` trong `vite.config.js`).

### Frontend (`src/components/SwipeDeck.jsx`)

| Yêu cầu | Cách làm |
|---------|----------|
| Điều khiển bằng bàn phím | `onKeyDown` trên `<div tabIndex={0}>`: ← bỏ qua, → thích, ↑ siêu thích, Backspace hoàn tác |
| Vuốt bằng chuột / cảm ứng | `onPointerDown` / `onPointerMove` / `onPointerUp`, ngưỡng ±50px |
| Undo kiểu LIFO | `history` là stack: swipe = push `[...prev, action]`, undo = pop `prev.slice(0, -1)` |
| Điểm bất đối xứng | `score = history.reduce(...)`: LIKE +10, còn lại −5. Không lưu vào state nên tự tính lại mỗi lần render |

### Backend (`server.js`)

| Yêu cầu | Cách làm |
|---------|----------|
| Bảo mật chuỗi kết nối | Đọc `process.env.MONGODB_URI` từ `.env`, thiếu thì `throw new Error('MONGODB_URI missing')` |
| Không dùng flag cũ | `await mongoose.connect(process.env.MONGODB_URI)`, không có `useNewUrlParser` / `useUnifiedTopology` |
| `GET /api/profiles` | `async/await` + `.lean()` để đọc nhanh |
| `POST /api/swipe` | `async/await` + `try/catch`, thành công trả 201, lỗi validate trả 400 |

File `.env` đã nằm trong `.gitignore`, không bị đẩy lên Git.

---

## Bài 3 — FairPlayAppealPortal.jsx & useAppealSlaTimer.js

### Cách chạy

```bash
cd Bai3_FairPlayAppeal/frontend
npm install
npm run dev
```

Mở `http://localhost:5173`. Trang tự chuyển sang `/dossier/himass`.

### Cấu trúc `src/`

| File | Vai trò |
|------|---------|
| `components/FairPlayAppealPortal.jsx` | Định tuyến `/dossier/himass` và `/dossier/tanvuu` |
| `components/DossierView.jsx` | Hiển thị hồ sơ, tính ma trận bằng `useMemo` |
| `components/SlaCountdown.jsx` | Hiển thị đồng hồ đếm ngược hạn kháng cáo |
| `hooks/useAppealSlaTimer.js` | Hook đếm ngược không bị trôi giờ |
| `utils/computeMatrix.js` | Tính ma trận mức độ tương xứng của hình phạt |
| `data/dossiers.js` | Dữ liệu mẫu của Himass và TanVuu |

### Ma trận tương xứng

`tỷ lệ = số ngày phạt thực tế / số ngày phạt chuẩn theo mức độ`. Trên 1.5 là phạt quá nặng (đủ cơ sở kháng cáo), dưới 0.67 là phạt quá nhẹ, còn lại là tương xứng. Ma trận được tính trong lúc render bằng `useMemo`, không lưu vào state.

### Đếm ngược không trôi giờ

- Không đếm kiểu "trừ 1 mỗi giây", vì trình duyệt làm chậm `setInterval` khi tab bị ẩn.
- Mỗi lần tick đều tính lại `deadline - (Date.now() + offset)` theo đồng hồ thật.
- Lắng nghe `visibilitychange`: khi tab hiện lại thì gọi `resyncTimerWithServer()` để cập nhật ngay.
- Nếu có endpoint giờ server (truyền `syncUrl`), hook tự tính độ lệch đồng hồ và bù nửa thời gian round-trip.

**Kiểm tra:** mở trang, chuyển sang tab khác vài phút rồi quay lại. Đồng hồ phải hiện đúng thời gian còn lại, không bị chậm.
