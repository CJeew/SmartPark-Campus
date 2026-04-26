import React, { useState } from 'react';
import '../../styles/SlotSelector3D.css';

const SLOTS_PER_ROW = 5;

const SlotSelector3D = ({ zones, onSlotSelect }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedZone, setSelectedZone] = useState(zones[0]?.id || null);

  const currentZone = zones.find(z => z.id === selectedZone);
  const slots = currentZone?.slots || [];

  const rows = [];
  for (let i = 0; i < slots.length; i += SLOTS_PER_ROW) {
    rows.push(slots.slice(i, i + SLOTS_PER_ROW));
  }

  const handleSlotClick = (slot) => {
    if (!slot.isAvailable) return;
    setSelectedSlot(slot);
    onSlotSelect(slot);
  };

  const getSlotClass = (slot) => {
    if (selectedSlot?.id === slot.id) return 'slot selected';
    if (!slot.isAvailable) return 'slot occupied';
    return 'slot available';
  };

  const vehicleIcon = (type) => {
    if (!type) return '🚗';
    const t = type.toUpperCase();
    if (t.includes('BIKE') || t.includes('MOTORCYCLE')) return '🏍️';
    if (t.includes('TRUCK') || t.includes('VAN')) return '🚐';
    return '🚗';
  };

  return (
    <div className="slot-selector-2d">
      <div className="slot-selector-header">
        <h3>Slot Selection</h3>
        <select
          value={selectedZone || ''}
          onChange={(e) => {
            setSelectedZone(Number(e.target.value));
            setSelectedSlot(null);
          }}
          className="zone-selector"
        >
          {zones.map(zone => (
            <option key={zone.id} value={zone.id}>{zone.name}</option>
          ))}
        </select>
      </div>

      <div className="parking-lot">
        <div className="lot-entrance">
          <span>ENTRANCE / EXIT</span>
        </div>

        {rows.length === 0 ? (
          <div className="no-slots">No slots available for this zone.</div>
        ) : (
          rows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div className="parking-row">
                {row.map(slot => (
                  <div
                    key={slot.id}
                    className={getSlotClass(slot)}
                    onClick={() => handleSlotClick(slot)}
                    title={slot.isAvailable ? `Click to select ${slot.slotNumber}` : `${slot.slotNumber} — Occupied`}
                  >
                    <span className="slot-icon">{vehicleIcon(slot.vehicleType)}</span>
                    <span className="slot-number">{slot.slotNumber}</span>
                    <span className="slot-type">{slot.vehicleType}</span>
                  </div>
                ))}
              </div>
              {rowIndex < rows.length - 1 && (
                <div className="driving-lane">
                  <span>◀ LANE ▶</span>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      <div className="slot-legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color occupied"></div>
          <span>Occupied</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Selected</span>
        </div>
      </div>

      {selectedSlot && (
        <div className="selected-slot-info">
          <div>
            <h4>Selected: {selectedSlot.slotNumber}</h4>
            <p>Vehicle Type: {selectedSlot.vehicleType}</p>
          </div>
          <button
            onClick={() => { setSelectedSlot(null); onSlotSelect(null); }}
            className="clear-selection"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default SlotSelector3D;
