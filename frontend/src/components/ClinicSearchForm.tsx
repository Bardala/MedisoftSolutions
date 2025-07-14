import { useState } from "react";
import { ClinicSearchReq } from "../types";

interface ClinicSearchFormProps {
  onSearch: (filters: Omit<ClinicSearchReq, "page" | "size">) => void;
}

export const ClinicSearchForm = ({ onSearch }: ClinicSearchFormProps) => {
  const [filters, setFilters] = useState<
    Omit<ClinicSearchReq, "page" | "size">
  >({
    name: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="clinic-search-form">
      <input
        type="text"
        placeholder="Search by name"
        value={filters.name}
        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Search by phone"
        value={filters.phone}
        onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
      />
      <input
        type="text"
        placeholder="Search by email"
        value={filters.email}
        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
      />
      <button type="submit">Search</button>
    </form>
  );
};
