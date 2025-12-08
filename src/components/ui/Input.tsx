
type InputProps = {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
};

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-slate-500 mb-1">{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className="
          w-full rounded-xl border border-white/40
          bg-white/40 backdrop-blur-xl
          px-3 py-2 text-sm text-slate-700
          shadow-[0_4px_20px_rgba(15,23,42,0.08)]
          focus:outline-none focus:ring-2 focus:ring-indigo-300
        "
      />
    </div>
  );
}
