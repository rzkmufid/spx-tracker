import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

const formSchema = z.object({
  trackingNumber: z.string()
    .min(10, {
      message: 'Tracking number must be at least 10 characters.',
    })
    .refine((val) => val.startsWith('SPXID'), {
      message: 'Tracking number must start with SPXID',
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface TrackingFormProps {
  onSubmit: (trackingNumber: string) => void;
  isLoading: boolean;
}

export default function TrackingForm({ onSubmit, isLoading }: TrackingFormProps) {
  const [examples] = useState([
    'SPXID012345678901',
    'SPXID098765432109'
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackingNumber: '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    let trackingNumber = values.trackingNumber.trim().toUpperCase();
    onSubmit(trackingNumber);
  };

  const handleExampleClick = (example: string) => {
    form.setValue('trackingNumber', example);
    handleSubmit({ trackingNumber: example });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="trackingNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter tracking number (SPXID...)" 
                      className="flex-1" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        field.onChange(value);
                      }}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">Track</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <Button 
              key={example} 
              variant="outline" 
              size="sm" 
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}