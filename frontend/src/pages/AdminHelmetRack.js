import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import AdminSidebar from '../components/AdminSidebar';

const statusCard = {
  AVAILABLE: 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200',
  OCCUPIED: 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200',
  FLAGGED: 'bg-red-100 border-red-300 text-red-900 hover:bg-red-200',
};

const actionLabel = {
  CHECK_IN: 'Checked In',
  CHECK_OUT: 'Checked Out',
  FLAGGED: 'Flagged',
  UNFLAGGED: 'Unflagged',
};

const AdminHelmetRack = () => {
  const navigate = useNavigate();

  const studentIdPattern = /^[A-Za-z0-9]+$/;
  const studentNamePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

  const [overview, setOverview] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [checkInForm, setCheckInForm] = useState({
    studentId: '',
    studentName: '',
    studentEmail: '',
    helmetTag: '',
  });
  const [checkOutStudentId, setCheckOutStudentId] = useState('');
  const [flagReason, setFlagReason] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadOverview = async () => {
    const data = await adminService.getHelmetRackOverview();
    setOverview(data);
  };

  const loadActivities = async (query = '') => {
    const data = await adminService.getHelmetRackActivities(query);
    setActivities(data);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      await Promise.all([loadOverview(), loadActivities(activitySearch)]);
    } catch (e) {
      showToast('Failed to load helmet rack module', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        await Promise.all([loadOverview(), loadActivities('')]);
      } catch (e) {
        showToast('Failed to load helmet rack module', 'error');
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const closeModal = () => {
    setSelectedSlot(null);
    setModalMode(null);
    setCheckInForm({ studentId: '', studentName: '', studentEmail: '', helmetTag: '' });
    setCheckOutStudentId('');
    setFlagReason('');
    setFormErrors({});
  };

  const openAction = (slot, mode) => {
    setSelectedSlot(slot);
    setModalMode(mode);
    setFormErrors({});
    if (mode === 'checkIn') {
      setCheckInForm({
        studentId: '',
        studentName: '',
        studentEmail: '',
        helmetTag: slot.slotCode,
      });
    }
  };

  const onSlotClick = (slot) => {
    if (slot.status === 'AVAILABLE') {
      openAction(slot, 'checkIn');
      return;
    }
    if (slot.status === 'OCCUPIED') {
      openAction(slot, 'checkOut');
      return;
    }
    if (slot.status === 'FLAGGED') {
      openAction(slot, 'resolveFlag');
    }
  };

  const submitCheckIn = async () => {
    if (!selectedSlot) return;
    const errors = {};

    if (!checkInForm.studentId.trim()) {
      errors.studentId = 'Student ID is required';
    } else if (!studentIdPattern.test(checkInForm.studentId.trim())) {
      errors.studentId = 'Student ID can only contain letters and numbers';
    }

    if (!checkInForm.studentName.trim()) {
      errors.studentName = 'Student Full Name is required';
    } else if (!studentNamePattern.test(checkInForm.studentName.trim())) {
      errors.studentName = 'Student Full Name can only contain English letters';
    }

    if (!checkInForm.helmetTag.trim()) {
      errors.helmetTag = 'Helmet Tag number is required';
    } else if (checkInForm.helmetTag.trim() !== selectedSlot.slotCode) {
      errors.helmetTag = `Helmet Tag number must match selected slot ${selectedSlot.slotCode}`;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Please fix the highlighted fields', 'error');
      return;
    }

    setBusy(true);
    try {
      await adminService.helmetCheckIn(selectedSlot.id, checkInForm);
      showToast('Helmet checked in');
      closeModal();
      await loadAll();
    } catch (e) {
      showToast('Check-in failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const submitCheckOut = async () => {
    if (!selectedSlot) return;
    if (!checkOutStudentId) {
      showToast('Enter Student ID for verification', 'error');
      return;
    }
    setBusy(true);
    try {
      await adminService.helmetCheckOut(selectedSlot.id, { studentId: checkOutStudentId });
      showToast('Helmet checked out');
      closeModal();
      await loadAll();
    } catch (e) {
      showToast('Check-out failed (verify student ID)', 'error');
    } finally {
      setBusy(false);
    }
  };

  const submitFlag = async () => {
    if (!selectedSlot) return;
    if (!flagReason) {
      showToast('Reason is required', 'error');
      return;
    }
    setBusy(true);
    try {
      await adminService.helmetFlag(selectedSlot.id, { reason: flagReason });
      showToast('Slot flagged');
      closeModal();
      await loadAll();
    } catch (e) {
      showToast('Flagging failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const submitUnflag = async () => {
    if (!selectedSlot) return;
    setBusy(true);
    try {
      await adminService.helmetUnflag(selectedSlot.id);
      showToast('Flag cleared');
      closeModal();
      await loadAll();
    } catch (e) {
      showToast('Could not clear flag', 'error');
    } finally {
      setBusy(false);
    }
  };

  const filteredSlots = useMemo(() => {
    const q = search.trim().toLowerCase();
    const slots = overview?.slots ?? [];
    if (!q) return slots;
    return slots.filter((slot) =>
      [slot.slotCode, slot.currentStudentId, slot.currentStudentName, slot.currentHelmetTag, slot.status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [overview, search]);

  const handleActivitySearch = async () => {
    try {
      await loadActivities(activitySearch);
    } catch (e) {
      showToast('Failed to search activity log', 'error');
    }
  };

  const renderModalBody = () => {
    if (!selectedSlot || !modalMode) return null;

    if (modalMode === 'checkIn') {
      return (
        <>
          <h3 className="text-lg font-semibold text-gray-800">Check In Helmet - {selectedSlot.slotCode}</h3>
          <div className="space-y-3 mt-4">
            <div>
            <input
              value={checkInForm.studentId}
              onChange={(e) => {
                const value = e.target.value;
                setCheckInForm({ 
                  ...checkInForm, 
                  studentId: value,
                  studentEmail: value ? `${value}@my.sliit.lk` : ''
                });
                setFormErrors((prev) => ({ ...prev, studentId: '' }));
              }}
              placeholder="Student ID"
              className={`w-full border rounded-lg px-3 py-2 ${formErrors.studentId ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.studentId && <p className="text-xs text-red-600 mt-1">{formErrors.studentId}</p>}
            </div>
            <div>
            <input
              value={checkInForm.studentName}
              onChange={(e) => {
                const value = e.target.value;
                setCheckInForm({ ...checkInForm, studentName: value });
                setFormErrors((prev) => ({ ...prev, studentName: '' }));
              }}
              placeholder="Student Full Name"
              className={`w-full border rounded-lg px-3 py-2 ${formErrors.studentName ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.studentName && <p className="text-xs text-red-600 mt-1">{formErrors.studentName}</p>}
            </div>
            <div>
            <input
              value={checkInForm.studentEmail}
              readOnly
              placeholder="Student Email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
            <p className="text-[11px] text-gray-500 mt-1">Auto-filled based on Student ID.</p>
            </div>
            <div>
            <input
              value={checkInForm.helmetTag}
              readOnly
              placeholder="Helmet Tag Number"
              className={`w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed ${formErrors.helmetTag ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.helmetTag && <p className="text-xs text-red-600 mt-1">{formErrors.helmetTag}</p>}
            <p className="text-[11px] text-gray-500 mt-1">This field is auto-filled from the selected slot.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button onClick={closeModal} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button onClick={submitCheckIn} disabled={busy} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm disabled:opacity-50">Confirm Check-In</button>
          </div>
        </>
      );
    }

    if (modalMode === 'checkOut') {
      return (
        <>
          <h3 className="text-lg font-semibold text-gray-800">Check Out Helmet - {selectedSlot.slotCode}</h3>
          <p className="text-sm text-gray-600 mt-2">Verify owner before check-out.</p>
          <div className="bg-gray-50 border rounded-lg p-3 mt-3 text-sm">
            <p><span className="font-semibold">Current Student:</span> {selectedSlot.currentStudentName || '-'}</p>
            <p><span className="font-semibold">Student ID:</span> {selectedSlot.currentStudentId || '-'}</p>
            <p><span className="font-semibold">Helmet Tag:</span> {selectedSlot.currentHelmetTag || '-'}</p>
          </div>
          <input
            value={checkOutStudentId}
            onChange={(e) => setCheckOutStudentId(e.target.value)}
            placeholder="Enter Student ID to verify"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-3"
          />
          <div className="flex justify-between gap-2 mt-5">
            <button onClick={() => setModalMode('flag')} className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">Flag Suspicious</button>
            <div className="flex gap-2">
              <button onClick={closeModal} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={submitCheckOut} disabled={busy} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm disabled:opacity-50">Confirm Check-Out</button>
            </div>
          </div>
        </>
      );
    }

    if (modalMode === 'flag') {
      return (
        <>
          <h3 className="text-lg font-semibold text-gray-800">Flag Slot - {selectedSlot.slotCode}</h3>
          <textarea
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Reason for flagging (e.g. tag mismatch, suspicious behavior)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-4 h-28 resize-none"
          />
          <div className="flex justify-end gap-2 mt-5">
            <button onClick={closeModal} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button onClick={submitFlag} disabled={busy} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm disabled:opacity-50">Save Flag</button>
          </div>
        </>
      );
    }

    if (modalMode === 'resolveFlag') {
      return (
        <>
          <h3 className="text-lg font-semibold text-gray-800">Flagged Slot - {selectedSlot.slotCode}</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4 text-sm text-red-900">
            <p><span className="font-semibold">Reason:</span> {selectedSlot.flagReason || '-'}</p>
            <p><span className="font-semibold">Flagged By:</span> {selectedSlot.flaggedBy || '-'}</p>
          </div>
          <div className="flex justify-between gap-2 mt-5">
            <button onClick={() => setModalMode('checkOut')} className="px-4 py-2 border rounded-lg text-sm">Continue Check-Out</button>
            <div className="flex gap-2">
              <button onClick={closeModal} className="px-4 py-2 border rounded-lg text-sm">Close</button>
              <button onClick={submitUnflag} disabled={busy} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">Clear Flag</button>
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Helmet Rack Management</h1>
          <p className="text-xs text-gray-500">Live seat-style rack tracking for security staff</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin/dashboard')} className="px-3 py-2 border rounded-lg text-sm">Back to Dashboard</button>
          <button onClick={loadAll} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Refresh</button>
        </div>
      </header>

      <div className="px-6 py-6 space-y-6">
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-2 rounded-lg text-sm shadow ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
            {toast.message}
          </div>
        )}

        <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500">Total Slots</p>
            <p className="text-2xl font-bold text-gray-900">{overview?.stats?.totalSlots ?? '-'}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs text-emerald-700">Available</p>
            <p className="text-2xl font-bold text-emerald-900">{overview?.stats?.availableSlots ?? '-'}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-700">Occupied</p>
            <p className="text-2xl font-bold text-amber-900">{overview?.stats?.occupiedSlots ?? '-'}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs text-red-700">Flagged</p>
            <p className="text-2xl font-bold text-red-900">{overview?.stats?.flaggedSlots ?? '-'}</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <p className="text-xs text-indigo-700">Occupancy Rate</p>
            <p className="text-2xl font-bold text-indigo-900">{overview?.stats?.occupancyRate?.toFixed(1) ?? '-'}%</p>
          </div>
        </section>

        <section className="bg-white border rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Helmet Slot Grid</h2>
              <p className="text-xs text-gray-500">Click a slot to check in/out or resolve flagged incidents</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search slot/student/tag"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-56"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs mb-4">
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-400" /> Available</span>
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400" /> Occupied</span>
            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400" /> Flagged</span>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading rack...</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {filteredSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => onSlotClick(slot)}
                  className={`border rounded-xl p-3 text-left transition min-h-[98px] ${statusCard[slot.status]}`}
                >
                  <p className="font-bold text-sm">{slot.slotCode}</p>
                  <p className="text-xs mt-1">{slot.status}</p>
                  {slot.currentHelmetTag && <p className="text-[11px] mt-1 truncate">Tag: {slot.currentHelmetTag}</p>}
                  {slot.currentStudentId && <p className="text-[11px] truncate">ID: {slot.currentStudentId}</p>}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white border rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Searchable Activity Log</h2>
            <div className="flex items-center gap-2">
              <input
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                placeholder="Search by slot, student, tag, action"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
              />
              <button onClick={handleActivitySearch} className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm">Search</button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Slot</th>
                  <th className="py-2 pr-4">Action</th>
                  <th className="py-2 pr-4">Student</th>
                  <th className="py-2 pr-4">Helmet Tag</th>
                  <th className="py-2 pr-4">Reason</th>
                  <th className="py-2 pr-4">By</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.id} className="border-b last:border-b-0">
                    <td className="py-2 pr-4 text-xs text-gray-500">{a.performedAt ? new Date(a.performedAt).toLocaleString() : '-'}</td>
                    <td className="py-2 pr-4 font-medium">{a.slotCode}</td>
                    <td className="py-2 pr-4">{actionLabel[a.actionType] || a.actionType}</td>
                    <td className="py-2 pr-4">{a.studentName || '-'} {a.studentId ? `(${a.studentId})` : ''}</td>
                    <td className="py-2 pr-4">{a.helmetTag || '-'}</td>
                    <td className="py-2 pr-4">{a.reason || '-'}</td>
                    <td className="py-2 pr-4 text-xs text-gray-500">{a.performedBy}</td>
                  </tr>
                ))}
                {!activities.length && (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">No activity yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      </main>

      {selectedSlot && modalMode && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/45" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-white rounded-xl p-5 shadow-xl">
            {renderModalBody()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHelmetRack;
