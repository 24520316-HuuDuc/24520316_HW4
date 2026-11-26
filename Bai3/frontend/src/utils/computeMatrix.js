/**
 * Disproportionality Derived Matrix
 *
 * ratio = số ngày phạt thực tế / số ngày phạt chuẩn theo mức độ vi phạm
 *   ratio > 1.5  → Phạt quá nặng (có cơ sở kháng cáo)
 *   ratio < 0.67 → Phạt quá nhẹ
 *   còn lại      → Tương xứng
 */

// Số ngày phạt chuẩn cho từng mức độ nghiêm trọng (1–5)
export const BASELINE_DAYS = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };

export const VERDICT = {
  OVER: 'Phạt quá nặng',
  UNDER: 'Phạt quá nhẹ',
  FAIR: 'Tương xứng',
};

export default function computeMatrix(dossierData) {
  const rows = dossierData.violations.map((v) => {
    const expected = BASELINE_DAYS[v.severity];
    const ratio = v.penaltyDays / expected;

    let verdict = VERDICT.FAIR;
    if (ratio > 1.5) verdict = VERDICT.OVER;
    else if (ratio < 0.67) verdict = VERDICT.UNDER;

    return { ...v, expected, ratio, verdict };
  });

  const totalActual = rows.reduce((a, r) => a + r.penaltyDays, 0);
  const totalExpected = rows.reduce((a, r) => a + r.expected, 0);

  return {
    rows,
    totalActual,
    totalExpected,
    overallRatio: totalExpected ? totalActual / totalExpected : 0,
    appealable: rows.some((r) => r.verdict === VERDICT.OVER),
  };
}
