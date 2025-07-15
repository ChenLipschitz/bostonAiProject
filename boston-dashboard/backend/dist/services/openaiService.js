"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processQuestion = processQuestion;
exports.handleAmbiguousQuestion = handleAmbiguousQuestion;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
// Initialize OpenAI
const apiKey = process.env.OPENAI_API_KEY;
console.log("API Key:", process.env.OPENAI_API_KEY);
const isValidApiKey = apiKey && !apiKey.includes('your-actual-openai-api-key-goes-here') && !apiKey.includes('your-openai-api-key') && apiKey.startsWith('sk-') && apiKey.length > 20;
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// MongoDB connection
let logsCollection;
function getMongoCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!logsCollection) {
            const client = new mongodb_1.MongoClient(process.env.MONGODB_URI || '');
            yield client.connect();
            const db = client.db();
            logsCollection = db.collection(process.env.COLLECTION_NAME || 'logs');
        }
        return logsCollection;
    });
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
function generateMongoQuery(userQuestion) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield openai.chat.completions.create({
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
                temperature: 0,
            });
            let queryText = ((_a = response.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.trim()) || '';
            // Remove accidental backticks or markdown wrapping if present
            if (queryText.startsWith('```')) {
                queryText = queryText.replace(/```json|```/g, '').trim();
            }
            // Ensure it's a valid JSON string (will throw if invalid)
            JSON.parse(queryText);
            return queryText;
        }
        catch (error) {
            console.error('Error generating MongoDB query:', error);
            throw new Error('Failed to generate database query');
        }
    });
}
function fixMongoPipelineString(input) {
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
function executeMongoQuery(queryString) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = yield getMongoCollection();
            console.log("queryString");
            console.log(fixMongoPipelineString(queryString));
            const query = JSON.parse(fixMongoPipelineString(queryString))[0];
            console.log("query");
            console.log(query);
            console.log(query.aggregate);
            console.log('aggregate' in query);
            // Determine the type of query and execute accordingly
            if ('aggregate' in query) {
                console.log("hhhhhhhhhhhhhhh");
                const pipeline = query === null || query === void 0 ? void 0 : query.pipeline;
                return yield collection.aggregate(pipeline).toArray();
            }
            else if (query.find) {
                const findQuery = query.find.query || {};
                const projection = query.find.projection || {};
                const sort = query.find.sort || {};
                const limit = query.find.limit || 0;
                return yield collection.find(findQuery, { projection }).sort(sort).limit(limit).toArray();
            }
            else if (query.count) {
                return yield collection.countDocuments(query.count);
            }
            else {
                // Default to a simple find if the query structure is not recognized
                return yield collection.find(query).limit(20).toArray();
            }
        }
        catch (error) {
            console.error('Error executing MongoDB query:', error);
            throw new Error('Failed to execute database query');
        }
    });
}
// Function to detect if results should be visualized as a chart
function shouldCreateChart(userQuestion, results) {
    const chartKeywords = [
        'average', 'total', 'count', 'sum', 'per client', 'by client', 'comparison',
        'compare', 'distribution', 'breakdown', 'top', 'bottom', 'ranking', 'trend'
    ];
    const questionLower = userQuestion.toLowerCase();
    const hasChartKeywords = chartKeywords.some(keyword => questionLower.includes(keyword));
    console.log('hasChartKeywords', hasChartKeywords);
    // Check if results are suitable for charting (array of objects with numeric values)
    const isChartableData = Array.isArray(results) &&
        results.length > 0 &&
        results.length <= 100 && // Reasonable number for visualization
        typeof results[0] === 'object';
    console.log('isChartableData', isChartableData);
    return hasChartKeywords && isChartableData;
}
// Function to generate chart data from query results
function generateChartData(userQuestion, results) {
    if (!Array.isArray(results) || results.length === 0) {
        return null;
    }
    const firstResult = results[0];
    const keys = Object.keys(firstResult);
    // Find the label field (usually _id, Client, or similar)
    const labelField = keys.find(key => key === '_id' ||
        key.toLowerCase().includes('client') ||
        key.toLowerCase().includes('name') ||
        key.toLowerCase().includes('source')) || keys[0];
    // Find the numeric field for the chart
    const numericField = keys.find(key => key !== labelField &&
        typeof firstResult[key] === 'number');
    if (!numericField) {
        return null;
    }
    const labels = results.map(item => String(item[labelField]));
    const data = results.map(item => Number(item[numericField]) || 0);
    // Determine chart type based on question and data
    let chartType = 'bar';
    const questionLower = userQuestion.toLowerCase();
    if (questionLower.includes('distribution') || questionLower.includes('breakdown')) {
        chartType = 'pie';
    }
    else if (questionLower.includes('trend') || questionLower.includes('over time')) {
        chartType = 'line';
    }
    // Generate colors
    const colors = [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(199, 199, 199, 0.6)',
        'rgba(83, 102, 255, 0.6)',
        'rgba(255, 99, 255, 0.6)',
        'rgba(99, 255, 132, 0.6)'
    ];
    const borderColors = colors.map(color => color.replace('0.6', '1'));
    return {
        type: chartType,
        title: `${numericField} by ${labelField}`,
        labels,
        datasets: [{
                label: numericField,
                data,
                backgroundColor: chartType === 'pie' ? colors.slice(0, data.length) : colors[0],
                borderColor: chartType === 'pie' ? borderColors.slice(0, data.length) : borderColors[0],
                borderWidth: 1
            }]
    };
}
// Function to format query results into a natural language response
function formatQueryResults(userQuestion, results) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Question: ${userQuestion}\n\nResults from MongoDB: ${JSON.stringify(results, null, 2)}\n\nPlease format these results into a helpful response. Use markdown tables for tabular data and provide a clear summary.` }
                ],
                temperature: 0,
            });
            const textResponse = ((_a = response.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.trim()) || 'No response generated';
            // Check if we should create a chart
            let chartData = null;
            console.log(shouldCreateChart(userQuestion, results));
            if (shouldCreateChart(userQuestion, results)) {
                chartData = generateChartData(userQuestion, results);
            }
            return {
                response: textResponse,
                chartData
            };
        }
        catch (error) {
            console.error('Error formatting query results:', error);
            throw new Error('Failed to format query results');
        }
    });
}
// Main function to process a user question
function processQuestion(userQuestion) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if API key is valid
        if (!isValidApiKey) {
            // Return mock data for demonstration when API key is not configured
            if (userQuestion.toLowerCase().includes('average') && userQuestion.toLowerCase().includes('total_jobs_sent_to_index')) {
                const mockResults = [
                    { _id: "Deal68", averageJobsSentToIndex: 124029.16 },
                    { _id: "Deal35", averageJobsSentToIndex: 0.36 },
                    { _id: "Deal19", averageJobsSentToIndex: 0 },
                    { _id: "Deal62", averageJobsSentToIndex: 9450.51 },
                    { _id: "Deal5", averageJobsSentToIndex: 2125.36 },
                    { _id: "Deal41", averageJobsSentToIndex: 15906.29 },
                    { _id: "Deal26", averageJobsSentToIndex: 1474.59 },
                    { _id: "Deal64", averageJobsSentToIndex: 44046.73 },
                    { _id: "Deal74", averageJobsSentToIndex: 358505.71 },
                    { _id: "Deal44", averageJobsSentToIndex: 831.01 }
                ];
                const chartData = generateChartData(userQuestion, mockResults);
                return {
                    response: `Here are the average TOTAL_JOBS_SENT_TO_INDEX values by client:

| Client | Average Jobs Sent To Index |
|--------|---------------------------|
| Deal68 | 124,029.16 |
| Deal35 | 0.36 |
| Deal19 | 0.00 |
| Deal62 | 9,450.51 |
| Deal5 | 2,125.36 |
| Deal41 | 15,906.29 |
| Deal26 | 1,474.59 |
| Deal64 | 44,046.73 |
| Deal74 | 358,505.71 |
| Deal44 | 831.01 |

The data shows significant variation across clients, with Deal74 having the highest average (358,505.71) and Deal19 having no jobs sent to index.`,
                    chartData
                };
            }
            return { response: "The OpenAI API key is not configured. Please update the OPENAI_API_KEY in the .env file with a valid API key. However, I can show you a demo with sample data - try asking: 'Show me average TOTAL_JOBS_SENT_TO_INDEX by client'" };
        }
        try {
            // Step 1: Generate MongoDB query
            // console.log(userQuestion);
            const queryString = yield generateMongoQuery(userQuestion);
            console.log(queryString);
            // Step 2: Execute the query
            const results = yield executeMongoQuery(queryString);
            // console.log("results");
            // console.log(results);
            // Step 3: Format the results into a natural language response
            const formattedResult = yield formatQueryResults(userQuestion, results);
            return formattedResult;
        }
        catch (error) {
            console.error('Error processing question:', error);
            // Handle errors gracefully
            if (error.message.includes('Failed to generate database query')) {
                return { response: "I'm sorry, I couldn't understand how to query the database for that question. Could you rephrase it or provide more details?" };
            }
            else if (error.message.includes('Failed to execute database query')) {
                return { response: "I understood your question, but encountered an error when querying the database. This might be due to invalid query syntax or missing data." };
            }
            else {
                return { response: "I'm sorry, I encountered an unexpected error while processing your question. Please try again with a different question." };
            }
        }
    });
}
// Function to handle ambiguous or unsupported questions
function handleAmbiguousQuestion(userQuestion) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // Check if API key is valid
        if (!isValidApiKey) {
            return "The OpenAI API key is not configured. Please update the OPENAI_API_KEY in the .env file with a valid API key.";
        }
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `${systemPrompt}\n\nYou are evaluating if a question can be answered with the available data. If it's ambiguous, explain why and ask for clarification. If it's unsupported, explain why and suggest alternative questions.` },
                    { role: "user", content: userQuestion }
                ],
                temperature: 0,
            });
            return ((_a = response.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.trim()) || 'I need more information to answer that question.';
        }
        catch (error) {
            console.error('Error handling ambiguous question:', error);
            return "I'm having trouble understanding your question. Could you rephrase it or provide more details?";
        }
    });
}
