import React from 'react'

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search city...' }) {
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="w-full max-w-2xl mx-auto flex gap-2 items-center">
      <input
        aria-label="Search city"
        className="flex-1 p-3 rounded-lg shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button
        className="px-4 py-2 rounded-lg bg-sky-600 text-white disabled:opacity-50"
        disabled={!value}
        type="submit"
      >
        Search
      </button>
    </form>
  )
}
