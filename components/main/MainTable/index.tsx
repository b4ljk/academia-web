'use client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { ReactNode } from 'react';
import { AddMember } from './committee-member-adder';

interface MainTableProps {
  columns: ColumnProps[];
  dataSource: any[];
  title?: string;
  className?: string;
  id?: string | number;
}

interface ColumnProps {
  title: string;
  key: string;
  render?: (record: any) => ReactNode;
}

const MainTable = ({
  columns,
  dataSource,
  title,
  className,
  id
}: MainTableProps) => {
  const handleDelete = async () => {
    const response = await fetch(`/api/committee?id=${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center gap-4">
          <p className="text-lg font-semibold">{title}</p>
          <AddMember id={id} />
          <Button
            variant={'destructive'}
            onClick={handleDelete}
            title="Delete committie member"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataSource.map((record, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={cn(
                    index % 2 === 0 ? 'bg-brand-light' : '',
                    'font-bold',
                    className
                  )}
                >
                  {column.render ? column.render(record) : record[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MainTable;
