import React, { useState } from 'react';
import api from '../api/client';

export default function ExpenseForm({ group, onExpenseAdded }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paidBy, setPaidBy] = useState('');

    const addExpense = async (e) => {
        e.preventDefault();
        if (!paidBy) return alert("Select who paid!");
        
        try {
            await api.post(`/groups/${group.id}/expenses`, { 
                description, 
                amount: parseFloat(amount), 
                paid_by: paidBy 
            });
            setDescription('');
            setAmount('');
            setPaidBy('');
            onExpenseAdded();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Add an Expense</h3>
            <form onSubmit={addExpense} className="space-y-4">
                <div>
                    <input 
                        type="text" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What was it for? (e.g. Dinner)"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div className="flex gap-4">
                    <input 
                        type="number" 
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount ($)"
                        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <select 
                        value={paidBy}
                        onChange={(e) => setPaidBy(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="" disabled>Who paid?</option>
                        {group.members.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={group.members.length === 0} className="w-full bg-emerald-600 text-white px-4 py-2 rounded font-medium hover:bg-emerald-700 transition disabled:opacity-50">
                    Add Expense
                </button>
            </form>
        </section>
    );
}
