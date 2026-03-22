import React from 'react';
import SettleUpButton from './SettleUpButton';

export default function BalanceSummary({ groupId, balances, onSettled }) {
    return (
        <section className="bg-slate-50 p-6 rounded-lg shadow-sm border border-slate-200 sticky top-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Balances</h3>
            {balances.length === 0 ? (
                <p className="text-gray-500 italic text-sm">All settled up!</p>
            ) : (
                <ul className="space-y-4">
                    {balances.map((bal, idx) => (
                        <li key={idx} className="flex flex-col gap-2 p-3 bg-white rounded border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold text-red-600">{bal.from_name}</span>
                                <span className="text-gray-500 px-2 text-xs">owes</span>
                                <span className="font-semibold text-green-600">{bal.to_name}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="font-bold text-gray-800">${parseFloat(bal.amount).toFixed(2)}</span>
                                <SettleUpButton 
                                    groupId={groupId} 
                                    payerId={bal.from_id} 
                                    payeeId={bal.to_id} 
                                    amount={bal.amount}
                                    onSuccess={onSettled} 
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
