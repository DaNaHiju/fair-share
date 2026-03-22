import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import MemberList from '../components/MemberList';
import ExpenseForm from '../components/ExpenseForm';
import BalanceSummary from '../components/BalanceSummary';

export default function GroupDetail() {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const [grpRes, expRes, balRes] = await Promise.all([
                api.get(`/groups/${id}`),
                api.get(`/groups/${id}/expenses`),
                api.get(`/groups/${id}/balances`)
            ]);
            setGroup(grpRes.data);
            setExpenses(expRes.data);
            setBalances(balRes.data);
        } catch (err) {
            console.error(err);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!group) return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">{group.name}</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <MemberList group={group} onMemberAdded={fetchData} />
                    
                    <ExpenseForm group={group} onExpenseAdded={fetchData} />
                    
                    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Expenses</h3>
                        {expenses.length === 0 ? (
                            <p className="text-gray-500 italic">No expenses yet.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {expenses.map(exp => {
                                    const payer = group.members.find(m => m.id === exp.paid_by);
                                    return (
                                        <li key={exp.id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-800">{exp.description}</p>
                                                <p className="text-sm text-gray-500">Paid by {payer?.name || 'Unknown'}</p>
                                            </div>
                                            <span className="font-bold text-gray-800">${parseFloat(exp.amount).toFixed(2)}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>
                </div>

                <div className="lg:col-span-1">
                    <BalanceSummary groupId={group.id} balances={balances} onSettled={fetchData} />
                </div>
            </div>
        </div>
    );
}
