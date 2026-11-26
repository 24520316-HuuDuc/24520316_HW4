/**
 * BÀI 1 — PhotoGalleryLayout.jsx
 * Native HTML5 <dialog> Modal + useSearchParams + WCAG 2.2 AA Focus Management
 */
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

// Dữ liệu mẫu
const PHOTOS = [
  { id: '1', title: 'Hoàng hôn Đà Lạt', url: 'https://picsum.photos/id/1015/800/500' },
  { id: '2', title: 'Biển Nha Trang', url: 'https://picsum.photos/id/1011/800/500' },
  { id: '3', title: 'Phố cổ Hội An', url: 'https://picsum.photos/id/1025/800/500' },
  { id: '4', title: 'Ruộng bậc thang', url: 'https://picsum.photos/id/1035/800/500' },
  { id: '5', title: 'Rừng thông', url: 'https://picsum.photos/id/1043/800/500' },
  { id: '6', title: 'Núi mù sương', url: 'https://picsum.photos/id/1036/800/500' },
];

export default function PhotoGalleryLayout() {
  // 1. URL query string synchronization
  const [searchParams, setSearchParams] = useSearchParams();

  // 2. Modal state derived directly from URL (không dùng useState riêng)
  const selectedPhotoId = searchParams.get('photoId');
  const selectedPhoto = PHOTOS.find((p) => p.id === selectedPhotoId) ?? null;

  // 3. HTML5 <dialog> ref binding
  const dialogRef = useRef(null);

  // Lưu phần tử đã mở modal để trả focus về khi đóng (WCAG 2.4.3 Focus Order)
  const triggerRef = useRef(null);

  // 4. Focus trap & open trigger (WCAG 2.2 AA Focus Management)
  //    showModal() tự tạo focus trap + backdrop + làm "inert" phần còn lại của trang.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedPhotoId) {
      // Gọi showModal() khi dialog đang mở sẽ ném InvalidStateError → kiểm tra trước
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [selectedPhotoId]);

  const openPhoto = (id, event) => {
    triggerRef.current = event.currentTarget;
    setSearchParams({ photoId: id });
  };

  // 5. Close handler syncing back to URL
  //    Sự kiện "close" bắn ra khi: bấm Esc, bấm nút Đóng, hoặc dialog.close() từ effect.
  const handleClose = () => {
    if (searchParams.has('photoId')) {
      setSearchParams({});
    }
    // Trả focus về thumbnail đã mở (vào thẳng bằng link thì không có trigger)
    triggerRef.current?.focus();
  };

  // Click ra vùng backdrop thì đóng
  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) dialogRef.current.close();
  };

  return (
    <main className="gallery">
      <h1 className="gallery__title">Thư viện ảnh</h1>
      <p className="gallery__hint">
        Bấm vào ảnh để xem lớn. URL sẽ đổi thành <code>?photoId=…</code> — có thể copy link để chia sẻ.
      </p>

      <ul className="gallery__grid" role="list">
        {PHOTOS.map((photo) => (
          <li key={photo.id}>
            <button
              type="button"
              className="gallery__thumb-btn"
              onClick={(e) => openPhoto(photo.id, e)}
              aria-haspopup="dialog"
              aria-label={`Xem ảnh lớn: ${photo.title}`}
            >
              <img src={photo.url} alt="" className="gallery__thumb" />
              <span className="gallery__caption">{photo.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        onClick={handleBackdropClick}
        aria-labelledby="photo-dialog-title"
        className="photo-dialog"
      >
        <header className="photo-dialog__header">
          <h2 id="photo-dialog-title" className="photo-dialog__title">
            {selectedPhoto ? selectedPhoto.title : 'Không tìm thấy ảnh'}
          </h2>
          {/* autoFocus: focus vào nút đóng khi modal mở */}
          <button
            type="button"
            autoFocus
            className="photo-dialog__close"
            onClick={() => dialogRef.current.close()}
            aria-label="Đóng"
          >
            ✕
          </button>
        </header>

        {selectedPhoto ? (
          <img src={selectedPhoto.url} alt={selectedPhoto.title} className="photo-dialog__img" />
        ) : (
          <p>Ảnh với mã "{selectedPhotoId}" không tồn tại.</p>
        )}
      </dialog>
    </main>
  );
}
