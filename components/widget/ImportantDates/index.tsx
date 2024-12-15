'use client';
import { importantDatesType } from '@/lib/schema-types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CreateImportantDate from './create';
import DeleteDates from './delete';
import dayjs from 'dayjs';

const ImportanDates = () => {
  const { id } = useParams<{ id: string }>();

  const [list, setList] = useState<importantDatesType[]>([]);

  const { data, refetch } = useQuery<importantDatesType[]>({
    queryKey: ['important-dates', id],
    queryFn: async () => {
      const response = await fetch(`/api/dates?id=${id}`, {
        next: {
          revalidate: 0
        }
      });
      return response.json();
    },
    enabled: !!id
  });

  const createDate = async (dates: importantDatesType) => {
    setList([...list, dates]);
    const response = await toast.promise(
      fetch('/api/dates', {
        method: 'POST',
        body: JSON.stringify({ ...dates, conferenceId: id })
      }),
      {
        loading: 'Creating dates...',
        success: 'Dates created',
        error: 'Failed to create dates'
      }
    );
    if (!response.ok) throw new Error('Failed to create dates');
    refetch();
    return response.json();
  };

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  const deleteDate = async (id: string | number) => {
    setList(list.filter((item) => item.id != id));
    const response = await toast.promise(
      fetch(`/api/dates?id=${id}`, {
        method: 'DELETE'
      }),
      {
        loading: 'Deleting date...',
        success: 'Date deleted',
        error: 'Failed to delete date'
      }
    );
    if (!response.ok) {
      throw new Error('Failed to delete date');
    }
  };

  const editDate = async (date: importantDatesType) => {
    setList(list.map((item) => (item.id == date.id ? date : item)));
    const response = await toast.promise(
      fetch('/api/dates', {
        method: 'PUT',
        body: JSON.stringify({ ...date, conferenceId: id })
      }),
      {
        loading: 'Editing date...',
        success: 'Date edited',
        error: 'Failed to edit date'
      }
    );

    refetch();
    return response.json();
  };

  return (
    <div className="space-y-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium text-muted-foreground">
          Important Dates
        </label>
        <CreateImportantDate onCreate={createDate} />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider text-right"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {list?.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {dayjs(item.date).format('MMM D, YYYY')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <CreateImportantDate
                  id={item.id}
                  onEdit={editDate}
                  initialValue={item}
                />
                <DeleteDates id={item.id} onDelete={deleteDate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImportanDates;
