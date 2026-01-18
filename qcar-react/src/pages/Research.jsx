import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
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
    },
    {
        title: "Hybrid Quantum-Classical Neural Networks",
        journal: "NeurIPS",
        year: "2024",
        abstract: "Proposing a new architecture for training hybrid models. We show that delegating specific layers to a quantum processor can accelerate convergence on non-convex loss landscapes."
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
                    padding: '50px',
                    maxWidth: '800px',
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

const RotatingCard = ({ paper, index, total, scrollYProgress, onClick }) => {
    // Determine the "active" float index from scroll
    const activeIndex = useTransform(scrollYProgress, [0, 1], [0, total - 1]);

    // Smooth the active index for fluid movement
    const smoothIndex = useSpring(activeIndex, { stiffness: 50, damping: 20 });

    // Calculate this card's offset from the active index
    const offset = useTransform(smoothIndex, (current) => index - current);

    // Rotation: Fan out from Bottom Center
    const rotate = useTransform(offset, (o) => {
        return o * 15; // 0 degrees at center, fanning out 15deg per unit
    });

    const opacity = useTransform(smoothIndex, (current) => {
        const dist = Math.abs(current - index);
        // Fade out neighbors stronger to focus on center
        if (dist < 0.5) return 1;
        return Math.max(0.3, 1 - dist * 0.5);
    });

    const scale = useTransform(offset, (o) => {
        const dist = Math.abs(o);
        return 1 - dist * 0.1;
    });

    const zIndex = useTransform(offset, (o) => {
        return 100 - Math.round(Math.abs(o));
    });

    return (
        <motion.div
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '320px',  // Smaller width
                height: '460px', // Smaller height
                transformOrigin: '50% 250%', // Pivot far below center
                x: '-50%',
                y: '-50%',
                rotate,
                scale,
                opacity,
                zIndex,
                cursor: 'pointer',
                background: 'rgba(5, 5, 5, 0.9)', // Darker card background for contrast
                backdropFilter: 'blur(10px)',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                overflow: 'hidden',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}
            onClick={() => onClick(paper)}
            whileHover={{
                scale: 1.05,
                borderColor: 'rgba(137, 167, 131, 0.8)'
            }}
        >
            <div>
                <div style={{
                    fontSize: '0.8rem',
                    opacity: 0.8,
                    color: '#89a783',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem'
                }}>
                    {paper.journal}, {paper.year}
                </div>
                <h2 style={{
                    fontSize: '1.6rem', // Slightly smaller text
                    marginBottom: '1rem',
                    color: '#fff',
                    lineHeight: 1.2
                }}>
                    {paper.title}
                </h2>
            </div>

            <div style={{
                fontSize: '0.95rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}>
                {paper.abstract}
            </div>
        </motion.div>
    );
};

const Research = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const [activePaper, setActivePaper] = useState(null);
    const isMobile = useIsMobile();

    // If mobile, fallback to vertical list
    if (isMobile) {
        return (
            <div style={{ padding: '120px 20px 50px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 'bold' }}>Research</h1>
                {papers.map((paper, i) => (
                    <div key={i} style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h2 style={{ fontSize: '1.2rem', color: '#fff' }}>{paper.title}</h2>
                        <div style={{ fontSize: '0.9rem', color: '#89a783', marginTop: '0.5rem' }}>{paper.journal}</div>
                    </div>
                ))}
                <AnimatePresence>
                    {activePaper && <ResearchModal paper={activePaper} onClose={() => setActivePaper(null)} />}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <section ref={targetRef} style={{ height: '400vh', position: 'relative' }}>
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                perspective: '1000px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Fixed Title Background */}
                <div style={{ position: 'absolute', top: '8vh', left: '5vw', zIndex: 10, pointerEvents: 'none' }}>
                    <h4 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        opacity: 1,
                        color: '#fff',
                        letterSpacing: '0.05em',
                        borderLeft: '4px solid #89a783',
                        paddingLeft: '1rem',
                        lineHeight: 1
                    }}>
                        RESEARCH
                    </h4>
                </div>

                {papers.map((paper, i) => (
                    <RotatingCard
                        key={i}
                        paper={paper}
                        index={i}
                        total={papers.length}
                        scrollYProgress={scrollYProgress}
                        onClick={setActivePaper}
                    />
                ))}
            </div>

            <AnimatePresence>
                {activePaper && (
                    <ResearchModal paper={activePaper} onClose={() => setActivePaper(null)} />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Research;
