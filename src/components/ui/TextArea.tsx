

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
}: TextAreaProps) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-slate-500 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full rounded-xl border border-slate-200
          bg-white/60 focus:bg-white
          px-3 py-2 text-sm
          shadow-sm h-24 resize-none
          focus:outline-none focus:ring-2 focus:ring-indigo-300
        "
      />
    </div>
  );
}
