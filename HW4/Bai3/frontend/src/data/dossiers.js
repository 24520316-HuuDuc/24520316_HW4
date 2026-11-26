// Dữ liệu mẫu hồ sơ kháng cáo của 2 thành viên.
// Hạn kháng cáo tính từ lúc tải trang (demo).
const HOUR = 3600 * 1000;

const DOSSIERS = {
  Himass: {
    player: 'Himass',
    appealDeadline: Date.now() + 48 * HOUR,
    violations: [
      { id: 'V1', offense: 'Ngôn từ không phù hợp', severity: 1, penaltyDays: 3 },
      { id: 'V2', offense: 'Cố tình bỏ trận (AFK)', severity: 2, penaltyDays: 14 },
      { id: 'V3', offense: 'Lợi dụng lỗi game', severity: 3, penaltyDays: 7 },
    ],
  },
  TanVuu: {
    player: 'TanVuu',
    appealDeadline: Date.now() + 5 * HOUR,
    violations: [
      { id: 'V1', offense: 'Spam chat', severity: 1, penaltyDays: 1 },
      { id: 'V2', offense: 'Dùng phần mềm thứ ba', severity: 5, penaltyDays: 30 },
    ],
  },
};

export default DOSSIERS;
