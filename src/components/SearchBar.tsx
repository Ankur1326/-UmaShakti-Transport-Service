interface SearchBarProps {
    filterQuery: any;
    placeHolder: string;
    fieldName: keyof SearchBarProps['filterQuery']; // Specify the field being updated
    setFilterQuery: (query: any) => void;
    width?: number;
    onSearch?: (searchParams?: any) => void;
}

const SearchBar = ({ filterQuery, setFilterQuery, placeHolder, fieldName, width , onSearch}: SearchBarProps) => {
    const inputValue =
        typeof filterQuery[fieldName] === 'boolean'
            ? filterQuery[fieldName] === true
                ? "true"
                : "false"
            : filterQuery[fieldName] || "";

    return (
        <div className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setFilterQuery({ ...filterQuery, [fieldName]: e.target.value })}
                className="text-sm w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#66B788]/50 dark:bg-gray-800 dark:text-white pr-10"
                style={{ width: width ? `${width}px` : 'auto' }}
                placeholder={placeHolder}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && onSearch) {
                        onSearch();
                    }
                }}

            />
            {inputValue && (
                <button
                    onClick={() => setFilterQuery({ ...filterQuery, [fieldName]: "" })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;
