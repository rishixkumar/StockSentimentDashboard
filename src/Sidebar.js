import React from 'react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.svg" alt="Logo" />
      </div>
      <div className="sidebar-title">Stock Sentiment</div>
      {/* Future nav items can go here */}
    </aside>
  );
}
