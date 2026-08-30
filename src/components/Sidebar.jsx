// src/components/Sidebar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { tabButtonStyle, tabButtonStyleBuckets } from '../styles/styles';

/**
 * Navegación lateral para pantallas de escritorio.
 * 
 * Permite cambiar entre las distintas pestañas principales (Dashboard, Personas)
 * y acceder a grupos colapsables de navegación (Pulgosas, Cubetas).
 * 
 * Este componente es estrictamente de presentación: delega el manejo del estado
 * de la pestaña activa al componente padre mediante `onSelectTab`.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.activeTab - Identificador de la pestaña actualmente activa.
 * @param {Function} props.onSelectTab - Callback ejecutado al hacer clic en una pestaña `(tabId) => void`.
 * @param {boolean} props.pulgosasOpen - Estado de apertura del acordeón del grupo "Pulgosas".
 * @param {Function} props.onTogglePulgosas - Callback para alternar el desplegable de "Pulgosas".
 * @param {boolean} props.cubetasOpen - Estado de apertura del acordeón del grupo "Cubetas".
 * @param {Function} props.onToggleCubetas - Callback para alternar el desplegable de "Cubetas".
 * 
 * @returns {JSX.Element} Barra de navegación lateral fija para escritorio.
 */
export default function Sidebar({
  activeTab,
  onSelectTab,
  pulgosasOpen,
  onTogglePulgosas,
  cubetasOpen,
  onToggleCubetas,
}) {
  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#465c73',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
        padding: 0,
      }}
    >
      {/* Logotipo / Título de la App */}
      <div
        style={{
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#ffffff',
          padding: '24px',
        }}
      >
        DINEROS
      </div>

      {/* Menú de Navegación */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          padding: '0',
          flex: 1,
        }}
      >
        {/* Pestaña Principal: Dashboard / Adrián */}
        <button
          onClick={() => onSelectTab('dashboard')}
          style={tabButtonStyle(activeTab === 'dashboard')}
        >
          ADRIAN
        </button>

        {/* Grupo Desplegable: PULGOSAS (Marie + Ana) */}
        <div>
          <button
            onClick={onTogglePulgosas}
            style={{
              ...tabButtonStyle(false),
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: pulgosasOpen
                ? 'rgba(255, 255, 255, 0.08)'
                : 'transparent',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              color: '#ffffff',
              padding: '12px 24px',
              margin: 0,
            }}
          >
            <span>PULGOSAS</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: pulgosasOpen ? 'rotate(-180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              <path d="M18 12L12 18L6 12" stroke="#ffffff" strokeWidth="2" />
              <path d="M18 6L12 12L6 6" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </button>

          {/* Submenú Pulgosas */}
          {pulgosasOpen && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
                paddingLeft: '5px',
              }}
            >
              <button
                onClick={() => onSelectTab('transacciones')}
                style={{
                  ...tabButtonStyle(activeTab === 'transacciones'),
                  backgroundColor:
                    activeTab === 'transacciones'
                      ? '#7fa8e9'
                      : 'rgb(200, 202, 207)',
                  color: activeTab === 'transacciones' ? '#ffffff' : '#000000',
                }}
              >
                MARIE
              </button>
              <button
                onClick={() => onSelectTab('ana')}
                style={{
                  ...tabButtonStyle(activeTab === 'ana'),
                  backgroundColor:
                    activeTab === 'ana' ? '#7fa8e9' : 'rgb(200, 202, 207)',
                  color: activeTab === 'ana' ? '#ffffff' : '#000000',
                }}
              >
                ANA
              </button>
            </div>
          )}
        </div>

        {/* Pestañas Individuales */}
        <button
          onClick={() => onSelectTab('padre')}
          style={tabButtonStyle(activeTab === 'padre')}
        >
          PADRE
        </button>
        <button
          onClick={() => onSelectTab('jefesita')}
          style={tabButtonStyle(activeTab === 'jefesita')}
        >
          JEFESITA
        </button>

        {/* Grupo Desplegable: CUBETAS */}
        <div>
          <button
            onClick={onToggleCubetas}
            style={{
              ...tabButtonStyle(false),
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: cubetasOpen ? '#ff7003' : '#ff9e54',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              color: '#ffffff',
              padding: '12px 24px',
              margin: 0,
            }}
          >
            <span>CUBETAS</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: cubetasOpen ? 'rotate(-180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              <path d="M18 12L12 18L6 12" stroke="#ffffff" strokeWidth="2" />
              <path d="M18 6L12 12L6 6" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </button>

          {/* Submenú Cubetas */}
          {cubetasOpen && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
                paddingLeft: '0px',
              }}
            >
              <button
                onClick={() => onSelectTab('terrenoFelipao')}
                style={tabButtonStyleBuckets(activeTab === 'terrenoFelipao')}
              >
                TERRENO FELIPAO
              </button>
              <button
                onClick={() => onSelectTab('terrenoFelipe2DO')}
                style={tabButtonStyleBuckets(activeTab === 'terrenoFelipe2DO')}
              >
                TERRENO FELIPE 2DO
              </button>
              <button
                onClick={() => onSelectTab('carro')}
                style={tabButtonStyleBuckets(activeTab === 'carro')}
              >
                CARRO
              </button>
              <button
                onClick={() => onSelectTab('desbRefriReg')}
                style={tabButtonStyleBuckets(activeTab === 'desbRefriReg')}
              >
                DESB, REFRI, REG
              </button>
              <button
                onClick={() => onSelectTab('gastosGenerales')}
                style={tabButtonStyleBuckets(activeTab === 'gastosGenerales')}
              >
                GASTOS GENERALES TERRENOS
              </button>






            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  /** Clave o ID de la pestaña seleccionada actualmente */
  activeTab: PropTypes.string.isRequired,
  /** Función callback que notifica la pestaña seleccionada */
  onSelectTab: PropTypes.func.isRequired,
  /** Indica si la sección 'Pulgosas' está expandida */
  pulgosasOpen: PropTypes.bool.isRequired,
  /** Función callback para togglear la sección 'Pulgosas' */
  onTogglePulgosas: PropTypes.func.isRequired,
  /** Indica si la sección 'Cubetas' está expandida */
  cubetasOpen: PropTypes.bool.isRequired,
  /** Función callback para togglear la sección 'Cubetas' */
  onToggleCubetas: PropTypes.func.isRequired,
};