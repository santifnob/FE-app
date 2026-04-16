import { useState } from 'react'
import '../filters.css'

export function RecorridoFilters({ onApplyFilters }) {
  const [selectedAttributes, setSelectedAttributes] = useState(() => {
    const saved = sessionStorage.getItem('recorridoFilters_selected')
    return saved ? JSON.parse(saved) : []
  })
  const [filters, setFilters] = useState(() => {
    const saved = sessionStorage.getItem('recorridoFilters_values')
    return saved ? JSON.parse(saved) : {
      ciudadSalida: '',
      ciudadLlegada: '',
      estado: '',
      minKm: '',
      maxKm: ''
    }
  })
  const [errors, setErrors] = useState({})
  const [appliedFilters, setAppliedFilters] = useState(() => {
    const saved = sessionStorage.getItem('recorridoFilters_applied')
    return saved ? JSON.parse(saved) : {}
  })

  const availableAttributes = [
    { key: 'ciudadSalida', label: 'Ciudad Salida', type: 'partial' },
    { key: 'ciudadLlegada', label: 'Ciudad Llegada', type: 'partial' },
    { key: 'estado', label: 'Estado', type: 'exact' },
    { key: 'totalKm', label: 'Total Km', type: 'range' }
  ]

  const handleAttributeChange = (attributeKey, e) => {
    e.stopPropagation() // Prevenir que el dropdown se cierre
    const isCurrentlySelected = selectedAttributes.includes(attributeKey)
    setSelectedAttributes(prev =>
      isCurrentlySelected
        ? prev.filter(attr => attr !== attributeKey)
        : [...prev, attributeKey]
    )
    sessionStorage.setItem('recorridoFilters_selected', JSON.stringify(
      isCurrentlySelected
        ? selectedAttributes.filter(attr => attr !== attributeKey)
        : [...selectedAttributes, attributeKey]
    ))

    // Limpiar el valor si se deselecciona
    if (isCurrentlySelected) {
      if (attributeKey === 'totalKm') {
        setFilters(prev => ({ ...prev, minKm: '', maxKm: '' }))
        sessionStorage.setItem('recorridoFilters_values', JSON.stringify({ ...filters, minKm: '', maxKm: '' }))
      } else {
        setFilters(prev => ({ ...prev, [attributeKey]: '' }))
        sessionStorage.setItem('recorridoFilters_values', JSON.stringify({ ...filters, [attributeKey]: '' }))
      }
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    sessionStorage.setItem('recorridoFilters_values', JSON.stringify(newFilters))
    // Limpiar errores al cambiar
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  const validateFilters = () => {
    const newErrors = {}

    if (selectedAttributes.includes('ciudadSalida') && !filters.ciudadSalida.trim()) {
      newErrors.ciudadSalida = 'Debe ingresar una ciudad de salida'
    }

    if (selectedAttributes.includes('ciudadLlegada') && !filters.ciudadLlegada.trim()) {
      newErrors.ciudadLlegada = 'Debe ingresar una ciudad de llegada'
    }

    if (selectedAttributes.includes('estado') && !filters.estado.trim()) {
      newErrors.estado = 'Debe seleccionar un estado'
    }

    if (selectedAttributes.includes('totalKm')) {
      const min = parseFloat(filters.minKm)
      const max = parseFloat(filters.maxKm)

      if (!filters.minKm && !filters.maxKm) {
        newErrors.minKm = 'Ingrese al menos min o max'
      }
      if (filters.minKm && isNaN(min)) {
        newErrors.minKm = 'Debe ser un número válido'
      }
      if (filters.maxKm && isNaN(max)) {
        newErrors.maxKm = 'Debe ser un número válido'
      }
      if (filters.minKm && filters.maxKm && !isNaN(min) && !isNaN(max) && min > max) {
        newErrors.maxKm = 'El máximo no puede ser menor que el mínimo'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleApply = () => {
    if (!validateFilters()) return

    const appliedFilters = {}

    if (selectedAttributes.includes('ciudadSalida') && filters.ciudadSalida.trim()) {
      appliedFilters.ciudadSalida = filters.ciudadSalida.trim()
    }

    if (selectedAttributes.includes('ciudadLlegada') && filters.ciudadLlegada.trim()) {
      appliedFilters.ciudadLlegada = filters.ciudadLlegada.trim()
    }

    if (selectedAttributes.includes('estado') && filters.estado.trim()) {
      appliedFilters.estado = filters.estado.trim()
    }

    if (selectedAttributes.includes('totalKm')) {
      if (filters.minKm) appliedFilters.minKm = filters.minKm
      if (filters.maxKm) appliedFilters.maxKm = filters.maxKm
    }

    setAppliedFilters(appliedFilters)
    sessionStorage.setItem('recorridoFilters_applied', JSON.stringify(appliedFilters))
    onApplyFilters(appliedFilters)
  }

  const handleClearFilters = () => {
    setSelectedAttributes([])
    sessionStorage.setItem('recorridoFilters_selected', JSON.stringify([]))
    setFilters({ ciudadSalida: '', ciudadLlegada: '', estado: '', minKm: '', maxKm: '' })
    sessionStorage.setItem('recorridoFilters_values', JSON.stringify({ ciudadSalida: '', ciudadLlegada: '', estado: '', minKm: '', maxKm: '' }))
    setAppliedFilters({})
    sessionStorage.setItem('recorridoFilters_applied', JSON.stringify({}))
    onApplyFilters({})
  }

  const hasAppliedFilters = Boolean(Object.keys(appliedFilters).some(key => appliedFilters[key] !== ''))
  console.log(hasAppliedFilters);
  console.log(appliedFilters);

  const renderFilterInput = (attribute) => {
    if (!selectedAttributes.includes(attribute.key)) return null

    switch (attribute.type) {
      case 'partial': {
        const columnClass = selectedAttributes.length === 1 ? 'col-12 mb-2' : 'col-12 col-sm-6 mb-2'
        return (
          <div key={attribute.key} className={columnClass}>
            <input
              type="text"
              className={`form-control ${errors[attribute.key] ? 'is-invalid' : ''}`}
              placeholder={`${attribute.label}...`}
              value={filters[attribute.key]}
              onChange={(e) => handleFilterChange(attribute.key, e.target.value)}
            />
            {errors[attribute.key] && <div className="invalid-feedback">{errors[attribute.key]}</div>}
          </div>
        )
      }
      case 'exact': {
        const columnClass = selectedAttributes.length === 1 ? 'col-12 mb-2' : 'col-12 col-sm-6 mb-2'
        return (
          <div key={attribute.key} className={columnClass}>
            <select
              className={`form-select ${errors[attribute.key] ? 'is-invalid' : ''}`}
              value={filters[attribute.key]}
              onChange={(e) => handleFilterChange(attribute.key, e.target.value)}
            >
              <option value="">{attribute.label}</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            {errors[attribute.key] && <div className="invalid-feedback">{errors[attribute.key]}</div>}
          </div>
        )
      }
      case 'range':
        return (
          <div key={attribute.key} className="col-12 mb-2">
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="number"
                  className={`form-control ${errors.minKm ? 'is-invalid' : ''}`}
                  placeholder="Min Km"
                  value={filters.minKm}
                  onChange={(e) => handleFilterChange('minKm', e.target.value)}
                />
                {errors.minKm && <div className="invalid-feedback d-block">{errors.minKm}</div>}
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className={`form-control ${errors.maxKm ? 'is-invalid' : ''}`}
                  placeholder="Max Km"
                  value={filters.maxKm}
                  onChange={(e) => handleFilterChange('maxKm', e.target.value)}
                />
                {errors.maxKm && <div className="invalid-feedback d-block">{errors.maxKm}</div>}
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="d-flex flex-column flex-sm-row align-items-start gap-2">
      {/* Botón quitar filtros */}
      {hasAppliedFilters && (
        <button
          type="button"
          className="clear-filters-btn"
          onClick={handleClearFilters}
          title="Limpiar filtros"
        >
          ×
        </button>
      )}

      {/* Dropdown multiselect para atributos */}
      <div className="dropdown" data-bs-auto-close="outside">
        <button
          className="btn btn-outline-secondary dropdown-toggle px-3"
          type="button"
          id="filterDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Filtrar por {selectedAttributes.length > 0 ? `(${selectedAttributes.length})` : ''}
        </button>

        <ul className="dropdown-menu" aria-labelledby="filterDropdown">
          {availableAttributes.map(attr => (
            <li key={attr.key}>
              <label className="dropdown-item d-flex align-items-center gap-2 mb-0" htmlFor={`check-${attr.key}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`check-${attr.key}`}
                  checked={selectedAttributes.includes(attr.key)}
                  onChange={(e) => handleAttributeChange(attr.key, e)}
                />
                <span>{attr.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Inputs dinámicos */}
      {selectedAttributes.length > 0 && (
        <div className="flex-grow-1 w-100" style={{ minWidth: '200px' }}>
          <div className="row g-2">
            {availableAttributes.map(attr => renderFilterInput(attr))}
          </div>
        </div>
      )}

      {/* Botón aplicar */}
      <button
        className="btn btn-primary px-3"
        onClick={handleApply}
        disabled={selectedAttributes.length === 0}
      >
        Aplicar
      </button>

      
    </div>
  )
}