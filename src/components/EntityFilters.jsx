import { useMemo, useState } from 'react'
import './filters.css'

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

const buildDefaultFilterValues = (availableAttributes) => {
  return availableAttributes.reduce((acc, attribute) => {
    if (attribute.type === 'range') {
      acc[attribute.minKey || `min${capitalize(attribute.key)}`] = ''
      acc[attribute.maxKey || `max${capitalize(attribute.key)}`] = ''
    } else if (attribute.type === 'dateRange') {
      acc[attribute.startKey || `start${capitalize(attribute.key)}`] = ''
      acc[attribute.endKey || `end${capitalize(attribute.key)}`] = ''
    } else {
      acc[attribute.key] = ''
    }
    return acc
  }, {})
}

export function EntityFilters({ entityName, availableAttributes, onApplyFilters }) {
  const storagePrefix = `${entityName}Filters`

  const defaultFilters = useMemo(
    () => buildDefaultFilterValues(availableAttributes),
    [availableAttributes]
  )

  const [selectedAttributes, setSelectedAttributes] = useState(() => {
    const saved = sessionStorage.getItem(`${storagePrefix}_selected`)
    return saved ? JSON.parse(saved) : []
  })

  const [filters, setFilters] = useState(() => {
    const saved = sessionStorage.getItem(`${storagePrefix}_values`)
    return saved ? JSON.parse(saved) : defaultFilters
  })

  const [errors, setErrors] = useState({})

  const [appliedFilters, setAppliedFilters] = useState(() => {
    const saved = sessionStorage.getItem(`${storagePrefix}_applied`)
    return saved ? JSON.parse(saved) : {}
  })

  const saveSelectedAttributes = (newSelected) => {
    setSelectedAttributes(newSelected)
    sessionStorage.setItem(`${storagePrefix}_selected`, JSON.stringify(newSelected))
  }

  const saveFilters = (newFilters) => {
    setFilters(newFilters)
    sessionStorage.setItem(`${storagePrefix}_values`, JSON.stringify(newFilters))
  }

  const saveAppliedFilters = (nextAppliedFilters) => {
    setAppliedFilters(nextAppliedFilters)
    sessionStorage.setItem(`${storagePrefix}_applied`, JSON.stringify(nextAppliedFilters))
  }

  const handleAttributeChange = (attributeKey, event) => {
    event.stopPropagation()
    const isSelected = selectedAttributes.includes(attributeKey)
    const nextSelected = isSelected
      ? selectedAttributes.filter((key) => key !== attributeKey)
      : [...selectedAttributes, attributeKey]

    const nextFilters = { ...filters }
    if (isSelected) {
      const attribute = availableAttributes.find((attr) => attr.key === attributeKey)
      if (attribute) {
        if (attribute.type === 'range') {
          nextFilters[attribute.minKey || `min${capitalize(attribute.key)}`] = ''
          nextFilters[attribute.maxKey || `max${capitalize(attribute.key)}`] = ''
        } else if (attribute.type === 'dateRange') {
          nextFilters[attribute.startKey || `start${capitalize(attribute.key)}`] = ''
          nextFilters[attribute.endKey || `end${capitalize(attribute.key)}`] = ''
        } else {
          nextFilters[attribute.key] = ''
        }
      }
    }

    saveSelectedAttributes(nextSelected)
    saveFilters(nextFilters)
    if (isSelected) {
      setErrors((prev) => {
        const nextErrors = { ...prev }
        const attribute = availableAttributes.find((attr) => attr.key === attributeKey)
        if (attribute) {
          if (attribute.type === 'range') {
            delete nextErrors[attribute.minKey || `min${capitalize(attribute.key)}`]
            delete nextErrors[attribute.maxKey || `max${capitalize(attribute.key)}`]
          } else if (attribute.type === 'dateRange') {
            delete nextErrors[attribute.startKey || `start${capitalize(attribute.key)}`]
            delete nextErrors[attribute.endKey || `end${capitalize(attribute.key)}`]
          } else {
            delete nextErrors[attribute.key]
          }
        }
        return nextErrors
      })
    }
  }

  const handleFilterChange = (key, value) => {
    const nextFilters = { ...filters, [key]: value }
    saveFilters(nextFilters)

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }))
    }
  }

  const validateFilters = () => {
    const nextErrors = {}

    selectedAttributes.forEach((selectedKey) => {
      const attribute = availableAttributes.find((attr) => attr.key === selectedKey)
      if (!attribute) return

      if (attribute.type === 'partial' || attribute.type === 'exact' || attribute.type === 'id') {
        const value = filters[attribute.key]
        if (!value || !String(value).trim()) {
          nextErrors[attribute.key] = `Debe ingresar un valor para ${attribute.label}`
        }
      }

      if (attribute.type === 'range') {
        const minKey = attribute.minKey || `min${capitalize(attribute.key)}`
        const maxKey = attribute.maxKey || `max${capitalize(attribute.key)}`
        const minValue = filters[minKey]
        const maxValue = filters[maxKey]

        if (!minValue && !maxValue) {
          nextErrors[minKey] = `Ingrese al menos ${attribute.label} mínimo o máximo`
        }

        if (minValue && Number.isNaN(Number(minValue))) {
          nextErrors[minKey] = 'Debe ser un número válido'
        }
        if (maxValue && Number.isNaN(Number(maxValue))) {
          nextErrors[maxKey] = 'Debe ser un número válido'
        }
        if (
          minValue &&
          maxValue &&
          !Number.isNaN(Number(minValue)) &&
          !Number.isNaN(Number(maxValue)) &&
          Number(minValue) > Number(maxValue)
        ) {
          nextErrors[maxKey] = 'El máximo no puede ser menor que el mínimo'
        }
      }

      if (attribute.type === 'dateRange') {
        const startKey = attribute.startKey || `start${capitalize(attribute.key)}`
        const endKey = attribute.endKey || `end${capitalize(attribute.key)}`
        const startValue = filters[startKey]
        const endValue = filters[endKey]

        if (!startValue && !endValue) {
          nextErrors[startKey] = `Ingrese al menos fecha de inicio o fin para ${attribute.label}`
        }

        const startDate = startValue ? new Date(startValue) : null
        const endDate = endValue ? new Date(endValue) : null

        if (startValue && Number.isNaN(startDate.getTime())) {
          nextErrors[startKey] = 'Fecha inválida'
        }
        if (endValue && Number.isNaN(endDate.getTime())) {
          nextErrors[endKey] = 'Fecha inválida'
        }
        if (startDate && endDate && startDate > endDate) {
          nextErrors[endKey] = 'La fecha final no puede ser anterior a la inicial'
        }
      }
    })

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleApply = () => {
    if (!validateFilters()) return

    const nextAppliedFilters = {}
    selectedAttributes.forEach((selectedKey) => {
      const attribute = availableAttributes.find((attr) => attr.key === selectedKey)
      if (!attribute) return

      if (attribute.type === 'range') {
        const minKey = attribute.minKey || `min${capitalize(attribute.key)}`
        const maxKey = attribute.maxKey || `max${capitalize(attribute.key)}`
        if (filters[minKey]) nextAppliedFilters[minKey] = filters[minKey]
        if (filters[maxKey]) nextAppliedFilters[maxKey] = filters[maxKey]
      } else if (attribute.type === 'dateRange') {
        const startKey = attribute.startKey || `start${capitalize(attribute.key)}`
        const endKey = attribute.endKey || `end${capitalize(attribute.key)}`
        if (filters[startKey]) nextAppliedFilters[startKey] = filters[startKey]
        if (filters[endKey]) nextAppliedFilters[endKey] = filters[endKey]
      } else {
        const value = filters[attribute.key]
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          nextAppliedFilters[attribute.key] = value
        }
      }
    })

    saveAppliedFilters(nextAppliedFilters)
    onApplyFilters(nextAppliedFilters)
  }

  const handleClearFilters = () => {
    saveSelectedAttributes([])
    saveFilters(defaultFilters)
    saveAppliedFilters({})
    setErrors({})
    onApplyFilters({})
  }

  const hasAppliedFilters = Boolean(Object.keys(appliedFilters).length)

  const renderFilterInput = (attribute) => {
    if (!selectedAttributes.includes(attribute.key)) return null

    const columnClass = selectedAttributes.length === 1 ? 'col-12 mb-2' : 'col-12 col-sm-6 mb-2'

    switch (attribute.type) {
      case 'partial':
      case 'id':
        return (
          <div key={attribute.key} className={columnClass}>
            <input
              type={attribute.type === 'id' ? 'text' : 'text'}
              className={`form-control ${errors[attribute.key] ? 'is-invalid' : ''}`}
              placeholder={`${attribute.label}...`}
              value={filters[attribute.key]}
              onChange={(e) => handleFilterChange(attribute.key, e.target.value)}
            />
            {errors[attribute.key] && <div className="invalid-feedback">{errors[attribute.key]}</div>}
          </div>
        )
      case 'exact':
        return (
          <div key={attribute.key} className={columnClass}>
            {attribute.options ? (
              <select
                className={`form-select ${errors[attribute.key] ? 'is-invalid' : ''}`}
                value={filters[attribute.key]}
                onChange={(e) => handleFilterChange(attribute.key, e.target.value)}
              >
                <option value="">{attribute.label}</option>
                {attribute.options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className={`form-control ${errors[attribute.key] ? 'is-invalid' : ''}`}
                placeholder={`${attribute.label}...`}
                value={filters[attribute.key]}
                onChange={(e) => handleFilterChange(attribute.key, e.target.value)}
              />
            )}
            {errors[attribute.key] && <div className="invalid-feedback">{errors[attribute.key]}</div>}
          </div>
        )
      case 'range': {
        const minKey = attribute.minKey || `min${capitalize(attribute.key)}`
        const maxKey = attribute.maxKey || `max${capitalize(attribute.key)}`
        return (
          <div key={attribute.key} className="col-12 mb-2">
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="number"
                  className={`form-control ${errors[minKey] ? 'is-invalid' : ''}`}
                  placeholder={`Min ${attribute.label}`}
                  value={filters[minKey]}
                  onChange={(e) => handleFilterChange(minKey, e.target.value)}
                />
                {errors[minKey] && <div className="invalid-feedback d-block">{errors[minKey]}</div>}
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className={`form-control ${errors[maxKey] ? 'is-invalid' : ''}`}
                  placeholder={`Max ${attribute.label}`}
                  value={filters[maxKey]}
                  onChange={(e) => handleFilterChange(maxKey, e.target.value)}
                />
                {errors[maxKey] && <div className="invalid-feedback d-block">{errors[maxKey]}</div>}
              </div>
            </div>
          </div>
        )
      }
      case 'dateRange': {
        const startKey = attribute.startKey || `start${capitalize(attribute.key)}`
        const endKey = attribute.endKey || `end${capitalize(attribute.key)}`
        return (
          <div key={attribute.key} className="col-12 mb-2">
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="date"
                  className={`form-control ${errors[startKey] ? 'is-invalid' : ''}`}
                  placeholder={`Desde ${attribute.label}`}
                  value={filters[startKey]}
                  onChange={(e) => handleFilterChange(startKey, e.target.value)}
                />
                {errors[startKey] && <div className="invalid-feedback d-block">{errors[startKey]}</div>}
              </div>
              <div className="col-6">
                <input
                  type="date"
                  className={`form-control ${errors[endKey] ? 'is-invalid' : ''}`}
                  placeholder={`Hasta ${attribute.label}`}
                  value={filters[endKey]}
                  onChange={(e) => handleFilterChange(endKey, e.target.value)}
                />
                {errors[endKey] && <div className="invalid-feedback d-block">{errors[endKey]}</div>}
              </div>
            </div>
          </div>
        )
      }
      default:
        return null
    }
  }
  
  return (
    <div className="d-flex flex-column flex-sm-row align-items-start gap-2 w-100">
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

      <div className="dropdown" data-bs-auto-close="outside">
        <button
          className="btn btn-outline-secondary dropdown-toggle px-3"
          type="button"
          id={`${entityName}FilterDropdown`}
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Filtrar por {selectedAttributes.length > 0 ? `(${selectedAttributes.length})` : ''}
        </button>

        <ul className="dropdown-menu" aria-labelledby={`${entityName}FilterDropdown`}>
          {availableAttributes.map((attribute) => (
            <li key={attribute.key}>
              <label className="dropdown-item d-flex align-items-center gap-2 mb-0" htmlFor={`check-${entityName}-${attribute.key}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`check-${entityName}-${attribute.key}`}
                  checked={selectedAttributes.includes(attribute.key)}
                  onChange={(event) => handleAttributeChange(attribute.key, event)}
                />
                <span>{attribute.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {selectedAttributes.length > 0 && (
        <div className="flex-grow-1 w-100" style={{ minWidth: '220px' }}>
          <div className="row g-2">
            {availableAttributes.map((attribute) => renderFilterInput(attribute))}
          </div>
          <div className="mt-2 d-flex gap-2 flex-wrap">
            <button type="button" className="btn btn-primary" onClick={handleApply}>
              Aplicar filtros
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleClearFilters}>
              Limpiar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
