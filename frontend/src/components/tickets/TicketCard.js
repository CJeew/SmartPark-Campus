import React from 'react';
import Button from '../Button';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import TagBadge from './TagBadge';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

const TicketCard = ({ ticket, onViewDetails }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-base font-semibold text-gray-900">{ticket.title}</div>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <TagBadge tag={ticket.tag} />
          </div>

          <div className="mt-2 max-h-10 overflow-hidden text-sm text-gray-600">{ticket.description}</div>

          <div className="mt-3 text-xs text-gray-500">
            Submitted {ticket.createdAt ? formatDate(ticket.createdAt) : '—'}
          </div>
        </div>

        <div className="shrink-0">
          <Button variant="secondary" size="sm" onClick={onViewDetails}>View Details</Button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;

