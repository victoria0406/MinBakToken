import React from "react";
import { Link } from 'react-router-dom';

export function MainVisual() {

  return (
    <div className="main-visual">
      <p>Share Your Club Receipts!</p>
      <Link to="/upload">
        <button>
          Add New Receipt
        </button>
      </Link>

    </div>
  );
}
