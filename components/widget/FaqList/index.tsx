'use client';
import { faqType } from '@/lib/schema-types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CreateFaq from './create';
import DeleteFaq from './delete';

const FaqList = () => {
  const { id } = useParams<{ id: string }>();

  const [list, setList] = useState<faqType[]>([]);

  const { data, refetch } = useQuery<faqType[]>({
    queryKey: ['faq', id],
    queryFn: async () => {
      const response = await fetch(`/api/faq?id=${id}`, {
        next: {
          revalidate: 0
        }
      });
      return response.json();
    },
    enabled: !!id
  });

  const createFaq = async (faq: faqType) => {
    setList([...list, faq]);
    const response = await fetch('/api/faq', {
      method: 'POST',
      body: JSON.stringify({ ...faq, conferenceId: id })
    });
    if (!response.ok) throw new Error('Failed to create faq');
    toast.success('FAQ created');
    refetch();
    return response.json();
  };

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  const deleteFaq = async (id: string | number) => {
    setList(list.filter((item) => item.id != id));
    const response = await fetch(`/api/faq?id=${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      toast.error('Failed to delete faq');
      throw new Error('Failed to delete faq');
    }
    toast.success('FAQ deleted');
  };

  const editFaq = async (faq: faqType) => {
    setList(list.map((item) => (item.id == faq.id ? faq : item)));
    const response = await fetch('/api/faq', {
      method: 'PUT',
      body: JSON.stringify({ ...faq, conferenceId: id })
    });
    if (!response.ok) {
      toast.error('Failed to edit faq');
      throw new Error('Failed to edit faq');
    }
    toast.success('FAQ edited');
    refetch();
    return response.json();
  };

  return (
    <div className="space-y-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium text-muted-foreground">FAQ</label>
        <CreateFaq onCreate={createFaq} />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Question
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Answer
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
                <div className="text-sm text-gray-900">{item.question}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{item.answer}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <CreateFaq id={item.id} onEdit={editFaq} initialValue={item} />
                <DeleteFaq id={item.id} onDelete={deleteFaq} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FaqList;
