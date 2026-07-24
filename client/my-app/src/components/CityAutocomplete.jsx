import React, { useEffect, useRef, useState } from 'react'

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

let _loadPromise = null
function loadPlacesScript() {
  if (window.google?.maps?.places) return Promise.resolve()
  if (_loadPromise) return _loadPromise
  _loadPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`
    s.async = true
    s.onload = resolve
    s.onerror = () => { _loadPromise = null; reject() }
    document.head.appendChild(s)
  })
  return _loadPromise
}

export default function CityAutocomplete({ value, onChange, onBlur, placeholder, inputClassName, onValidityChange }) {
  const inputRef = useRef(null)
  const acRef = useRef(null)
  const pickedFromDropdown = useRef(false)
  const [touched, setTouched] = useState(false)

  const isInvalid = touched && !pickedFromDropdown.current && !!value

  function markValid() {
    pickedFromDropdown.current = true
    onValidityChange?.(true)
  }

  function markInvalid() {
    pickedFromDropdown.current = false
    onValidityChange?.(false)
  }

  useEffect(() => {
    loadPlacesScript()
      .then(() => {
        if (!inputRef.current || acRef.current) return
        const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['(cities)'],
          componentRestrictions: { country: 'pk' },
          fields: ['name'],
        })
        ac.addListener('place_changed', () => {
          const place = ac.getPlace()
          if (place?.name) {
            // Strip ", Pakistan" / ", Punjab, Pakistan" suffixes — keep only city name
            const cityName = place.name.split(',')[0].trim()
            onChange(cityName)
            markValid()
            setTouched(false)
          }
        })
        acRef.current = ac
      })
      .catch(() => {
        // Places failed to load — allow any input, server validates
        markValid()
      })

    return () => {
      if (acRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(acRef.current)
        acRef.current = null
      }
    }
  }, [])

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className={`w-4 h-4 ${isInvalid ? 'text-red-400' : 'text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value || ''}
          onChange={(e) => {
            markInvalid()
            setTouched(false)
            onChange(e.target.value)
          }}
          onBlur={(e) => {
            if (value) setTouched(true)
            onBlur?.(e)
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={`${inputClassName} pl-9 ${isInvalid ? '!border-red-400 focus:!ring-red-200' : ''}`}
        />
        {pickedFromDropdown.current && value && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {isInvalid ? (
        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Please select a city from the dropdown suggestions
        </p>
      ) : (
        <p className="mt-1 text-xs text-gray-400">Start typing and select a city from the suggestions</p>
      )}
    </div>
  )
}
