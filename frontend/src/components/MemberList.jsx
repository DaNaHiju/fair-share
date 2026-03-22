import React, { useState } from 'react';
import api from '../api/client';

export default function MemberList({ group, onMemberAdded }) {
    const [name, setName] = useState('');

    const addMember = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/groups/${group.id}/members`, { name });
            setName('');
            onMemberAdded();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Members</h3>
            <ul className="mb-4 flex flex-wrap gap-2">
                {group.members.map(m => (
                    <li key={m.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 font-medium">
                        {m.name}
                    </li>
                ))}
                {group.members.length === 0 && <span className="text-gray-500 italic">No members yet</span>}
            </ul>
            <form onSubmit={addMember} className="flex gap-2">
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="New member name"
                    className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
                <button type="submit" className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded text-sm font-medium hover:bg-indigo-200 transition">
                    Add
                </button>
            </form>
        </section>
    );
}
