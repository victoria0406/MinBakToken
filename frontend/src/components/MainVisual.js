import React from "react";
import { Link } from 'react-router-dom';

export function MainVisual() {

  return (
    <div className="main-visual">
      <p>Catch Prise!!!</p>
      <Link to="/upload">
        <button>
          Add New Reciept
        </button>
      </Link>

    </div>
  );
}
