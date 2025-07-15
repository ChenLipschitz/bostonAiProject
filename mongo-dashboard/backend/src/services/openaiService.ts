import OpenAI from 'openai';
import dotenv from 'dotenv';
import { MongoClient, Collection } from 'mongodb';

dotenv.config();

// Initialize OpenAI
const apiKey = process.env.OPENAI_API_KEY;
console.log("API Key:", process.env.OPENAI_API_KEY);

const isValidApiKey = apiKey && !apiKey.includes('your-openai-api-key');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// MongoDB connection
let logsCollection: Collection;

async function getMongoCollection() {
  if (!logsCollection) {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    const db = client.db();
    logsCollection = db.collection(process.env.COLLECTION_NAME || 'logs');
  }
  return logsCollection;
}

// System prompt that describes the data structure and capabilities
const systemPrompt = `
You are an AI assistant for a MongoDB logs dashboard. You help users analyze log data by converting natural language questions into MongoDB queries.

The MongoDB collection is called "logs", and documents follow this structure:
{
  "_id": "ObjectId",
  "country_code": "US",
  "currency_code": "USD",
  "progress": {
    "SWITCH_INDEX": true,
    "TOTAL_RECORDS_IN_FEED": 16493,
    "TOTAL_JOBS_FAIL_INDEXED": 1521,
    "TOTAL_JOBS_IN_FEED": 13705,
    "TOTAL_JOBS_SENT_TO_ENRICH": 20,
    "TOTAL_JOBS_DONT_HAVE_METADATA": 2540,
    "TOTAL_JOBS_DONT_HAVE_METADATA_V2": 2568,
    "TOTAL_JOBS_SENT_TO_INDEX": 13686
  },
  "status": "completed",
  "timestamp": "2025-07-11T05:16:20.626Z",
  "transactionSourceName": "Deal4",
  "noCoordinatesCount": 160,
  "recordCount": 11118,
  "uniqueRefNumberCount": 9253
}

You can:
1. Perform filters, aggregations, and calculations
2. Use $match, $group, $project, etc.
3. Include ISO 8601 format dates
4. Always wrap aggregation pipelines inside an object with "aggregate": "logs", and "pipeline": [ ... ]

Only return a single valid JSON string that can be parsed using JSON.parse(). No extra text, no Markdown, no code blocks.
`;

async function generateMongoQuery(userQuestion: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate a MongoDB query to answer this question: "${userQuestion}". 
Return ONLY the query as a single valid JSON object that can be parsed with JSON.parse(). 
If the query requires aggregation, structure it like this:

{
  "aggregate": "logs",
  "pipeline": [
    { ... }, 
    { ... }
  ]
}

Do not include code blocks or explanations. Use ISO 8601 strings for dates.
Ensure the JSON uses double quotes for all keys and values.`
        }
      ],
      temperature: 0.2,
    });

    let queryText = response.choices[0].message.content?.trim() || '';

    // Remove accidental backticks or markdown wrapping if present
    if (queryText.startsWith('```')) {
      queryText = queryText.replace(/```json|```/g, '').trim();
    }

    // Ensure it's a valid JSON string (will throw if invalid)
    JSON.parse(queryText);

    return queryText;
  } catch (error) {
    console.error('Error generating MongoDB query:', error);
    throw new Error('Failed to generate database query');
  }
}


function fixMongoPipelineString(input: string): string {
  const withArray = `[${input}]`;
  const withDoubleQuotes = withArray.replace(/'/g, '"');
  return withDoubleQuotes;
}

// const rawPipelineString = `{ 
//   '$match': { 
//     'timestamp': { 
//       '$gte': '2025-06-01T00:00:00.000Z', 
//       '$lt': '2025-07-01T00:00:00.000Z' 
//     } 
//   } 
// }, 
// { 
//   '$group': { 
//     '_id': '$transactionSourceName', 
//     'averageJobsSentToIndex': { 
//       '$avg': '$progress.TOTAL_JOBS_SENT_TO_INDEX' 
//     } 
//   } 
// }`;

// const fixed = fixMongoPipelineString(rawPipelineString);
// const parsed = JSON.parse(fixed);





// Function to execute MongoDB query and return results
async function executeMongoQuery(queryString: string): Promise<any> {
  try {
    const collection = await getMongoCollection();
    console.log("queryString")
    console.log(fixMongoPipelineString(queryString))
    const query = JSON.parse(fixMongoPipelineString(queryString))[0];
    
    console.log("query")
    console.log(query)
    console.log(query.aggregate)
    console.log('aggregate' in query)
    // Determine the type of query and execute accordingly
    if ('aggregate' in query) {
      console.log("hhhhhhhhhhhhhhh");
      const pipeline = query?.pipeline;
      return await collection.aggregate(pipeline).toArray();
    } else if (query.find) {
      const findQuery = query.find.query || {};
      const projection = query.find.projection || {};
      const sort = query.find.sort || {};
      const limit = query.find.limit || 0;
      
      return await collection.find(findQuery, { projection }).sort(sort).limit(limit).toArray();
    } else if (query.count) {
      return await collection.countDocuments(query.count);
    } else {
      // Default to a simple find if the query structure is not recognized
      return await collection.find(query).limit(20).toArray();
    }
  } catch (error) {
    console.error('Error executing MongoDB query:', error);
    throw new Error('Failed to execute database query');
  }
}

// Function to format query results into a natural language response
async function formatQueryResults(userQuestion: string, results: any): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Question: ${userQuestion}\n\nResults from MongoDB: ${JSON.stringify(results, null, 2)}\n\nPlease format these results into a helpful response. Use markdown tables for tabular data and suggest charts when appropriate.` }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim() || 'No response generated';
  } catch (error) {
    console.error('Error formatting query results:', error);
    throw new Error('Failed to format query results');
  }
}

// Main function to process a user question
export async function processQuestion(userQuestion: string): Promise<string> {
  // Check if API key is valid
  if (!isValidApiKey) {
    return "The OpenAI API key is not configured. Please update the OPENAI_API_KEY in the .env file with a valid API key.";
  }

  try {
    // Step 1: Generate MongoDB query
    // console.log(userQuestion);
    const queryString = await generateMongoQuery(userQuestion);
    
    console.log(queryString);

    // Step 2: Execute the query
    const results = await executeMongoQuery(queryString);
    
    // console.log("results");
    // console.log(results);

    // Step 3: Format the results into a natural language response
    const response = await formatQueryResults(userQuestion, results);
    
    return response;
  } catch (error: any) {
    console.error('Error processing question:', error);
    
    // Handle errors gracefully
    if (error.message.includes('Failed to generate database query')) {
      return "I'm sorry, I couldn't understand how to query the database for that question. Could you rephrase it or provide more details?";
    } else if (error.message.includes('Failed to execute database query')) {
      return "I understood your question, but encountered an error when querying the database. This might be due to invalid query syntax or missing data.";
    } else {
      return "I'm sorry, I encountered an unexpected error while processing your question. Please try again with a different question.";
    }
  }
}

// Function to handle ambiguous or unsupported questions
export async function handleAmbiguousQuestion(userQuestion: string): Promise<string> {
  // Check if API key is valid
  if (!isValidApiKey) {
    return "The OpenAI API key is not configured. Please update the OPENAI_API_KEY in the .env file with a valid API key.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `${systemPrompt}\n\nYou are evaluating if a question can be answered with the available data. If it's ambiguous, explain why and ask for clarification. If it's unsupported, explain why and suggest alternative questions.` },
        { role: "user", content: userQuestion }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim() || 'I need more information to answer that question.';
  } catch (error) {
    console.error('Error handling ambiguous question:', error);
    return "I'm having trouble understanding your question. Could you rephrase it or provide more details?";
  }
}