import React, { useState } from "react";
import "../styles/searchComponent.css";

interface SearchComponentProps<T> {
  data: T[];
  searchKey: keyof T;
  displayKey: keyof T;
  placeholder: string;
  onSelect: (item: T) => void;
}

const SearchComponent = <T extends object>({
  data,
  searchKey,
  displayKey,
  placeholder,
  onSelect,
}: SearchComponentProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showList, setShowList] = useState(false);

  // Filter data based on search term and remove duplicates
  const filteredData = data
    ?.filter((item) =>
      String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase()),
    )
    ?.reduce((uniqueItems, item) => {
      if (
        !uniqueItems.some(
          (uniqueItem) => uniqueItem[displayKey] === item[displayKey],
        )
      ) {
        uniqueItems.push(item);
      }
      return uniqueItems;
    }, [] as T[]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 200)}
      />
      {showList && (
        <ul className="search-list visible">
          {filteredData.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(item);
                setSearchTerm(String(item[displayKey]));
                setShowList(false);
              }}
            >
              {String(item[displayKey])}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchComponent;
