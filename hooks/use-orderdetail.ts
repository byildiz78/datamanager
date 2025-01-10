import { useState } from 'react';
import { OrderDetail } from '@/types/tables';
import axios from "@/lib/axios";

export function useOrderDetail() {
    const [isOpen, setIsOpen] = useState(false);
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderDetail = async (orderKey: string) => {
        setIsOpen(true);
        setLoading(true);
        setError(null);
        setOrderDetail(null);

        try {
            const response = await axios.get(`/api/order-detail?orderKey=${orderKey}`);
            if (!response.status || response.status !== 200) throw new Error('Sipariş detayı alınamadı');

            setOrderDetail(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
            setIsOpen(false);
        } finally {
            setLoading(false);
        }
    };

    return {
        isOpen,
        setIsOpen,
        orderDetail,
        loading,
        error,
        fetchOrderDetail
    };
}