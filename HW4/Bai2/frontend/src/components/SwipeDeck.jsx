/**
 * BÀI 2 (Frontend) — SwipeDeck.jsx
 * "Hẹn Hò Nhưng Không Yêu" Edition
 *  - Pointer / Keyboard ArrowLeft / ArrowRight / ArrowUp / Backspace handlers
 *  - LIFO Undo Stack
 *  - Asymmetric Score Derived State (LIKE +10, còn lại -5)
 */
import { useEffect, useRef, useState } from 'react';

const SWIPE_THRESHOLD = 50;

// direction → loại hành động
const DIRECTION_TO_TYPE = {
  right: 'LIKE',
  left: 'NOPE',
  up: 'SUPERLIKE',
};

export default function SwipeDeck() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- LIFO Undo Stack Implementation ----
  const [history, setHistory] = useState([]);

  const deckRef = useRef(null);

  // Lấy danh sách profile từ backend (Vite proxy /api → http://localhost:5000)
  useEffect(() => {
    fetch('/api/profiles')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setProfiles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Focus vào deck để nhận phím ngay khi tải xong
  useEffect(() => {
    if (!loading) deckRef.current?.focus();
  }, [loading]);

  // Derived state: thẻ hiện tại = số lần đã swipe
  const currentIndex = history.length;
  const currentProfile = profiles[currentIndex];

  const swipe = (direction) => {
    if (!currentProfile) return;
    const action = {
      type: DIRECTION_TO_TYPE[direction],
      direction,
      profileId: currentProfile._id,
    };
    // push lên đỉnh stack
    setHistory((prev) => [...prev, action]);

    // Ghi nhận lên server (không chặn UI)
    fetch('/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action),
    }).catch(() => {});
  };

  // pop phần tử trên cùng (LIFO)
  const undoLastSwipe = () => {
    setHistory((prev) => prev.slice(0, -1));
  };

  // ---- Asymmetric Score Derived State ----
  // Không lưu score bằng useState → tự tính lại mỗi lần render, undo tự đúng.
  const score = history.reduce((acc, action) => {
    if (action.type === 'LIKE') {
      return acc + 10;
    } else {
      return acc - 5;
    }
  }, 0);

  // ---- Keyboard Navigation Mapping ----
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') swipe('left');
    if (e.key === 'ArrowRight') swipe('right');
    if (e.key === 'ArrowUp') {
      e.preventDefault(); // tránh cuộn trang
      swipe('up');
    }
    if (e.key === 'Backspace') {
      e.preventDefault(); // tránh trình duyệt quay lại trang trước
      undoLastSwipe();
    }
  };

  // ---- Pointer Event Gesture Tracking ----
  const [startPos, setStartPos] = useState(null);
  const [drag, setDrag] = useState({ dx: 0, dy: 0 });

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!startPos) return;
    setDrag({ dx: e.clientX - startPos.x, dy: e.clientY - startPos.y });
  };

  const resetDrag = () => {
    setStartPos(null);
    setDrag({ dx: 0, dy: 0 });
  };

  const handlePointerUp = (e) => {
    if (!startPos) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    if (dy < -SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) swipe('up');
    else if (dx > SWIPE_THRESHOLD) swipe('right');
    else if (dx < -SWIPE_THRESHOLD) swipe('left');

    resetDrag();
  };

  if (loading) return <p className="status">Đang tải…</p>;
  if (error)
    return (
      <p className="status">
        Lỗi tải dữ liệu: {error}. Kiểm tra backend đã chạy ở cổng 5000 chưa.
      </p>
    );

  const last = history[history.length - 1];

  // Nhãn gợi ý khi đang kéo
  const hint =
    drag.dy < -SWIPE_THRESHOLD && Math.abs(drag.dy) > Math.abs(drag.dx)
      ? 'SUPERLIKE'
      : drag.dx > SWIPE_THRESHOLD
        ? 'LIKE'
        : drag.dx < -SWIPE_THRESHOLD
          ? 'NOPE'
          : null;

  return (
    <div
      ref={deckRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="deck"
      aria-label="Bộ thẻ hẹn hò. Mũi tên trái: bỏ qua, phải: thích, lên: siêu thích, Backspace: hoàn tác"
    >
      <h1 className="deck__title">Hẹn Hò Nhưng Không Yêu 💔</h1>
      <p className="deck__score" aria-live="polite">
        Điểm: <strong>{score}</strong> · Đã swipe: {history.length}/{profiles.length}
      </p>

      {currentProfile ? (
        <div
          className={`card ${startPos ? 'card--dragging' : ''}`}
          style={{
            transform: `translate(${drag.dx}px, ${drag.dy}px) rotate(${drag.dx / 15}deg)`,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={resetDrag}
        >
          {hint && <span className={`card__badge card__badge--${hint.toLowerCase()}`}>{hint}</span>}
          <img src={currentProfile.photo} alt="" className="card__photo" draggable={false} />
          <h2 className="card__name">
            {currentProfile.name}, {currentProfile.age}
          </h2>
          <p className="card__bio">{currentProfile.bio}</p>
        </div>
      ) : (
        <div className="card card--empty">
          <h2>Hết người rồi 🎉</h2>
          <p>Tổng điểm: {score}</p>
        </div>
      )}

      <div className="deck__actions">
        <button className="btn btn--nope" onClick={() => swipe('left')} disabled={!currentProfile}>
          ✕ Bỏ qua (←)
        </button>
        <button className="btn" onClick={undoLastSwipe} disabled={!history.length}>
          ↺ Hoàn tác (⌫)
        </button>
        <button className="btn btn--super" onClick={() => swipe('up')} disabled={!currentProfile}>
          ★ Siêu thích (↑)
        </button>
        <button className="btn btn--like" onClick={() => swipe('right')} disabled={!currentProfile}>
          ♥ Thích (→)
        </button>
      </div>

      {last && <p className="deck__last">Hành động cuối: {last.type}</p>}
    </div>
  );
}
