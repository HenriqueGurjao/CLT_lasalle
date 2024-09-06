import { useContext } from 'react';
import { TableContext } from '@/contexts/TableProvider';

export function useTable() {
  const context = useContext(TableContext);
  if (context === null) {
    throw new Error('useTable deve ser usado dentro de um TableProvider');
  }
  return context;
}
