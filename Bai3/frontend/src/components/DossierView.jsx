import { useMemo } from 'react';
import DOSSIERS from '../data/dossiers';
import computeMatrix, { VERDICT } from '../utils/computeMatrix';
import SlaCountdown from './SlaCountdown';

const verdictClass = {
  [VERDICT.OVER]: 'verdict--over',
  [VERDICT.UNDER]: 'verdict--under',
  [VERDICT.FAIR]: 'verdict--fair',
};

export default function DossierView({ user }) {
  const dossierData = DOSSIERS[user];

  // Disproportionality Derived Matrix computation during render
  // Không lưu vào state → không bị lệch dữ liệu; useMemo chỉ tính lại khi dossierData đổi
  const matrix = useMemo(() => computeMatrix(dossierData), [dossierData]);

  return (
    <section className="dossier">
      <h2 className="dossier__title">Hồ sơ: {dossierData.player}</h2>
      <SlaCountdown deadline={dossierData.appealDeadline} />

      <div className="table-wrap">
        <table className="matrix">
          <caption>Ma trận mức độ tương xứng của hình phạt</caption>
          <thead>
            <tr>
              <th scope="col">Mã</th>
              <th scope="col">Vi phạm</th>
              <th scope="col">Mức độ</th>
              <th scope="col">Phạt thực tế</th>
              <th scope="col">Phạt chuẩn</th>
              <th scope="col">Tỷ lệ</th>
              <th scope="col">Đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.offense}</td>
                <td>{r.severity}</td>
                <td>{r.penaltyDays} ngày</td>
                <td>{r.expected} ngày</td>
                <td>{r.ratio.toFixed(2)}×</td>
                <td className={`verdict ${verdictClass[r.verdict]}`}>{r.verdict}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={3}>Tổng</th>
              <td>{matrix.totalActual} ngày</td>
              <td>{matrix.totalExpected} ngày</td>
              <td>{matrix.overallRatio.toFixed(2)}×</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="dossier__conclusion">
        Kết luận:{' '}
        <strong>{matrix.appealable ? 'Đủ cơ sở kháng cáo ✅' : 'Không đủ cơ sở kháng cáo'}</strong>
      </p>
    </section>
  );
}
