import React from 'react';

export const SkeletonCard = () => (
  <div className="card h-100 mb-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
    <div className="skeleton-v2" style={{ height: '180px', width: '100%', borderRadius: '12px 12px 0 0' }}></div>
    <div className="card-body p-4 d-flex flex-column gap-3">
      <div className="skeleton-v2" style={{ height: '12px', width: '30%' }}></div>
      <div className="skeleton-v2" style={{ height: '24px', width: '90%' }}></div>
      <div className="skeleton-v2" style={{ height: '16px', width: '70%' }}></div>
      <div className="mt-auto pt-4 d-flex gap-2">
        <div className="skeleton-v2" style={{ height: '36px', width: '100%', borderRadius: '8px' }}></div>
        <div className="skeleton-v2" style={{ height: '36px', width: '100%', borderRadius: '8px' }}></div>
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="table-responsive">
    <table className="table mb-0">
      <thead>
        <tr>
          {Array.from({ length: 4 }).map((_, i) => (
            <th key={i} className="py-3 px-4"><div className="skeleton-v2" style={{ height: '10px', width: '50%' }}></div></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: 4 }).map((_, j) => (
              <td key={j} className="px-4 py-4">
                <div className="skeleton-v2" style={{ height: '14px', width: j === 0 ? '70%' : '40%' }}></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SkeletonStatCard = () => (
  <div className="stat-card-v2 d-flex flex-column gap-2">
    <div className="skeleton-v2" style={{ height: '10px', width: '40%' }}></div>
    <div className="skeleton-v2" style={{ height: '32px', width: '25%' }}></div>
  </div>
);
