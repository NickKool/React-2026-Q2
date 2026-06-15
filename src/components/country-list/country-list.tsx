import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual'; 
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
    const filteredCountries = useMemo(() => {
    return countries
      .filter((c) => {
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        } else {
          const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
          const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
          return sortOrder === 'asc' ? popA - popB : popB - popA;
        }
      });
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]); 
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredCountries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 160, 
    overscan: 5, 
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: '70vh',
        overflow: 'auto', 
        position: 'relative',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }}
    >
      <div
        className={styles.countryList} 
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
          boxSizing: 'border-box', 
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const country = filteredCountries[virtualRow.index];

       return (
            <div
              key={country.id}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <CountryCard
                country={country}
                selectedYear={selectedYear}
                selectedColumns={selectedColumns}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};