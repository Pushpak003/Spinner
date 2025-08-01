import { useState, useMemo } from 'react';
import './App.css';
import logo from './assets/logo.jpeg';

const AMOUNTS = [2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800];
// CHANGE: Winner ID ko 7 se 3 characters ka kar diya hai
const WINNER_ID = "X39";

function App() {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);

 const spinWheel = () => {
        if (isSpinning) return;
        setIsSpinning(true);

        // --- CHANGE: Hamesha 2100 Pe Rokne Ka Naya Logic ---

        // 1. Target amount (2100) aur uski details nikalenge
        const targetAmount = 2100;
        const targetIndex = AMOUNTS.indexOf(targetAmount); // 2100 ka index (jo ki 1 hai)
        const numSegments = AMOUNTS.length; // Total segments (9)
        const segmentAngle = 360 / numSegments; // Har segment ka angle (40 deg)

        // 2. Target segment ke beech me ek thoda sa random point nikalenge
        // Taki har baar spin thoda natural lage, na ki ekdum fixed
        const randomOffset = Math.random() * (segmentAngle - 10) + 5; // Slice ke andar 5 se 35 deg ke beech
        const targetAngleInWheel = (targetIndex * segmentAngle) + randomOffset;

        // 3. Final rukne wala angle calculate karenge. Pointer top pe (0 deg) hai.
        // Isliye wheel ko '360 - targetAngleInWheel' pe rokna hoga.
        const requiredFinalAngle = 360 - targetAngleInWheel;

        // 4. Extra rotations add karenge (10 second tak ghumane ke liye)
        const spins = 360 * 10; // 10 poore chakkar

        // 5. Abhi ke rotation se adjust karke final value nikalenge, taaki spin smooth lage
        const currentAngle = rotation % 360;
        const adjustment = (requiredFinalAngle - currentAngle + 360) % 360;

        const totalRotation = rotation + spins + adjustment;
        
        setRotation(totalRotation);

        // --- End of Naya Logic ---

        // Timeout ko 10000ms (10 seconds) karna zaroori hai
        setTimeout(() => setIsSpinning(false), 10000);
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
        const numValues = AMOUNTS.length;
        const wheelCenter = 150;
        const textRadius = 80;

        return AMOUNTS.map((amount, index) => {
            const segmentAngle = 360 / numValues;
            const startAngle = index * segmentAngle;
            const centerAngle = startAngle + (segmentAngle / 2);
            
            const angleRad = (centerAngle - 90) * (Math.PI / 180);

            const x = wheelCenter + textRadius * Math.cos(angleRad);
            const y = wheelCenter + textRadius * Math.sin(angleRad);

            return (
                <div
                    key={index}
                    className="value-text"
                    style={{
                        top: `${y}px`,
                        left: `${x}px`,
                        transform: `translate(-50%, -50%) rotate(${centerAngle}deg)`
                    }}
                >
                    <span>
                        {String(amount).split('').map((char, i) => <div key={i}>{char}</div>)}
                    </span>
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
                        <div className="spinner-wheel" style={{ transform: `rotate(${rotation}deg)` }}>
                           <div className="value-container">{values}</div>
                        </div>
                    </div>
                </div>
                <div className="center-spin-button" 
                    onClick={spinWheel}
                    // STEP 3.2: Background image ko yahan 'style' se dena hai
                    style={{ backgroundImage: `url(${logo})` }}
></div>
            </div>
            
            <h1 className="main-title">WINNER NUMBER</h1>
            
            <div className="winner-blocks-container">
                {WINNER_ID.split("").map((char, i) => (
                    <div key={i} className="cube">
                        <div className="cube-face front">{char}</div>
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