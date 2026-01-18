import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

const profiles = [
    { name: "Dr. Hassan", role: "Principal Investigator", description: "Expert in Quantum Algorithms and Computation. Leading the group's research direction towards fault-tolerant quantum systems.", id: 1 },
    { name: "Dr. Raja", role: "Senior Researcher", description: "Specializes in Quantum Cryptography and secure communications protocols. Investigating QKD implementations.", id: 2 },
    { name: "Dr. Vikas", role: "Research Scientist", description: "Focuses on Quantum Error Correction codes and their practical application in noisy environments.", id: 3 },
    { name: "Dr. Divyansh", role: "Postdoctoral Fellow", description: "Working on Topological Quantum Computing and non-Abelian anyons for robust qubit storage.", id: 4 },
    { name: "Dr. Aruna", role: "Associate Professor", description: "Researching Quantum Information Theory and entanglement entropy in many-body systems.", id: 5 },
    { name: "Lakshya", role: "PhD Candidate", description: "Developing new quantum machine learning models for classification tasks on NISQ devices.", id: 6 },
    { name: "Suraj Singh", role: "Undergraduate Researcher", description: "Exploring quantum simulation techniques for condensed matter physics problems.", id: 7 },
    { name: "Nisheeth Reen", role: "Undergraduate Researcher", description: "Assisting in quantum circuit optimization and compiler design.", id: 8 },
    { name: "Abhinav Tomar", role: "Undergraduate Researcher", description: "Implementation of quantum algorithms on superconducting hardware backends.", id: 9 }
];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut"
        }
    })
};

const TeamModal = ({ profile, onClose }) => {
    if (!profile) return null;

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
                    padding: '40px',
                    maxWidth: '500px',
                    width: '100%',
                    position: 'relative',
                    boxShadow: '0 0 40px rgba(137, 167, 131, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: '#666',
                        fontSize: '24px',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #89a783 0%, #1d4f40 100%)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    boxShadow: '0 0 20px rgba(137, 167, 131, 0.4)'
                }}>
                    {profile.name.charAt(0)}
                </div>

                <h2 style={{
                    fontSize: '2rem',
                    color: '#fff',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-main)'
                }}>
                    {profile.name}
                </h2>

                <h3 style={{
                    fontSize: '1rem',
                    color: '#89a783',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    {profile.role}
                </h3>

                <p style={{
                    color: '#ddd',
                    lineHeight: 1.6,
                    fontSize: '1.1rem'
                }}>
                    {profile.description}
                </p>

                <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
                    * Active Research Member
                </div>
            </motion.div>
        </motion.div>
    );
};

const ProfileCard = ({ profile, index, onClick }) => {
    return (
        <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            // className="card-glow-wrapper" // Removed to use custom glass style
            onClick={() => onClick(profile)}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            style={{
                cursor: 'pointer',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                transition: 'background-color 0.3s ease'
            }}
        >
            <div className="card-content" style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                background: 'transparent', // Ensure inner content is transparent
                height: '100%'
            }}>
                <div style={{
                    width: '120px', // Larger photo
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #89a783 0%, #1d4f40 100%)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '2.5rem', // Larger initial
                    boxShadow: '0 0 20px rgba(137, 167, 131, 0.2)'
                }}>
                    {profile.name.charAt(0)}
                </div>

                <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem', color: '#89a783' }}>{profile.name}</h2>
                <h3 style={{ fontSize: '0.9rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0', color: '#fff' }}>{profile.role}</h3>

                {/* Visual indicator for click */}
                <div style={{
                    marginTop: '1.5rem',
                    fontSize: '0.8rem',
                    opacity: 0.4,
                    borderBottom: '1px dotted #89a783',
                    paddingBottom: '2px',
                    color: '#fff'
                }}>
                    View Details
                </div>
            </div>
        </motion.div>
    );
};

const Team = () => {
    const [activeProfile, setActiveProfile] = useState(null);
    const isMobile = useIsMobile();

    return (
        <div style={{ padding: '150px 10vw 50px' }}>
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ fontSize: '3rem', marginBottom: '2rem', fontWeight: 'bold' }}
            >
                Meet the Team
            </motion.h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2.5rem', // Increased gap
                position: 'relative',
                zIndex: 1
            }}>
                {profiles.map((profile, index) => (
                    <ProfileCard
                        key={index}
                        profile={profile}
                        index={index}
                        onClick={setActiveProfile}
                    />
                ))}
            </div>

            <AnimatePresence>
                {activeProfile && (
                    <TeamModal profile={activeProfile} onClose={() => setActiveProfile(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Team;
