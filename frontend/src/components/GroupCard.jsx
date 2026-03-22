import React from 'react';
import { Link } from 'react-router-dom';

export default function GroupCard({ group }) {
    return (
        <Link to={`/group/${group.id}`} className="block">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition cursor-pointer">
                <h3 className="text-lg font-bold text-gray-800">{group.name}</h3>
                <p className="text-sm text-gray-500 mt-2">Click to view details</p>
            </div>
        </Link>
    );
}
