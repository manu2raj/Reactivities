import { z } from 'zod';

export const activitySchema = z.object({
    title: z.string({required_error: 'Title is required'}).min(1, {message: 'Title is required'})
    // title: z.string().min(10, { message: 'Title is required' })
})

export type activitySchema = z.infer<typeof activitySchema>;