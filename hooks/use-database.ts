import { useEffect, useState, useRef } from 'react';
import { DatabaseResponse } from '@/types/tables';
import axios from '@/lib/axios';

export function useDatabase(tenantId?: string) {
    const [database, setDatabase] = useState<DatabaseResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const prevTenantIdRef = useRef<string>();

    useEffect(() => {
        if (!tenantId || tenantId === prevTenantIdRef.current) {
            return;
        }

        prevTenantIdRef.current = tenantId;
        let isMounted = true;

        const fetchDatabase = async () => {
            try {
                const response = await axios.get(`/api/tenant/database?tenantId=${tenantId}`);

                if (!isMounted) return;

                if (response.status !== 200) {
                    throw new Error(response.data.message || 'Failed to fetch database');
                }

                setDatabase(response.data);
                setError(null);
            } catch (err) {
                if (!isMounted) return;
                console.error('Database fetch error:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch database');
                setDatabase(null);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        setIsLoading(true);
        fetchDatabase();

        return () => {
            isMounted = false;
        };
    }, [tenantId]);

    return { database, error, isLoading };
}
