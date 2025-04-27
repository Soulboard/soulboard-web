

export function StepCard({ number, title, description, rotate }) {
    return (
      <div
        className={`bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform dark:text-white dark:dark-glow transition-colors duration-300`}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <div className="text-6xl font-black text-[#0055FF] dark:text-[#FF6B97] mb-3">{number}</div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-lg leading-relaxed dark:text-gray-300">{description}</p>
      </div>
    )
  }