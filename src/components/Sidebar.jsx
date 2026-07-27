// src/components/Sidebar.jsx
import React from 'react';
import { tabButtonStyle } from '../styles/styles';

/**
 * Navegación lateral de escritorio. Solo se renderiza cuando !isMobile
 * (en móvil se usa <MobileNav /> en su lugar). Recibe `activeTab` y una
 * función `onSelectTab(tabId)` para no acoplar este componente al
 * manejo del sortConfig: quien decide cómo reaccionar a un cambio de
 * tab es App.jsx.
 */
export default function Sidebar({

    activeTab,
    onSelectTab,
    pulgosasOpen,
    onTogglePulgosas,
    cubetasOpen,
    onToggleCubetas

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
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', padding: '24px 24px 24px 24px' }}>
                DINEROS
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0px', padding: '0', flex: 1 }}>
                <button onClick={() => onSelectTab('dashboard')} style={tabButtonStyle(activeTab === 'dashboard')}>
                    ADRIAN
                </button>

                {/* Grupo PULGOSAS (MARIE + ANA) */}
                <div>
                    <button
                        onClick={onTogglePulgosas}
                        style={{
                            ...tabButtonStyle(false),
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: pulgosasOpen ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
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
                            <path d="M18 12L12 18L6 12" stroke="#ffffff" stroke-width="2" />
                            <path d="M18 6L12 12L6 6" stroke="#ffffff" stroke-width="2" />

                        </svg>




                    </button>

                    {pulgosasOpen && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', paddingLeft: '5px' }}>
                            <button
                                onClick={() => onSelectTab('transacciones')}
                                style={{
                                    ...tabButtonStyle(activeTab === 'transacciones'),
                                    backgroundColor: activeTab === 'transacciones' ? '#7fa8e9' : 'rgb(200, 202, 207)',
                                    color: activeTab === 'transacciones' ? '#ffffff' : '#000000',
                                }}
                            >
                                MARIE
                            </button>
                            <button
                                onClick={() => onSelectTab('ana')}
                                style={{
                                    ...tabButtonStyle(activeTab === 'ana'),
                                    backgroundColor: activeTab === 'ana' ? '#7fa8e9' : 'rgb(200, 202, 207)',
                                    color: activeTab === 'ana' ? '#ffffff' : '#000000',
                                }}
                            >
                                ANA
                            </button>
                        </div>
                    )}
                </div>

                <button onClick={() => onSelectTab('padre')} style={tabButtonStyle(activeTab === 'padre')}>
                    PADRE
                </button>
                <button onClick={() => onSelectTab('jefesita')} style={tabButtonStyle(activeTab === 'jefesita')}>
                    JEFESITA
                </button>

                {/* Grupo CUBETAS */}
                <div>
                    <button
                        onClick={onToggleCubetas}
                        style={{
                            ...tabButtonStyle(false),
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: cubetasOpen ? ' #000000' : '#ff9e54'
                            ,
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
                            <path d="M18 12L12 18L6 12" stroke="#ffffff" stroke-width="2" />
                            <path d="M18 6L12 12L6 6" stroke="#ffffff" stroke-width="2" />

                        </svg>




                    </button>

                    {cubetasOpen && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', paddingLeft: '5px' }}>
                            <button onClick={() => onSelectTab('terrenoFelipao')} style={tabButtonStyle(activeTab === 'terrenoFelipao')}>
                                TERRENO FELIPAO
                            </button>
                        </div>
                    )}
                </div>

            </nav>
        </aside>
    );
}
