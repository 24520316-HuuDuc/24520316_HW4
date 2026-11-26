import useAppealSlaTimer from '../hooks/useAppealSlaTimer';

const pad = (n) => String(n).padStart(2, '0');

export default function SlaCountdown({ deadline }) {
  // syncUrl: thay bằng endpoint thật nếu có, vd '/api/time' trả { now: Date.now() }
  const { hours, minutes, seconds, expired } = useAppealSlaTimer(deadline, { syncUrl: null });

  const level = expired ? 'expired' : hours < 6 ? 'warning' : 'ok';

  return (
    <div className={`sla sla--${level}`}>
      <span>Hạn kháng cáo (SLA): </span>
      <strong role="timer" aria-live="off">
        {expired ? 'ĐÃ HẾT HẠN' : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`}
      </strong>
    </div>
  );
}
