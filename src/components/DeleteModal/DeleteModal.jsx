import { X } from "lucide-react";
import "./DeleteModal.css";

export default function DeleteModal({ code, onCancel, onConfirm }) {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-card">

        <div className="delete-modal-header">
          <h2 className="delete-modal-title">Delete Short Link</h2>
          <button onClick={onCancel} className="delete-modal-close">
            <X />
          </button>
        </div>

        <div className="delete-modal-body">
          <p className="delete-question">
            Are you sure you want to delete this link?
          </p>

          <span className="delete-code-pill">{code}</span>
        </div>

        <div className="delete-modal-footer">
          <button className="delete-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="delete-confirm-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}
