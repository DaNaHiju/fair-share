import React, { useState } from 'react';
import api from '../api/client';

export default function SettleUpButton({ groupId, payerId, payeeId, amount, onSuccess }) {
    const [loading, setLoading] = useState(false);

    const handleSettle = async () => {
        if (!window.confirm("Mark this debt as settled?")) return;
        
        setLoading(true);
        try {
            await api.post('/settle', {
                group_id: groupId,
                payer_id: payerId,
                payee_id: payeeId,
                amount: amount
            });
            onSuccess();
        } catch (err) {
            console.error(err);
            alert("Error settling debt");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleSettle}
            disabled={loading}
            className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded border border-indigo-200 hover:bg-indigo-100 transition font-medium disabled:opacity-50"
        >
            {loading ? "Settling..." : "Settle Up"}
        </button>
    );
}
