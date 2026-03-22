import React, { useState, useEffect } from 'react';
import api from '../api/client';
import GroupCard from '../components/GroupCard';

export default function Home() {
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => {
        api.get('/groups')
           .then(res => setGroups(res.data))
           .catch(err => console.error("Error fetching groups:", err));
    }, []);

    const createGroup = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/groups', { name: newGroupName });
            setGroups([...groups, res.data]);
            setNewGroupName('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Group</h2>
                <form onSubmit={createGroup} className="flex gap-4">
                    <input 
                        type="text" 
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Group Name (e.g. Vegas Trip)"
                        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">
                        Create
                    </button>
                </form>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Groups</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                    {groups.length === 0 && <p className="text-gray-500 italic">No groups found. Create one above!</p>}
                </div>
            </section>
        </div>
    );
}
