/**
 * BÀI 3 — FairPlayAppealPortal.jsx
 *  - Multi-Route Dossiers cho Himass & TanVuu
 *  - Disproportionality Derived Matrix (trong DossierView)
 *  - Zero-Drift Appeal SLA Countdown (hooks/useAppealSlaTimer.js)
 */
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import DossierView from './DossierView';

export default function FairPlayAppealPortal() {
  return (
    <div className="portal">
      <h1 className="portal__title">FairPlay Appeal Portal</h1>

      <nav className="portal__nav" aria-label="Hồ sơ thành viên">
        <NavLink to="/dossier/himass" className="portal__link">Himass</NavLink>
        <NavLink to="/dossier/tanvuu" className="portal__link">TanVuu</NavLink>
      </nav>

      {/* Multi-Route Dossier routing for team members Himass & TanVuu */}
      <Routes>
        <Route path="/dossier/himass" element={<DossierView user="Himass" />} />
        <Route path="/dossier/tanvuu" element={<DossierView user="TanVuu" />} />
        <Route path="*" element={<Navigate to="/dossier/himass" replace />} />
      </Routes>
    </div>
  );
}
