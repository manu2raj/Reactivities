import { z } from 'zod';

const requiredString = (fieldName: string) => z
    .string({required_error: `${fieldName} is required`})
    .min(1, {message: `${fieldName} is required`})

export const activitySchema = z.object({
    title: requiredString('Title'),
    description: requiredString('Description'),
    category: requiredString('Category'),
    date: requiredString('Date'),
    city: requiredString('City'),
    venue: requiredString('Venue'),
    // title: z.string().min(10, { message: 'Title is required' })
})

export type ActivitySchema = z.infer<typeof activitySchema>;