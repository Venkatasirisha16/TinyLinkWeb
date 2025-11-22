import { useState, useEffect } from "react";
import {
  Trash2,
  BarChart3,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import "./GetAllLinks.css";

import { getAllLinks, deleteLink } from "../../Utils/Api";
import DeleteModal from "../DeleteModal/DeleteModal"; 
import Stats from "../Stats/Stats";

function GetAllLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState(null);
  const [deleteCode, setDeleteCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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

  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.code.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query)
    );
  });

  const sortedLinks = [...filteredLinks].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.code.localeCompare(b.code);
      case "clicks-high":
        return b.clicks - a.clicks;
      case "clicks-low":
        return a.clicks - b.clicks;
      case "lastclick-recent":
        if (!a.lastClicked) return 1;
        if (!b.lastClicked) return -1;
        return new Date(b.lastClicked) - new Date(a.lastClicked);
      case "lastclick-oldest":
        if (!a.lastClicked) return 1;
        if (!b.lastClicked) return -1;
        return new Date(a.lastClicked) - new Date(b.lastClicked);
      case "newest":
      default:
        return 0; 
    }
  });

  return (
    <div className="animate-fade-in">
      <div className="card">

        <div className="links-header">
          <div>
            <h2 className="title-main">All Short Links</h2>
            <p className="links-count">
              {sortedLinks.length} of {links.length} {links.length === 1 ? "link" : "links"}
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

        <div className="search-filter-section">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by code or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-box">
            <Filter className="filter-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
              <option value="clicks-high">Most Clicks</option>
              <option value="clicks-low">Least Clicks</option>
              <option value="lastclick-recent">Recently Clicked</option>
              <option value="lastclick-oldest">Oldest Click</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="table-loader"><div className="loader-spinner" /></div>
        ) : sortedLinks.length === 0 ? (
          <div className="table-no-links">
            <ExternalLink className="table-no-svg" />
            <p>{searchQuery ? "No links match your search" : "No links found"}</p>
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
                {sortedLinks.map((item, index) => (
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
                        href={`${import.meta.env.VITE_REACT_APP_BASE_URL}/${item.code}`}
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