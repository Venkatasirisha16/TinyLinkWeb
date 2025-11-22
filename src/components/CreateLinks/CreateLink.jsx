import { useState } from "react";
import { Link2, Copy, Check, Sparkles } from "lucide-react";
import { createShortLink } from "../../Utils/Api";
import "./CreateLink.css";

export default function CreateLink() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setResult("");
    setError("");
    setShortUrl("");
    setCopied(false);
    setLoading(true);

    if (!url) {
      setError("URL is required");
      setLoading(false);
      return;
    }

    try {
      const payload = { url };
      if (code) payload.code = code;

      const res = await createShortLink(payload);

      const finalCode = res.data.code;
      const generated = `${import.meta.env.VITE_REACT_APP_BASE_URL}/url/${finalCode}`;

      setShortUrl(generated);
      setResult("Short URL created successfully!");
      setUrl("");
      setCode("");
    } catch (err) {
      setError(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="create-container">
      <div className="create-card">
        <div className="header">
          <div className="icon-box">
            <Sparkles className="white-icon" />
          </div>
          <h2>Create Short Link</h2>
        </div>

        <div className="form">
          <div className="input-group">
            <label>
              <Link2 className="label-icon" />
              Enter URL
            </label>
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input"
            />
          </div>

          <div className="input-group">
            <label>
              Custom Short Code <span className="optional">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="my-custom-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className={`btn-create ${loading ? "btn-disabled" : ""}`}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating...
              </>
            ) : (
              <>
                <Link2 />
                Create Short URL
              </>
            )}
          </button>

          {result && (
            <div className="success-box">
              <p>
                <Check />
                {result}
              </p>
            </div>
          )}

          {shortUrl && (
            <div className="short-url-box">
              <p>Your shortened URL:</p>
              <div className="short-url-row">
                <input type="text" readOnly value={shortUrl} className="short-url-input" />
                <button className="copy-btn" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <Check /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="error-box">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
