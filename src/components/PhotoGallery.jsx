import React from 'react'

export default function PhotoGallery({ photos = [] }) {
  if (!photos.length) return null
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h3 className="font-semibold mb-3">Photos</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {photos.map(p => (
          <a key={p.id} href={p.links.html} target="_blank" rel="noreferrer" className="block rounded overflow-hidden">
            <img alt={p.alt_description || p.description || 'photo'} loading="lazy" src={p.urls.small} className="w-full h-32 object-cover" />
          </a>
        ))}
      </div>
    </div>
  )
}
