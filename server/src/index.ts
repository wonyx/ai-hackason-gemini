import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { serve } from '@hono/node-server';
import { streamText } from 'ai';
import dotenv from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';

dotenv.config({ path: ['.env.local', '.env'] });

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || '',
});
const model = google('gemini-2.0-flash-001');

const app = new Hono()
app.use('/api/*', cors())

app.get('/healthz', c => {
    return c.json({ status: 'ok' })
})
app.post('/api/chat', async c => {
    const { messages } = await c.req.json();

    // console.log('messages', messages);
    const result = streamText({
        model,
        messages,
        tools: {
            // client-side tool
            askForConfirmation: {
                description: 'Ask the user for confirmation.',
                parameters: z.object({
                    message: z.string().describe('The message to ask for confirmation.'),
                }),
            },
            getHtmlByActiveTab: {
                description: 'Get the HTML of the active tab. Always ask for confirmation before using this tool.',
                parameters: z.object({}),
            },
            addTasks: {
                description: 'Add a tasks to the user\'s task list.',
                parameters: z.object({
                    description: z.string().describe('The description of the task.'),
                    tasks: z.array(z.object({
                        title: z.string(),
                    })).describe('The tasks to add to the user\'s task list.'),
                }),
            }
        },
    });

    return result.toDataStreamResponse();
})
const port = 8080
console.log(`Server is running on port ${port}`)

serve({
    fetch: app.fetch,
    port,
})
