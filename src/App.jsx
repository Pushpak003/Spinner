import { useState, useMemo, useRef, useEffect } from 'react';
import './App.css';
import logo from './assets/logo.jpeg';

// Data lists
const DIGITS_FOR_FIRST_CUBE = ['0', '1', '2']; // Pehle cube ke liye
const ALL_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']; // Baaki cubes ke liye
const SPINNER_AMOUNTS = [2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800];
const FINAL_SLOT_RESULT = ['0', '4', '7'];

function App() {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [displayNumbers, setDisplayNumbers] = useState(FINAL_SLOT_RESULT);
    
    const intervalIds = useRef([]);
    const wheelRef = useRef(null);

    useEffect(() => {
        const wheel = wheelRef.current;

        const handleSpinStop = () => {
            intervalIds.current.forEach(clearInterval);
            setDisplayNumbers(FINAL_SLOT_RESULT);
            setIsSpinning(false);
        };

        wheel.addEventListener('transitionend', handleSpinStop);

        return () => {
            wheel.removeEventListener('transitionend', handleSpinStop);
        };
    }, []);

    const spin = () => {
        if (isSpinning) return;

        // --- YAHAN CHANGE HUA HAI ---
        FINAL_SLOT_RESULT.forEach((_, index) => {
            intervalIds.current[index] = setInterval(() => {
                // Check karenge ki kaunsa cube hai
                if (index === 0) {
                    // Agar pehla cube hai, to sirf 0, 1, 2 me se random number aayega
                    const randomIndex = Math.floor(Math.random() * DIGITS_FOR_FIRST_CUBE.length);
                    setDisplayNumbers(prev => {
                        const newNumbers = [...prev];
                        newNumbers[index] = DIGITS_FOR_FIRST_CUBE[randomIndex];
                        return newNumbers;
                    });
                } else {
                    // Agar doosra ya teesra cube hai, to saare digits me se random number aayega
                    const randomIndex = Math.floor(Math.random() * ALL_DIGITS.length);
                    setDisplayNumbers(prev => {
                        const newNumbers = [...prev];
                        newNumbers[index] = ALL_DIGITS[randomIndex];
                        return newNumbers;
                    });
                }
            }, 100);
        });
        
        setIsSpinning(true);
        const targetAmount = 2100;
        const targetIndex = SPINNER_AMOUNTS.indexOf(targetAmount);
        const segmentAngle = 360 / SPINNER_AMOUNTS.length;
        const randomOffset = Math.random() * (segmentAngle - 10) + 5;
        const targetAngleInWheel = (targetIndex * segmentAngle) + randomOffset;
        const requiredFinalAngle = 360 - targetAngleInWheel;
        const spins = 360 * 10;
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
            const y = layerCenter + studRadius * `Math.sin(angle)`;
            return <div key={index} className="stud" style={{ top: `${y - 5}px`, left: `${x - 5}px` }} />;
        });
    }, []);

    const values = useMemo(() => {
        const numValues = SPINNER_AMOUNTS.length;
        const wheelCenter = 150;
        const textRadius = 80;
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