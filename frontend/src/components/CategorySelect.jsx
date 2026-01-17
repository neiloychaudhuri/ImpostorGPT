export default function CategorySelect({ categories, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full glass-card text-white text-xl font-semibold py-4 px-6 rounded-2xl border-2 border-white/20 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-[#FDB927]/30 transition-all"
    >
      <option value="" className="bg-black text-white">Select a category</option>
      {categories.map((cat) => (
        <option key={cat.name} value={cat.name} className="bg-black text-white">
          {cat.name}
        </option>
      ))}
    </select>
  )
}

