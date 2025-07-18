"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Year } from '@/sanity/sanity-utils';

type Props = {
  years: Year[];
  selectedYear: string;
};

export default function YearSelector({ years, selectedYear }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYearId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newYearId) {
      params.set('year', newYearId);
    } else {
      params.delete('year');
    }
    
    router.push(`/blogs?${params.toString()}`);
  };

  return (
    <div className="mb-8 max-w-xs">
      <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Filter by Year
      </label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={handleYearChange}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="">All Years</option>
        {years.map((year) => (
          <option key={year._id} value={year._id}>
            {year.title} ({year.year})
          </option>
        ))}
      </select>
    </div>
  );
}