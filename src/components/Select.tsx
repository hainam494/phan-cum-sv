function Select({ value, handle, options }: { value: number , handle: (event: React.ChangeEvent<HTMLSelectElement>) => void, options: number[] }) {
    return (  
        <select 
            className="w-full px-3 py-2 border rounded-md bg-gray-50"
            onChange={handle}
            value={value}
            >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export default Select;