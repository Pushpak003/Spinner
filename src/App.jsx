import { useState, useMemo, useRef, useEffect } from 'react';
import './App.css';
import logo from './assets/logo.jpeg';

// Data lists
const SPINNER_AMOUNTS = [2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900];
const FINAL_SLOT_RESULT = ['0', '1', '8'];

// Saare numbers ko 3-digit string mein convert kar diya hai (e.g., 57 -> "057")
const rawAnimationNumbers = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 32, 33, 34, 35, 36, 37, 38, 46, 47, 48, 49, 52, 53, 54, 55, 56, 58, 59, 60, 61, 62, 63, 100, 105, 110, 113, 114, 136, 137, 139, 140, 141, 142, 143, 148, 149, 151, 152, 153, 154, 158, 159, 162, 168, 170, 171, 172, 173, 177, 178, 199, 202, 203, 204, 209, 242, 243, 244, 245, 246, 248, 252, 253, 263, 264];
const ANIMATION_NUMBERS = rawAnimationNumbers.map(num => String(num).padStart(3, '0'));


function App() {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [displayNumbers, setDisplayNumbers] = useState(['0', '0', '0']);
    
    const intervalIds = useRef([]);
    const timeoutIds = useRef([]);
    const wheelRef = useRef(null);

    useEffect(() => {
        const wheel = wheelRef.current;

        const handleSpinStop = () => {
            intervalIds.current.forEach(clearInterval);
            timeoutIds.current.forEach(clearTimeout);
            setDisplayNumbers(FINAL_SLOT_RESULT);
            setIsSpinning(false);
        };

        wheel.addEventListener('transitionend', handleSpinStop);

        return () => {
            wheel.removeEventListener('transitionend', handleSpinStop);
            intervalIds.current.forEach(clearInterval);
            timeoutIds.current.forEach(clearTimeout);
        };
    }, []);

    const spin = () => {
        if (isSpinning) return;
        setIsSpinning(true);

        const setupNumberAnimation = (delay) => {
            // Purana interval clear karo
            intervalIds.current.forEach(clearInterval);
            
            // Naya interval set karo jo naye array se random number uthayega
            const newIntervalId = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * ANIMATION_NUMBERS.length);
                const numberString = ANIMATION_NUMBERS[randomIndex]; // e.g., "135"
                const newDisplayNumbers = numberString.split('');     // ["1", "3", "5"]
                setDisplayNumbers(newDisplayNumbers);
            }, delay);
            
            // Naye interval ki ID store kar lo
            intervalIds.current = [newIntervalId];
        };

        // --- CHANGE: Speed aur timing ko naye 32-second spin ke liye adjust kiya hai ---
        setupNumberAnimation(50); // Very Fast
        const mediumSpeedTimeout = setTimeout(() => setupNumberAnimation(150), 20000); // Medium after 20s
        const slowSpeedTimeout = setTimeout(() => setupNumberAnimation(300), 28000); // Slow after 28s

        timeoutIds.current = [mediumSpeedTimeout, slowSpeedTimeout];
        
        // Wheel ko ghumaane ka logic
        const targetAmount = 2000;
        const targetIndex = SPINNER_AMOUNTS.indexOf(targetAmount);
        const segmentAngle = 360 / SPINNER_AMOUNTS.length;
        const randomOffset = Math.random() * (segmentAngle - 10) + 5;
        const targetAngleInWheel = (targetIndex * segmentAngle) + randomOffset;
        const requiredFinalAngle = 360 - targetAngleInWheel;
        const spins = 360 * 35; // Aur zyada rotations, taaki lamba spin achha lage
        const currentAngle = rotation % 360;
        const adjustment = (requiredFinalAngle - currentAngle + 360) % 360;
        const totalRotation = rotation + spins + adjustment;
        setRotation(totalRotation);
    };

    const studs = useMemo(() => {
        const numStuds = 12;
        const layerCenter = 160;
        const studRadius = 152;
        return Array.from({ length: numStuds }).map((_, index) => {
            const angle = (index / numStuds) * 2 * Math.PI;
            const x = layerCenter + studRadius * Math.cos(angle);
            const y = layerCenter + studRadius * Math.sin(angle);
            return <div key={index} className="stud" style={{ top: `${y - 5}px`, left: `${x - 5}px` }} />;
        });
    }, []);

    const values = useMemo(() => {
        const numValues = SPINNER_AMOUNTS.length;
        const wheelCenter = 150;
        const textRadius = 95;
        return SPINNER_AMOUNTS.map((amount, index) => {
            const segmentAngle = 360 / numValues;
            const startAngle = index * segmentAngle;
            const centerAngle = startAngle + (segmentAngle / 2);
            const angleRad = (centerAngle - 90) * (Math.PI / 180);
            const x = wheelCenter + textRadius * Math.cos(angleRad);
            const y = wheelCenter + textRadius * Math.sin(angleRad);
            return (
                <div key={index} className="value-text" style={{ top: `${y}px`, left: `${x}px`, transform: `translate(-50%, -50%) rotate(${centerAngle}deg)` }}>
                    <span>{String(amount).split('').map((char, i) => <div key={i}>{char}</div>)}</span>
                </div>
            );
        });
    }, []);

    return (
        <div className="app-container">
            <h1 className="main-title">AMOUNT SPINNER</h1>
            <div className="spinner-container">
                <div className="spinner-pointer"></div>
                <div className="spinner-frame">
                    <div className="spinner-red-layer">
                        {studs}
                        <div ref={wheelRef} className="spinner-wheel" style={{ transform: `rotate(${rotation}deg)` }}>
                            <div className="value-container">{values}</div>
                        </div>
                    </div>
                </div>
                <div className="center-spin-button" onClick={spin} style={{ backgroundImage: `url(${logo})` }}></div>
            </div>
            
            <h1 className="main-title">WINNER NUMBER</h1>
            
            <div className="winner-blocks-container">
                {displayNumbers.map((number, i) => (
                    <div key={i} className="cube">
                        <div className="cube-face front">{number}</div>
                        <div className="cube-face top"></div>
                        <div className="cube-face left"></div>
                        <div className="cube-face right"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;