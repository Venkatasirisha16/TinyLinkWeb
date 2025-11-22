import { useState, useEffect } from "react";
import {
  ExternalLink,
  X,
  MousePointer,
  Clock,
  Activity,
} from "lucide-react";

import { getStats, getHealth } from "../../Utils/Api";
import "../GetAllLinks/GetAllLinks.css";

export default function Stats({ code, onClose }) {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState("Checking...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await getStats(code);
        setStats(res.data);

        try {
          const healthRes = await getHealth(res.data.url);
          setHealth(
            healthRes.data.status === 200 ? "Reachable" : "Unreachable"
          );
        } catch {
          setHealth("Unreachable");
        }
      } catch {
        setHealth("Unreachable");
      }
      setLoading(false);
    };

    loadStats();
  }, [code]);

  return (
    <div className="fixed-modal">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Link Statistics</h2>
            <code className="modal-code">{code}</code>
          </div>

          <button onClick={onClose} className="modal-close-btn">
            <X className="modal-close-icon" />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="modal-loader">
              <div className="modal-spinner" />
            </div>
          ) : stats ? (
            <div className="modal-stats-flex">
              <div className="modal-section">
                <div className="modal-label-flex">
                  <ExternalLink className="icon-purple" />
                  <p className="modal-label-title">Original URL</p>
                </div>

                <a
                  href={stats.url}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-url-link"
                >
                  {stats.url}
                </a>
              </div>

              <div className="modal-grid">
                <div className="modal-section modal-bg-purple">
                  <div className="modal-label-flex">
                    <MousePointer className="icon-darkpurple" />
                    <p className="modal-label-small">Total Clicks</p>
                  </div>
                  <p className="modal-clicks">{stats.clicks}</p>
                </div>

                <div className="modal-section">
                  <div className="modal-label-flex">
                    <Activity className="modal-activity-icon" />
                    <p className="modal-label-small">Health Status</p>
                  </div>

                  <span
                    className={`modal-health ${
                      health === "Reachable"
                        ? "modal-health-success"
                        : "modal-health-error"
                    }`}
                  >
                    {health}
                  </span>
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-label-flex">
                  <Clock className="modal-label-icon" />
                  <p className="modal-label-title">Last Clicked</p>
                </div>

                <p className="modal-last-clicked">
                  {stats.lastClicked
                    ? new Date(stats.lastClicked).toLocaleString()
                    : "Never clicked"}
                </p>
              </div>
            </div>
          ) : (
            <p>No data found</p>
          )}
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="modal-close-btn-footer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
