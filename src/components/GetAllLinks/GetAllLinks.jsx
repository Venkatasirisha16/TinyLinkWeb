import { useState, useEffect } from "react";
import {
  Trash2,
  BarChart3,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import "./GETAllLinks.css";

import { getAllLinks, deleteLink } from "../../Utils/Api";
import DeleteModal from "../DeleteModal/DeleteModal"; 
import Stats from "../Stats/Stats";

function GetAllLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState(null);
  const [deleteCode, setDeleteCode] = useState(null); 

  const loadLinks = async () => {
    setLoading(true);
    try {
      const res = await getAllLinks();
      setLinks(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const confirmDelete = async () => {
    try {
      await deleteLink(deleteCode);
      setLinks((prev) => prev.filter((item) => item.code !== deleteCode));
      setDeleteCode(null);
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="card">

        <div className="links-header">
          <div>
            <h2 className="title-main">All Short Links</h2>
            <p className="links-count">
              {links.length} {links.length === 1 ? "link" : "links"} created
            </p>
          </div>

          <button
            onClick={loadLinks}
            disabled={loading}
            className={`refresh-btn ${loading ? "btn-loading" : ""}`}
          >
            <RefreshCw className={`refresh-icon ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="table-loader"><div className="loader-spinner" /></div>
        ) : links.length === 0 ? (
          <div className="table-no-links">
            <ExternalLink className="table-no-svg" />
            <p>No links found</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="shorturl-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Original URL</th>
                  <th>Short URL</th>
                  <th>Short Code</th>
                  <th>Clicks</th>
                  <th>Last Click</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {links.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>
                      <a href={item.url} target="_blank" rel="noreferrer" className="table-link-url">
                        {item.url}
                        <ExternalLink className="table-link-icon" />
                      </a>
                    </td>

                    <td>
                      <a
                        href={`https://tiny-link-bay-kappa.vercel.app/api/links/url/${item.code}`}
                        target="_blank"
                        rel="noreferrer"
                        className="table-link-short"
                      >
                        tiny-link/.../{item.code}
                        <ExternalLink className="table-link-shorticon" />
                      </a>
                    </td>

                    <td><code className="table-code">{item.code}</code></td>

                    <td><span className="table-clicks">{item.clicks}</span></td>

                    <td>{item.lastClicked ? new Date(item.lastClicked).toLocaleDateString() : "—"}</td>

                    <td>
                      <div className="table-actions">
                        <button className="action-stats-btn" onClick={() => setSelectedCode(item.code)}>
                          <BarChart3 />
                        </button>

                        <button className="action-delete-btn" onClick={() => setDeleteCode(item.code)}>
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {selectedCode && <Stats code={selectedCode} onClose={() => setSelectedCode(null)} />}

      {deleteCode && (
        <DeleteModal
          code={deleteCode}
          onCancel={() => setDeleteCode(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default GetAllLinks;
