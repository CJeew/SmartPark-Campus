const BASE = (zoneId) => `http://localhost:8080/api/admin/parking-zones/${zoneId}/slots`;
const getAdminToken = () => localStorage.getItem('adminToken');

const headers = () => ({
  'Authorization': `Bearer ${getAdminToken()}`,
  'Content-Type': 'application/json',
});

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
};

export const parkingSlotService = {
  getSlots: (zoneId) =>
    fetch(BASE(zoneId), { headers: headers() }).then(handleResponse),

  addSlot: (zoneId, slotNumber, vehicleType) =>
    fetch(BASE(zoneId), {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ slotNumber, vehicleType }),
    }).then(handleResponse),

  deleteSlot: (zoneId, slotId) =>
    fetch(`${BASE(zoneId)}/${slotId}`, {
      method: 'DELETE',
      headers: headers(),
    }).then(handleResponse),
};
