import { formatDateTimeYMDHI, formatDateTimeYMDHIS } from '@/lib/utils';
import { Dataset } from '@/pages/api/dataset';
import { ChatBot } from '@/types/tables';
import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

type ResponseWithFlush = NextApiResponse & {
    flush?: () => void;
};

export default async function handler(
    req: NextApiRequest,
    res: ResponseWithFlush
) {
    // Enable streaming for progress updates
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const { branches, message, oldMessages, ChatBotID } = req.body;

        // Send progress update for config fetch
        res.write('data: ' + JSON.stringify({ status: 'progress', message: 'Yapılandırma alınıyor...' }) + '\n\n');
        res.flush?.();

        const instance = Dataset.getInstance();
        const query = `SELECT TOP 1 ChatbotRole, ChatbotContent FROM dm_ChatBot WHERE ChatBotID = @ChatBotID`;
        
        try {
            const config = await instance.executeQuery<ChatBot[]>({
                query,
                req,
                parameters: {
                    ChatBotID: ChatBotID.toString()
                }
            });

            const chatbotConfig = config[0];
            if (!chatbotConfig) {
                console.error('No chatbot config found for ID:', ChatBotID);
                return res.status(404).json({ error: 'Chatbot configuration not found' });
            }

            // Send progress update for AI processing
            res.write('data: ' + JSON.stringify({ status: 'progress', message: 'Sorgunuz AI tarafından işleniyor...' }) + '\n\n');
            res.flush?.();

            const parameters = {
                BranchID: branches
            };

            // Format system message and chat history
            const systemContent = `${chatbotConfig.ChatbotContent}\n\nSQL Parametreleri: ${JSON.stringify(parameters)}\n\nÖNEMLİ NOT: BranchID parametresi "${parameters.BranchID}" olarak geldi. BranchID "all" olduğunda WHERE koşuluna BranchID eklenmemelidir.`;

            // Format chat history
            let formattedHistory = [];
            
            if (oldMessages && oldMessages.length > 0) {
                // Combine system content with first user message
                formattedHistory = oldMessages.map((msg, i) => ({
                    role: i % 2 === 0 ? "user" : "model",
                    parts: [{ 
                        text: i === 0 ? `${systemContent}\n\nUser Query: ${msg}` : msg 
                    }]
                }));
            } else {
                // If no history, create initial user message with system content
                formattedHistory = [{
                    role: "user",
                    parts: [{ 
                        text: `${systemContent}\n\nUser Query: ${message}` 
                    }]
                }];
            }

            // Debug logging
            console.log('Formatted History:', JSON.stringify(formattedHistory, null, 2));

            try {
                // Initialize chat with history
                const chat = model.startChat({
                    history: formattedHistory
                });

                // Send progress update for response generation
                res.write('data: ' + JSON.stringify({ status: 'progress', message: 'Yanıt oluşturuluyor...' }) + '\n\n');
                res.flush?.();

                // Send message and get streaming response
                const result = await chat.sendMessageStream(message);
                
                let aiResponse = '';
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    aiResponse += chunkText;
                }

                // Handle SQL responses
                if (aiResponse.trim().includes('ONLY_SQL')) {
                    const sqlQuery = aiResponse
                        .replace('ONLY_SQL', '')
                        .replace(/```sql/g, '')
                        .replace(/```/g, '')
                        .replace(/\\n/g, '\n')
                        .trim();

                    // Debug logging
                    console.log('Executing SQL Query:', sqlQuery);

                    // Send the complete SQL query as a single chunk
                    res.write('data: ' + JSON.stringify({ 
                        status: 'progress', 
                        content: sqlQuery
                    }) + '\n\n');
                    res.flush?.();

                    // Execute SQL query
                    res.write('data: ' + JSON.stringify({ status: 'progress', message: 'Veritabanı sorgusu çalıştırılıyor...' }) + '\n\n');
                    res.flush?.();

                    const result = await instance.executeQuery<any[]>({
                        query: sqlQuery,
                        req
                    });

                    // Send query results
                    res.write('data: ' + JSON.stringify({ status: 'complete', data: result }) + '\n\n');
                    res.flush?.();
                } else {
                    // For non-SQL responses, stream each chunk
                    const chunks = aiResponse.split('\n');
                    for (const chunk of chunks) {
                        if (chunk.trim()) {
                            res.write('data: ' + JSON.stringify({ 
                                status: 'progress', 
                                content: chunk + '\n'
                            }) + '\n\n');
                            res.flush?.();
                        }
                    }
                    res.write('data: ' + JSON.stringify({ status: 'complete', data: aiResponse }) + '\n\n');
                }

                res.end();

            } catch (error) {
                console.error('AI processing error:', error);
                res.write('data: ' + JSON.stringify({ 
                    status: 'error',
                    error: error instanceof Error ? error.message : 'AI processing error'
                }) + '\n\n');
                res.flush?.();
                res.end();
            }
        } catch (error) {
            console.error('Error fetching chatbot config:', error);
            res.write('data: ' + JSON.stringify({ 
                status: 'error',
                error: error instanceof Error ? error.message : 'Error fetching chatbot config'
            }) + '\n\n');
            res.flush?.();
            res.end();
        }

    } catch (error) {
        console.error('Handler error:', error);
        if (!res.headersSent) {
            res.write('data: ' + JSON.stringify({ 
                status: 'error',
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            }) + '\n\n');
            res.flush?.();
            res.end();
        }
    }
}