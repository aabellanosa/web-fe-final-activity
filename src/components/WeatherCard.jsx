import React from 'react'
import { formatTemperature } from '../utils/helpers'

export default function WeatherCard({ data, units }) {
  if (!data) return null
  const icon = data.weather?.[0]?.icon
  const desc = data.weather?.[0]?.description
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <div className="flex items-center gap-4">
        {icon && (
          <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={desc} />
        )}
        <div>
          <h2 className="text-2xl font-semibold">{data.name}, {data.sys?.country}</h2>
          <p className="text-sm text-slate-500 capitalize">{desc}</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-3xl font-bold">{formatTemperature(data.main.temp, units)}</div>
          <div className="text-sm text-slate-500">Feels like {formatTemperature(data.main.feels_like, units)}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 text-sm text-slate-600">
        <div>Humidity: {data.main.humidity}%</div>
        <div>Wind: {data.wind.speed} m/s</div>
        <div>Pressure: {data.main.pressure} hPa</div>
      </div>
    </div>
  )
}
