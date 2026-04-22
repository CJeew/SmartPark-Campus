import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    <span className="w-5 h-5 flex-shrink-0">{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {badge != null && badge > 0 && (
      <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
        {badge}
      </span>
    )}
  </button>
);

const Icons = {
  dashboard: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  users:     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  zone:      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  bookings:  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  logout:    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
};

const MOCK_ZONES = [
  { id: 1, name: 'Zone A', label: 'Faculty & Staff', location: 'Main Building – North Side', totalSlots: 40, availableSlots: 14, vehicleTypes: ['CAR'],                     status: 'ACTIVE' },
  { id: 2, name: 'Zone B', label: 'Students',        location: 'Engineering Block – East',  totalSlots: 80, availableSlots: 32, vehicleTypes: ['CAR', 'BIKE'],             status: 'ACTIVE' },
  { id: 3, name: 'Zone C', label: 'Visitors',        location: 'Main Gate – Guest Parking', totalSlots: 20, availableSlots: 7,  vehicleTypes: ['CAR', 'THREE_WHEELER'],    status: 'ACTIVE' },
  { id: 4, name: 'Zone D', label: 'Two-Wheelers',    location: 'Library – South Entrance',  totalSlots: 60, availableSlots: 28, vehicleTypes: ['BIKE'],                    status: 'ACTIVE' },
  { id: 5, name: 'Zone E', label: 'Mixed',           location: 'Sports Complex – West',     totalSlots: 50, availableSlots: 0,  vehicleTypes: ['CAR', 'BIKE', 'THREE_WHEELER'], status: 'INACTIVE' },
  { id: 6, name: 'Zone F', label: 'Admin Block',     location: 'Admin Building – Basement', totalSlots: 30, availableSlots: 11, vehicleTypes: ['CAR'],                     status: 'ACTIVE' },
];

const vehicleLabel = (v) =>
  v === 'CAR' ? '🚗 Car' : v === 'BIKE' ? '🏍️ Bike' : '🛺 3-Wheeler';

const AdminParkingZones = () => {
  const navigate = useNavigate();
  const admin    = adminService.getAdmin();
  const [zones, setZones]           = useState(MOCK_ZONES);
  const [search, setSearch]         = useState('');
  const [statusFilter, setFilter]   = useState('ALL');
  const [editZone, setEditZone]     = useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [newZone, setNewZone]       = useState({ name: '', label: '', location: '', totalSlots: '' });

  const handleLogout = () => { adminService.logout(); navigate('/admin/login'); };

  const filtered = zones.filter(z => {
    const q = search.toLowerCase();
    const matchSearch = !q || z.name.toLowerCase().includes(q) || z.label.toLowerCase().includes(q) || z.location.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || z.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleToggleStatus = (id) => {
    setZones(prev => prev.map(z =>
      z.id === id ? { ...z, status: z.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : z
    ));
  };

  const handleSaveEdit = () => {
    setZones(prev => prev.map(z => z.id === editZone.id ? editZone : z));
    setEditZone(null);
  };

  const handleAddZone = () => {
    if (!newZone.name || !newZone.totalSlots) return;
    setZones(prev => [...prev, {
      id: Date.now(),
      name: newZone.name,
      label: newZone.label,
      location: newZone.location,
      totalSlots: Number(newZone.totalSlots),
      availableSlots: Number(newZone.totalSlots),
      vehicleTypes: ['CAR'],
      status: 'ACTIVE',
    }]);
    setNewZone({ name: '', label: '', location: '', totalSlots: '' });
    setShowAdd(false);
  };

  const activeCount   = zones.filter(z => z.status === 'ACTIVE').length;
  const totalSlots    = zones.reduce((s, z) => s + z.totalSlots, 0);
  const totalAvail    = zones.reduce((s, z) => s + z.availableSlots, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-gray-700/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm font-bold">S</div>
            <div>
              <h1 className="text-base font-bold leading-tight">SmartPark</h1>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <NavItem icon={Icons.dashboard} label="Dashboard"     onClick={() => navigate('/admin/dashboard')} />
          <NavItem icon={Icons.users}     label="Users"         onClick={() => navigate('/admin/users')} />
          <NavItem icon={Icons.zone}      label="Parking Zones" active />
          <NavItem icon={Icons.bookings}  label="Bookings"      onClick={() => navigate('/admin/bookings')} />
        </nav>

        <div className="px-3 py-4 border-t border-gray-700/60">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              {admin?.fullName?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin?.fullName ?? 'Admin'}</p>
              <p className="text-xs text-gray-400 truncate">{admin?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            {Icons.logout} Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">

        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Parking Zones</h2>
            <p className="text-xs text-gray-400 mt-0.5">{zones.length} zones · {activeCount} active</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Zone
          </button>
        </header>

        <div className="px-8 py-6 space-y-5">

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Zones',      value: zones.length, color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { label: 'Total Slots',      value: totalSlots,   color: 'bg-gray-50 border-gray-200 text-gray-700' },
              { label: 'Available Slots',  value: totalAvail,   color: 'bg-green-50 border-green-200 text-green-700' },
            ].map(c => (
              <div key={c.label} className={`rounded-xl border p-5 ${c.color}`}>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{c.label}</p>
                <p className="text-3xl font-bold mt-1">{c.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search zones…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <span className="text-xs text-gray-400 ml-auto">{filtered.length} of {zones.length}</span>
          </div>

          {/* Zones table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-3">Zone</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Slots</th>
                    <th className="px-6 py-3">Availability</th>
                    <th className="px-6 py-3">Vehicle Types</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-gray-400 text-sm">No zones match your search.</td>
                    </tr>
                  ) : filtered.map(zone => {
                    const pct = Math.round((zone.availableSlots / zone.totalSlots) * 100);
                    return (
                      <tr key={zone.id} className={`transition-colors ${zone.status === 'INACTIVE' ? 'bg-gray-50/60' : 'hover:bg-gray-50/50'}`}>
                        <td className="px-6 py-3.5">
                          <p className="font-semibold text-gray-800">{zone.name}</p>
                          <p className="text-xs text-gray-400">{zone.label}</p>
                        </td>
                        <td className="px-6 py-3.5 text-gray-600 text-xs">{zone.location}</td>
                        <td className="px-6 py-3.5 text-gray-700 font-medium">{zone.totalSlots}</td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${pct === 0 ? 'bg-red-400' : pct < 30 ? 'bg-orange-400' : 'bg-green-500'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{zone.availableSlots}/{zone.totalSlots}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {zone.vehicleTypes.map(v => (
                              <span key={v} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                {vehicleLabel(v)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            zone.status === 'ACTIVE'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${zone.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {zone.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditZone({ ...zone })}
                              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleStatus(zone.id)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                zone.status === 'ACTIVE'
                                  ? 'text-red-600 bg-red-50 hover:bg-red-100 border-red-100'
                                  : 'text-green-700 bg-green-50 hover:bg-green-100 border-green-100'
                              }`}
                            >
                              {zone.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* ── Edit modal ── */}
      {editZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Edit {editZone.name}</h3>
            <div className="space-y-3">
              {[
                { label: 'Zone Name',  key: 'name' },
                { label: 'Label',      key: 'label' },
                { label: 'Location',   key: 'location' },
                { label: 'Total Slots', key: 'totalSlots', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={editZone[f.key]}
                    onChange={e => setEditZone(z => ({ ...z, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditZone(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveEdit} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add zone modal ── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Zone</h3>
            <div className="space-y-3">
              {[
                { label: 'Zone Name',   key: 'name' },
                { label: 'Label',       key: 'label' },
                { label: 'Location',    key: 'location' },
                { label: 'Total Slots', key: 'totalSlots', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={newZone[f.key]}
                    onChange={e => setNewZone(z => ({ ...z, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={f.label}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAddZone} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">Add Zone</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminParkingZones;
