import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

const papers = [
    {
        title: "Quantum Error Correction with Surface Codes",
        journal: "Nature Physics",
        year: "2024",
        abstract: "We present a novel approach to surface code implementation that reduces the physical qubit overhead by 15% while maintaining logical error rates. Our simulation results suggest this method is viable for near-term superconducting processors."
    },
    {
        title: "Variational Quantum Eigensolvers for Chemical Simulation",
        journal: "Physical Review X",
        year: "2023",
        abstract: "This paper explores the limits of VQE algorithms on noisy intermediate-scale quantum (NISQ) devices. We demonstrate improved accuracy in ground state energy estimation for Lithium Hydride using a noise-resilient ansatz."
    },
    {
        title: "Cryptanalytic Attacks on LWE using Quantum Annealing",
        journal: "IEEE S&P",
        year: "2025",
        abstract: "We analyze the vulnerability of Learning With Errors (LWE) based cryptosystems against D-Wave's latest quantum annealing hardware. Our findings indicate a potential reduction in the bit-security levels of standard parameters."
    },
    {
        title: "Entanglement Dynamics in Many-Body Localization",
        journal: "Physical Review Letters",
        year: "2024",
        abstract: "Investigating the growth of entanglement entropy in disordered quantum spin chains. We observe distinct phases of thermalization and localization, characterized by logarithmic growth of entanglement."
    },
    {
        title: "Topological Quantum Computing with Majorana Fermions",
        journal: "Reviews of Modern Physics",
        year: "2025",
        abstract: "A comprehensive review of the current state of Majorana-based qubits. We discuss recent experimental evidence in nanowire systems and the challenges remaining for braiding operations."
    }
];

const ResearchModal = ({ paper, onClose }) => {
    if (!paper) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
        >
            <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#0a0a0a',
                    border: '1px solid #89a783',
                    borderRadius: '16px',
                    padding: '50px', // Bigger padding for "bigger" feel
                    maxWidth: '800px', // Wider max-width
                    width: '100%',
                    position: 'relative',
                    boxShadow: '0 0 40px rgba(137, 167, 131, 0.3)'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '25px',
                        right: '25px',
                        background: 'transparent',
                        border: 'none',
                        color: '#666',
                        fontSize: '28px',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <div style={{
                    fontSize: '1rem',
                    color: '#89a783',
                    marginBottom: '1rem',
                    opacity: 0.8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {paper.journal}, {paper.year}
                </div>

                <h2 style={{
                    fontSize: '2.5rem',
                    color: '#fff',
                    marginBottom: '2rem',
                    fontFamily: 'var(--font-main)',
                    lineHeight: 1.2
                }}>
                    {paper.title}
                </h2>
                <div style={{
                    width: '60px',
                    height: '3px',
                    background: '#89a783',
                    marginBottom: '2rem'
                }} />
                <p style={{
                    color: '#ddd',
                    lineHeight: 1.8,
                    fontSize: '1.2rem'
                }}>
                    {paper.abstract}
                </p>
                <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
                    * Click anywhere outside to close
                </div>
            </motion.div>
        </motion.div>
    );
};

const ResearchCard = ({ paper, index, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }} // Simple zoom effect
            transition={{ duration: 0.3 }}
            className="card-glow-wrapper"
            onClick={() => onClick(paper)}
            style={{
                marginBottom: '1.5rem',
                cursor: 'pointer'
            }}
        >
            <div className="card-content" style={{
                padding: '1.5rem',
                borderLeft: '2px solid transparent'
            }}>
                <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem', color: '#fff' }}>{paper.title}</h2>
                <div style={{ fontSize: '0.9rem', opacity: 0.6, color: '#89a783' }}>{paper.journal}, {paper.year}</div>
            </div>
        </motion.div>
    );
};

const Research = () => {
    const [activePaper, setActivePaper] = useState(null);
    const isMobile = useIsMobile();

    return (
        <div style={{ padding: '150px 10vw 50px' }}>
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ fontSize: '3rem', marginBottom: '2rem', fontWeight: 'bold' }}
            >
                Research
            </motion.h1>

            <div style={{ marginTop: '2rem', maxWidth: '800px' }}>
                <p style={{ maxWidth: '600px', lineHeight: 1.6, opacity: 0.8, marginBottom: '3rem' }}>
                    Our group is dedicated to pushing the boundaries of what's physically possible in computation.
                    From theoretical complexity classes to practical hardware implementation.
                </p>

                {papers.map((paper, i) => (
                    <ResearchCard
                        key={i}
                        paper={paper}
                        index={i}
                        onClick={setActivePaper}
                    />
                ))}
            </div>

            <AnimatePresence>
                {activePaper && (
                    <ResearchModal paper={activePaper} onClose={() => setActivePaper(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Research;
