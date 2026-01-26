/**
 * Layout Component
 * 
 * Split-screen layout:
 * - Left: Visual simulation scene
 * - Right: Technical dashboard
 */

import React from 'react';

interface LayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ leftPanel, rightPanel }) => {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Panel - Visual Scene */}
      <div className="w-1/2 border-r border-gray-700 overflow-hidden">
        {leftPanel}
      </div>

      {/* Right Panel - Dashboard */}
      <div className="w-1/2 overflow-y-auto">
        {rightPanel}
      </div>
    </div>
  );
};