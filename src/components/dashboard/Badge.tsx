// Define a type for the keys of text_to_color
type ColorKey = keyof typeof text_to_color;

const text_to_color = {
    "p1": "bg-red-700",
    "p2": "bg-blue-700",
    "p3": "bg-green-700",
    "inactive": "bg-slate-500",
    "active": "bg-green-500"
}

export default function Badge({type, value}: {type: string, value: string}) {
    const getColorClass = (value: string, type: string) => {
        if (type === "phase") {
            return "bg-yellow-500";
        }
        if (type === "launch_date") {
            return "bg-orange-500";
        }
        return text_to_color[value.toLowerCase() as ColorKey] || "default-color-class"; // Fallback color class
    };

    return (
        <span className={`rounded px-2.5 py-0.5 text-sm max-sm:text-xs font-medium text-white ${getColorClass(value, type)}`}>
            {value}
        </span>
    );
}
  
