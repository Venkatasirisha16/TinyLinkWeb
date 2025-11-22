import { useState } from "react";
import { Link2, List } from "lucide-react";
import CreateLink from "./components/CreateLinks/CreateLink";
import GetAllLinks from "./components/GetAllLinks/GetAllLinks";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("create");

  return (
    <div className="app-bg">
      <div className="app-container">
        <div className="app-header animate-fade-in">
          <div className="app-title-icon-row">
            <div className="app-title-icon-bg">
              <Link2 className="app-title-icon" />
            </div>
          </div>
          <h1 className="app-title">
            Tiny<span className="app-title-highlight">URL</span>
          </h1>
          <p className="app-subtitle">
            Shorten your links, track your clicks, and share with confidence
          </p>
        </div>

        <div className="app-tab-row">
          <button
            onClick={() => setPage("create")}
            className={`app-tab-btn ${page === "create" ? "app-tab-active" : ""}`}
          >
            <Link2 className="app-tab-btn-icon" />
            Create Link
          </button>

          <button
            onClick={() => setPage("getall")}
            className={`app-tab-btn ${page === "getall" ? "app-tab-active" : ""}`}
          >
            <List className="app-tab-btn-icon" />
            All Links
          </button>
        </div>

        <div className="app-content">
          {page === "create" && <CreateLink />}
          {page === "getall" && <GetAllLinks />}
        </div>
      </div>
    </div>
  );
}