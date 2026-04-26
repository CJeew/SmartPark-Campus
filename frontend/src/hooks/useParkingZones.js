import { useState, useEffect, useCallback } from 'react';
import { parkingZoneService } from '../services/parkingZoneService';

export const useParkingZones = (initialFilters = {}) => {
  const [zones, setZones] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ page: 0, size: 10, ...initialFilters });

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    parkingZoneService.getAll(filters)
      .then((data) => {
        setZones(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
      })
      .catch((err) => setError(err.message || 'Failed to load zones'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const updateFilters = (newFilters) =>
    setFilters((prev) => ({ ...prev, ...newFilters, page: 0 }));

  const setPage = (page) => setFilters((prev) => ({ ...prev, page }));

  return { zones, totalPages, totalElements, loading, error, filters, updateFilters, setPage, reload: load };
};
