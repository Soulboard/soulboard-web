import Image from "next/image";
import { MapPin } from "lucide-react";

// Realistic locations for Jodhpur and Jaipur (approximate positions on the map)
const mapPins = [
  { x: 60.8, y: 36.5 }, // Jodhpur
  { x: 61.2, y: 35.8 },  // Jaipur
];

export function WorldMap() {
  return (
    <div className="relative w-full h-full bg-[#f0f0f0] dark:bg-[#252530]">
      <Image
        src="/simplified-blue-world-map.png"
        alt="World Map"
        fill
        className="object-cover dark:opacity-70 dark:contrast-125 dark:brightness-75"
      />
      {/* Map Pins */}
      {mapPins.map((pin, index) => (
        <div
          key={index}
          className="absolute"
          style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
        >
          <MapPin
            className={`w-8 h-8 text-[#FFCC00] dark:text-[#FF6B97] animate-pulse cursor-pointer hover:scale-125 transition-transform`}
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        </div>
      ))}
    </div>
  );
}
