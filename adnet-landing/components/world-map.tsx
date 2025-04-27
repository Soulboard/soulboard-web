import Image from "next/image"
import { MapPin } from "lucide-react"

const mapPins = [
    { x: 20, y: 30 },
    { x: 30, y: 40 },
    { x: 50, y: 35 },
    { x: 70, y: 25 },
    { x: 80, y: 45 },
    { x: 40, y: 60 },
    { x: 60, y: 70 },
    { x: 25, y: 50 },
    { x: 75, y: 60 },
    { x: 55, y: 20 },
  ]

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
          <MapPin
            key={index}
            className={`absolute w-8 h-8 text-[#FFCC00] dark:text-[#FF6B97] animate-pulse cursor-pointer hover:scale-125 transition-transform`}
            style={{
              top: `${pin.y}%`,
              left: `${pin.x}%`,
              animationDelay: `${index * 0.2}s`,
            }}
          />
        ))}
      </div>
    )
  }