/**
 * BÀI 3 — useAppealSlaTimer.js
 * High-precision countdown hook with zero tab-drift using Page Visibility API.
 *
 * Không đếm kiểu "trừ 1 mỗi giây" (bị trôi khi tab ẩn vì trình duyệt throttle setInterval).
 * Luôn tính lại theo đồng hồ tuyệt đối:
 *     remaining = deadline - (Date.now() + serverOffset)
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useAppealSlaTimer(deadlineMs, { syncUrl = null } = {}) {
  // Độ lệch giữa đồng hồ server và client (ms)
  const offsetRef = useRef(0);
  const [remaining, setRemaining] = useState(() => Math.max(0, deadlineMs - Date.now()));

  const tick = useCallback(() => {
    const now = Date.now() + offsetRef.current;
    setRemaining(Math.max(0, deadlineMs - now));
  }, [deadlineMs]);

  // Đồng bộ với giờ server (nếu có endpoint), rồi tính lại ngay
  const resyncTimerWithServer = useCallback(async () => {
    if (syncUrl) {
      try {
        const t0 = Date.now();
        const res = await fetch(syncUrl);
        const { now: serverNow } = await res.json(); // server trả { now: <epoch ms> }
        const t1 = Date.now();
        // Bù nửa thời gian round-trip
        offsetRef.current = serverNow + (t1 - t0) / 2 - t1;
      } catch {
        // Không gọi được server → dùng đồng hồ máy
      }
    }
    tick();
  }, [syncUrl, tick]);

  useEffect(() => {
    resyncTimerWithServer();
    const id = setInterval(tick, 250); // nhanh hơn 1s để số giây không bị "nhảy cóc"

    // Khi tab hiện lại → đồng bộ lại ngay
    const onVisibility = () => {
      if (document.visibilityState === 'visible') resyncTimerWithServer();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [tick, resyncTimerWithServer]);

  const totalSec = Math.floor(remaining / 1000);
  return {
    remaining,
    expired: remaining <= 0,
    hours: Math.floor(totalSec / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}
