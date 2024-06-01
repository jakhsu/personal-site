import { motion } from "framer-motion";
import { World } from "./aceternityui/globe";


export function TravelGlobe() {
    const globeConfig = {
        pointSize: 1,
        globeColor: "#062056",
        showAtmosphere: true,
        atmosphereColor: "#FFFFFF",
        atmosphereAltitude: 0.1,
        emissive: "#062056",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        polygonColor: "rgba(255,255,255,0.7)",
        ambientLight: "#38bdf8",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 500,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: 25.0330, lng: 121.5654 },
        autoRotate: true,
        autoRotateSpeed: 0.5,
    };
    const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
    const sampleArcs = [
        {
            order: 0,
            startLat: 25.0330,
            startLng: 121.5654,
            endLat: 30.6280,
            endLng: -96.3344,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 1,
            startLat: 30.6280,
            startLng: -96.3344,
            endLat: 37.4848,
            endLng: -122.2281,
            arcAlt: 0.1,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 2,
            startLat: 37.4848,
            startLng: -122.2281,
            endLat: 44.7631,
            endLng: -85.6206,
            arcAlt: 0.1,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 3,
            startLat: 44.7631,
            startLng: -85.6206,
            endLat: 50.7260,
            endLng: -3.5275,
            arcAlt: 0.1,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
        {
            order: 4,
            startLat: 50.7260,
            startLng: -3.5275,
            endLat: 25.0330,
            endLng: 121.5654,
            arcAlt: 0.2,
            color: colors[Math.floor(Math.random() * (colors.length - 1))],
        },
    ];

    return (
        <div className="flex flex-row items-center justify-center py-20 h-screen md:h-auto dark:bg-black bg-white relative w-full">
            <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 1,
                    }}
                    className="div"
                >
                    <h2 className="text-center text-xl md:text-4xl font-bold text-black dark:text-white">
                        Places I've been
                    </h2>
                    <p className="text-center text-base md:text-lg font-normal text-neutral-700 dark:text-neutral-200 max-w-md mt-2 mx-auto">
                        I'm hoping to fill this globe with more places I've been to in the future.
                    </p>
                </motion.div>
                <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-40" />
                <div className="absolute w-full -bottom-20 h-full md:h-full z-10">
                    <World data={sampleArcs} globeConfig={globeConfig} />;
                </div>
            </div>
        </div>
    );
}
