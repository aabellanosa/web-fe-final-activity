import React from 'react'
import { shortDesc } from '../utils/helpers'

export default function PlacesList({ title, places = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h3 className="font-semibold mb-3">{title} ({places.length})</h3>
      <ul className="space-y-3">
        {places.map(p => (
          <li key={p.fsq_id} className="border rounded-lg p-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-slate-500">{p.location?.locality || p.location?.region}</div>
                <div className="text-sm mt-2">{shortDesc(p.description || p.categories?.map(c => c.name).join(', ') || '')}</div>
              </div>
              <div className="text-xs text-slate-500 text-right">{p.distance ? `${Math.round(p.distance)} m` : ''}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}