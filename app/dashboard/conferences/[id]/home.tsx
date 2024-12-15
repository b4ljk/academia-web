'use client';
// import HomeTab from '../[id]/home';
import { DatePicker } from '@/components/main/DatePicker';
import LoadingOverlay from '@/components/main/LoadingOverlay';
import { InputWrapper } from '@/components/main/TextInput';
import { Button, buttonVariants } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combo-box';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FaqList from '@/components/widget/FaqList';
import ImportanDates from '@/components/widget/ImportantDates';
import { COUNTRY_LIST } from '@/lib/country_list';
import { conferenceType } from '@/lib/schema-types';
import { cn, uploadFileViaXHR } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import TextAreaInput from '@/components/main/TextAreaInput';

export default function HomeTab({
  mutateAsync,
  isPending,
  isButtonDisabled,
  faq,
  important
}: {
  mutateAsync: any;
  isPending: boolean;
  isButtonDisabled?: boolean;
  faq?: boolean;
  important?: boolean;
}) {
  const form = useForm<conferenceType>();
  const { id } = useParams<{ id: string }>();
  const [banner, setBanner] = useState<File>();
  const [currentBanner, setCurrentBanner] = useState<string>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getConference', id],
    queryFn: async () => {
      const response = await fetch(`/api/pub/conference/${id}`, {
        next: {
          revalidate: 0
        }
      });
      return response.json();
    },
    enabled: !!id
  });

  useEffect(() => {
    if (data) {
      const country = COUNTRY_LIST.find(
        (country) => country.name === data.country
      );

      form.reset({ ...data, country: country?.name });
    }
  }, [data]);

  const {
    mutate,
    isPending: defaultLoading,
    isSuccess
  } = useMutation({
    mutationKey: ['make-default', id],
    mutationFn: async () => {
      const response = await toast.promise(
        fetch(`/api/conference/default`, {
          method: 'POST',
          body: JSON.stringify({
            id: id
          })
        }),
        {
          loading: 'Making default...',
          success: 'Conference set as default',
          error: 'Failed to make default'
        }
      );
      if (!response.ok) throw new Error('Failed to make default');
      refetch();
      return response.json();
    }
  });

  console.log(form.formState.errors);

  return (
    <section>
      <form onSubmit={form.handleSubmit(mutateAsync)} className="relative">
        <LoadingOverlay isLoading={isLoading} />

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputWrapper
              label="Name"
              className="col-span-1 lg:col-span-2"
              error={form.formState.errors.name?.message}
            >
              <Input
                {...form.register('name', {
                  required: 'This field is required'
                })}
                placeholder="Enter name of conference"
              />
            </InputWrapper>
            <InputWrapper
              label="Topic"
              className="col-span-1 lg:col-span-2"
              error={form.formState.errors.name?.message}
            >
              <Input
                {...form.register('description', {
                  required: 'This field is required'
                })}
                placeholder="Enter conference topic"
              />
            </InputWrapper>

            <Controller
              control={form.control}
              name="start"
              render={({ field }) => {
                return (
                  <DatePicker
                    label="End Date"
                    value={field.value as any}
                    onChange={(date) =>
                      field.onChange(date?.toLocaleDateString())
                    }
                  />
                );
              }}
            />
            <Controller
              control={form.control}
              name="end"
              render={({ field }) => {
                return (
                  <DatePicker
                    label="End Date"
                    value={field.value as any}
                    onChange={(date) =>
                      field.onChange(date?.toLocaleDateString())
                    }
                  />
                );
              }}
            />

            <Controller
              control={form.control}
              name="country"
              render={({ field }) => (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Country
                  </label>
                  <Combobox
                    // label="Country"
                    className="h-10 mt-1"
                    onChange={(value) => field.onChange(value)}
                    defaultValue={field.value as any}
                    data={COUNTRY_LIST.map((country) => ({
                      value: country.code,
                      label: country.name
                    }))}
                  />
                </div>
              )}
            />
            <InputWrapper
              label="City"
              error={form.formState.errors.city?.message}
            >
              <Input {...form.register('city')} placeholder="Enter city" />
            </InputWrapper>
            <InputWrapper
              className="col-span-1 lg:col-span-4"
              label="Hero Text"
              error={form.formState.errors.hero_text?.message}
            >
              <Textarea
                {...form.register('hero_text', {
                  required: 'This field is required'
                })}
                placeholder="Enter hero text"
              />
            </InputWrapper>

            {important && (
              <div className="col-span-1 lg:col-span-4 items-center">
                <InputWrapper
                  label="Banner"
                  className="w-full"
                  // error={form.formState.errors.hero_text?.message}
                >
                  {/* file input */}
                  <Input
                    type="file"
                    placeholder="Enter banner"
                    accept="image/*"
                    onChange={(e) => {
                      if (e?.target?.files && e.target.files[0]) {
                        setBanner(e.target.files[0]);
                        setCurrentBanner(
                          URL.createObjectURL(e.target.files[0])
                        );
                      }
                    }}
                  />
                </InputWrapper>
                {(data?.banner || currentBanner) && (
                  <div>
                    <Image
                      src={currentBanner || data.banner}
                      width={300}
                      height={300}
                      alt="banner"
                    />
                  </div>
                )}
              </div>
            )}

            {important && (
              <div className="col-span-1 lg:col-span-4 items-center">
                <InputWrapper
                  label="Enter Map Embedding HTML"
                  className="w-full"
                  // error={form.formState.errors.hero_text?.message}
                >
                  {/* file input */}
                  <Textarea
                    {...form.register('map')}
                    placeholder="Enter map embedding html"
                  />
                </InputWrapper>
                {data?.map && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.map
                    }}
                  ></div>
                )}
              </div>
            )}
          </div>
        </div>
      </form>
      {faq && <FaqList />}
      {important && <ImportanDates />}

      <Button
        type="submit"
        className={cn(buttonVariants({ variant: 'default' }))}
        loading={isPending}
        disabled={isPending || isButtonDisabled}
        onClick={async () => {
          // TODO form upload logic i guess

          form.handleSubmit(async (data) => {
            let publicUrl = data.banner;
            if (banner) {
              const response = await fetch(
                `/api/file-put?${new URLSearchParams({ name: banner.name, type: banner.type })}`
              );

              if (!response) throw new Error('Алдаа гарлаа.');
              const json = (await response.json()) as {
                url: string;
                message: string;
              };

              const upload = await toast.promise(
                uploadFileViaXHR({
                  file: banner,
                  setUploadProgress: () => {},
                  uploadUrl: json.url
                }),
                {
                  loading: 'Uploading...',
                  success: 'Upload completed successfully',
                  error: 'Upload failed'
                }
              );

              publicUrl =
                'https://d2fdkqqxx3jf3.cloudfront.net' +
                '/banners/' +
                banner.name;

              form.setValue('banner', publicUrl);
            }
            mutateAsync({ ...data, banner: publicUrl || data.banner });
          })();
        }}
      >
        Save
      </Button>
      {important && (
        <Button
          type="submit"
          className={cn(buttonVariants({ variant: 'secondary' }), 'ml-2')}
          onClick={mutate as any}
          loading={defaultLoading}
          disabled={defaultLoading}
        >
          {data?.isDefault || isSuccess ? 'Already Default' : 'Make default'}
        </Button>
      )}
    </section>
  );
}
