describe('Prueba E2E de Crear Viaje', () => {
  function validarCombinacion(conductores, trenes) {
    const dateOffsets = [1, 2, 3, 4, 5, 7, 14, 30, 60]
    const candidatos = []

    dateOffsets.forEach((dias) => {
      const now = new Date()
      const inicioDate = new Date(now.getTime() + dias * 24 * 60 * 60 * 1000)
      const finDate = new Date(inicioDate.getTime() + 60 * 60 * 1000)
      const inicio = inicioDate.toISOString().slice(0, 16)
      const fin = finDate.toISOString().slice(0, 16)

      conductores.forEach((conductor) => {
        if (conductor.licencias?.some((licencia) => new Date(licencia.fechaVencimiento) > finDate)) {
          trenes.forEach((tren) => {
            candidatos.push({ conductor, tren, inicio, fin, finDate })
          })
        }
      })
    })

    const probarCombinacion = (index) => {
      if (index >= candidatos.length) {
        throw new Error('No encontro una combinacion valida de conductor/tren y fecha')
      }

      const { conductor, tren, inicio, fin } = candidatos[index]
      return cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/viaje/validation`,
        qs: {
          trenId: tren.id,
          conductorId: conductor.id,
          inicio,
          fin
        },
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 200) {
          return candidatos[index]
        }
        return probarCombinacion(index + 1)
      })
    }

    return probarCombinacion(0)
  }

  it('debería iniciar sesión como admin y crear un nuevo viaje', () => {
    cy.visit('/')
    cy.get('#correo').type('admin@admin.com')
    cy.get('#password').type('admin')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/admin/dashboard')
    cy.visit('/admin/viajes')
    cy.contains('Crear un viaje').click()
    cy.get('.modal').should('be.visible')

    cy.request(`${Cypress.env('apiUrl')}/conductor`).then((conductorRes) => {
      const conductores = conductorRes.body.items
      expect(conductores.length, 'conductores disponible').to.be.greaterThan(0)

      cy.request(`${Cypress.env('apiUrl')}/tren`).then((trenRes) => {
        const trenes = trenRes.body.items
        expect(trenes.length, 'trenes disponible').to.be.greaterThan(0)

        validarCombinacion(conductores, trenes).then(({ conductor, tren, inicio, fin }) => {
          cy.request(`${Cypress.env('apiUrl')}/recorrido`).then((recorridoRes) => {
            const recorrido = recorridoRes.body.items[0]
            expect(recorrido, 'recorrido disponible').to.exist

            const conductorLabel = `${conductor.id} - ${conductor.nombre} ${conductor.apellido}`
            cy.contains('Conductor:').parent().within(() => {
              cy.get('button').click()
              cy.get('#scrollableDropdown .dropdown-item').contains(conductorLabel).click({ force: true })
            })

            const trenLabel = `${tren.id} - ${tren.modelo}`
            cy.contains('Tren:').parent().within(() => {
              cy.get('button').click()
              cy.get('#scrollableDropdown .dropdown-item').contains(trenLabel).click({ force: true })
            })

            const recorridoLabel = `${recorrido.id} - ${recorrido.ciudadSalida} -> ${recorrido.ciudadLlegada}`
            cy.contains('Recorrido:').parent().within(() => {
              cy.get('button').click()
              cy.get('#scrollableDropdown .dropdown-item').contains(recorridoLabel).click({ force: true })
            })

            cy.get('input[type="datetime-local"]').first().clear().type(inicio)
            cy.get('input[type="datetime-local"]').last().clear().type(fin)
            cy.contains('Estado:').parent().find('select').select('Activo')

            cy.get('.alert.alert-warning', { timeout: 15000 }).should('not.exist')
            cy.get('button[type="submit"]').contains('Enviar').should('not.be.disabled', { timeout: 15000 }).click()

            cy.get('body').find('.modal').should('not.exist')
            cy.contains('Lista de Viajes').should('exist')
          })
        })
      })
    })
  })
})
