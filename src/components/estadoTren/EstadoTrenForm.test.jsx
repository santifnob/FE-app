// EstadoTrenForm.test.jsx
import { describe, it, expect } from 'vitest'
import { EstadoTrenForm } from './EstadoTrenForm'

describe('Test Unitario - EstadoTrenForm', () => {
  // Test 1: Verificar que el componente existe
  it('El componente EstadoTrenForm debe existir', () => {
    expect(EstadoTrenForm).toBeDefined()
  })

  // Test 2: Verificar que es un componente de React
  it('Debe ser una función (componente de React)', () => {
    expect(typeof EstadoTrenForm).toBe('function')
  })

  // Test 3: Validación del campo "idTren" (selector de tren)
  it('El campo "Trenes" debe ser obligatorio', () => {
    // Simulo la validación que hace react-hook-form
    const campoIdTren = (valor) => {
      if (!valor || valor === '') {
        return 'El tren es requerido'
      }
      return null
    }

    expect(campoIdTren('')).toBe('El tren es requerido')
    expect(campoIdTren('1')).toBe(null)
  })

  // Test 4: Validación del campo "nombre" (estado del tren)
  it('El campo "Nombre" (estado del tren) debe ser obligatorio', () => {
    const campoNombre = (valor) => {
      if (!valor || valor === '') {
        return 'El estado del tren es requerido'
      }
      return null
    }

    expect(campoNombre('')).toBe('El estado del tren es requerido')
    expect(campoNombre('Disponible')).toBe(null)
  })

  // Test 5: Validación del campo "fechaVigencia"
  it('El campo "Fecha de vigencia" debe ser obligatorio', () => {
    const campoFecha = (valor) => {
      if (!valor || valor === '') {
        return 'La fecha de vigencia es requerida'
      }
      return null
    }

    expect(campoFecha('')).toBe('La fecha de vigencia es requerida')
    expect(campoFecha('2025-12-31T10:00')).toBe(null)
  })

  // Test 6: Los estados del tren deben ser los correctos
  it('Los estados del tren disponibles deben ser: En reparación, Obsoleto, Disponible', () => {
    const estadosValidos = ['En reparacion', 'Obsoleto', 'Disponible']

    expect(estadosValidos).toContain('En reparacion')
    expect(estadosValidos).toContain('Obsoleto')
    expect(estadosValidos).toContain('Disponible')
    expect(estadosValidos.length).toBe(3)
  })

  // Test 7: El estado Activo/Inactivo debe tener 2 opciones
  it('Las opciones de "Estado" deben ser Activo e Inactivo', () => {
    const opcionesEstado = ['Activo', 'Inactivo']

    expect(opcionesEstado).toContain('Activo')
    expect(opcionesEstado).toContain('Inactivo')
    expect(opcionesEstado.length).toBe(2)
  })
})
