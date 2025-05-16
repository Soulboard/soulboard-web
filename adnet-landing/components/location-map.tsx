import { WorldMap } from "./world-map"

function LocationMap() {
    return (
        <div>
          <section className="container mx-auto px-4 py-12 bg-[#fff9d6] dark:bg-[#1a1a22] border-y-[6px] border-black max-w-full transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-center dark:text-white">
            <span className="text-[#0055FF]">2</span> ACTIVE DISPLAYS
          </h2>
          <div className="relative w-full aspect-[16/9] border-[6px] border-black rounded-xl bg-white dark:bg-[#1e1e28] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden dark:dark-glow transition-colors duration-300">
            <div className="absolute inset-0">
              <WorldMap />
            </div>
            <div className="absolute bottom-6 left-6 bg-white dark:bg-[#1e1e28] p-4 border-[4px] border-black rounded-lg transform rotate-1 dark:text-white transition-colors duration-300">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-5 h-5 rounded-full bg-[#FFCC00]"></div>
                <span className="font-bold">Jodhpur</span>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-5 h-5 rounded-full bg-[#0055FF]"></div>
                <span className="font-bold">Jaipur</span>
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>
    )
}

export default LocationMap