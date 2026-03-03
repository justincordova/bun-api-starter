# Bun API Starter

A minimal backend template built with Bun, Express, and TypeScript.

## Features

- Bun runtime for fast performance
- Security middleware (Helmet, CORS, Rate Limiting, Compression)
- Structured logging with Winston and Morgan
- ESLint & TypeScript strict mode
- Error handling middleware
- Graceful shutdown
- Request ID tracking for debugging
- Docker support for easy deployment

## Dependencies

### Runtime Dependencies
- `express` - Web framework
- `compression` - Gzip compression middleware
- `cors` - Cross-Origin Resource Sharing middleware
- `helmet` - HTTP security headers
- `morgan` - HTTP request logger
- `winston` - Structured logging
- `rate-limiter-flexible` - Rate limiting

### Development Dependencies
- `typescript` - TypeScript compiler
- `eslint` - Linting
- `@eslint/js` - ESLint JavaScript plugin
- `typescript-eslint` - TypeScript ESLint rules
- `@types/bun` - Bun type definitions
- `@types/express` - Express type definitions
- `@types/compression` - Compression type definitions
- `@types/cors` - CORS type definitions
- `@types/morgan` - Morgan type definitions

## Getting Started

### Installation

```bash
git clone git@github.com:justincordova/bun-api-starter.git
cd bun-api-starter
bun install
```

> **Important:** Run `bun update` after cloning this repository to ensure all dependencies are up to date.

### Environment Setup

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

### Development

```bash
bun run dev
```

### Building

```bash
bun run build
```

### Production

```bash
bun start
```

### Linting

```bash
bun run lint
```

### Docker

```bash
# Build and run with Docker
docker compose up -d

# View logs
docker compose logs -f

# Stop containers
docker compose down
```

## Project Structure

```
.
├── index.ts                        # Application entry point with graceful shutdown
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── eslint.config.ts                # ESLint configuration
├── docker-compose.yml              # Docker Compose configuration
├── Dockerfile                      # Docker image configuration
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── .dockerignore                  # Docker ignore rules
├── LICENSE                        # MIT License
├── README.md                      # Documentation
├── src/
│   ├── app.ts                     # Express app configuration and middleware setup
│   ├── config/
│   │   └── env.ts                 # Environment variables
│   ├── lib/
│   │   └── logger.ts              # Winston logger configuration
│   ├── middleware/
│   │   ├── requestId.ts            # Request ID tracking middleware
│   │   ├── error/                 # Error handling middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── notFoundHandler.ts
│   │   └── security/              # Security middleware
│   │       ├── corsConfig.ts
│   │       ├── helmetConfig.ts
│   │       ├── compressionConfig.ts
│   │       ├── morganConfig.ts
│   │       └── rateLimiterConfig.ts
│   ├── modules/                   # Feature modules
│   │   └── example/               # Example module demonstrating CRUD pattern
│   │       ├── controllers.ts      # Request/response handling
│   │       ├── services.ts         # Business logic
│   │       └── routes.ts          # Express router configuration
│   ├── tests/                     # Test files
│   │   └── modules/
│   │       └── example.test.ts
│   ├── constants/                 # App constants
│   │   └── index.ts              # HTTP status codes and constants
│   └── utils/                     # Utility functions
│       └── response.ts            # HTTP response helpers
```

## Module Pattern

Each module follows this structure:

- **controllers.ts**: Request/response handling
  - Receives data from routes
  - Calls services for business logic
  - Sends appropriate HTTP responses
  - Uses TSDoc for function documentation

- **services.ts**: Business logic
  - Contains core business rules
  - Manipulates data (in-memory or database)
  - Returns typed data to controllers
  - Uses TSDoc for function documentation with @param and @returns tags

- **routes.ts**: Express router configuration
  - Defines API endpoints
  - Maps to controller functions

## Example Module

The `example` module demonstrates a complete CRUD implementation:

**API Endpoints:**
- `GET /api/example` - Get all examples
- `GET /api/example/:id` - Get example by ID
- `POST /api/example` - Create new example
- `PUT /api/example/:id` - Update example
- `DELETE /api/example/:id` - Delete example

**Data Model:**
```typescript
interface ExampleInput {
  name: string;
  email: string;
  age?: number;
}

interface Example extends ExampleInput {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Service Functions:**
- `getAllExamples()` - Returns all examples
- `getExampleById(id)` - Returns single example or null
- `createExample(input)` - Creates new example with auto-incrementing ID
- `updateExample(id, input)` - Updates existing example or returns null
- `deleteExample(id)` - Deletes example, returns success/failure
- `resetExamples()` - Clears data store for testing

**Implementation Notes:**
- Uses in-memory data storage (replace with database in production)
- Auto-incrementing IDs
- Automatic timestamps on create/update
- Full CRUD operations with proper error handling
- Data isolation for tests via `resetExamples()`

## Testing

Tests use Bun's built-in test runner with `describe`/`it` syntax.

```bash
bun test
```

**Example test structure:**
```typescript
// src/tests/modules/example.test.ts
import { resetExamples } from '@/modules/example/services';

describe('Example Services', () => {
  beforeEach(() => {
    resetExamples();
  });

  it('should return empty array initially', async () => {
    const { getAllExamples } = await import('@/modules/example/services');
    const examples = getAllExamples();
    expect(examples).toEqual([]);
  });
});
```

The tests included in this template test the service layer directly. For HTTP endpoint testing, consider using Bun's built-in `fetch`.

## Request Tracking

Every request gets a unique ID for debugging:

- Uses existing `X-Request-ID` header if present
- Otherwise generates a random UUID
- ID is logged with all errors
- ID is returned in response header

This makes tracing errors across distributed systems easy.

## Error Handling

The template has a comprehensive error handling system:

1. **notFoundHandler**: Handles requests to undefined routes (404)
2. **errorHandler**: Catches all errors thrown in the application
3. **Production vs Development**: Production hides stack traces for security

## Response Helpers

The template provides standardized response helpers in `src/utils/response.ts` for consistent API responses:

### Available Functions

- `sendSuccess<T>(res, data, message?, count?)` - Send 200 OK response
- `sendCreated<T>(res, data, message)` - Send 201 Created response
- `sendError(res, statusCode, error, message?)` - Send error response
- `sendResponse<T>(res, statusCode, response)` - Generic response sender

### Usage in Controllers

```typescript
import { sendSuccess, sendCreated, sendError } from '@/utils/response';

// Success response
export const getAllExamplesController = (req, res) => {
  const examples = getAllExamples();
  sendSuccess(res, examples);
};

// Success with message
export const createExampleController = (req, res) => {
  const example = createExample(req.body);
  sendCreated(res, example, 'Example created successfully');
};

// Error response
export const getExampleByIdController = (req, res) => {
  const id = Number(req.params.id);
  const example = getExampleById(id);
  if (!example) {
    return sendError(res, 404, 'Not Found', 'Example not found');
  }
  sendSuccess(res, example);
};
```

### Response Format

All responses follow this structure:
```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "count": 10
}

// Error
{
  "success": false,
  "error": "Error type",
  "message": "Detailed message"
}
```

## Graceful Shutdown

The application handles shutdown gracefully:

- Catches SIGTERM and SIGINT signals
- Waits for ongoing requests to complete (30s timeout)
- Closes server before exiting
- Logs shutdown events

## Security Features

The template includes multiple security layers:

- **Helmet**: Sets HTTP security headers
- **CORS**: Controls which origins can access the API
- **Rate Limiting**: Prevents abuse by limiting requests per IP (uses Express's built-in `req.ip` with `trust proxy` enabled for proper IP extraction behind load balancers)
- **Compression**: Reduces bandwidth usage with gzip
- **Request ID Tracking**: Helps trace security incidents

## Environment Variables

```bash
# App Configuration
APP_NAME=bun-api-starter  # Optional: app name (default: bun-api-starter)
NODE_ENV=development                   # development, production, test
LOG_LEVEL=debug                        # error, warn, info, http, debug
PORT=3000                              # Port number (default: 3000)

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_POINTS=100                  # Max requests per window
RATE_LIMIT_DURATION=60                 # Time window in seconds
```

## API Endpoints

### Root Endpoint

```
GET /
```

Returns API information and available endpoints.

### Health Check

```
GET /health
```

Health check endpoint for load balancers and monitoring. Returns status, environment, and memory usage.

### Example Endpoints

```
GET /api/example          - Get all examples
GET /api/example/:id       - Get example by ID
POST /api/example         - Create new example
PUT /api/example/:id       - Update example
DELETE /api/example/:id    - Delete example
```

## Development

### Adding a New Module

1. Create module directory: `src/modules/your-module/`
2. Create files: `controllers.ts`, `services.ts`, `routes.ts`
3. Implement following the example module pattern
4. Import and mount routes in `src/app.ts`

### Adding Database Support

Choose a database service that fits your needs:

**Managed Database Services:**
- **MongoDB Atlas** - Managed MongoDB, auto-scaling, global CDN
- **Supabase** - PostgreSQL + Auth + Realtime + Storage (all-in-one)
- **AWS DynamoDB** - Serverless NoSQL, pay-per-request, auto-scaling
- **Google Cloud Firestore** - Serverless NoSQL, real-time sync, offline support
- **Google Cloud SQL** - Managed PostgreSQL/MySQL, automatic backups
- **Neon** - Serverless PostgreSQL, branchable, fast scaling
- **PlanetScale** - Serverless MySQL, connection pooling, branchable
- **Turso** - Edge SQLite, global distribution, low latency
- **CockroachDB** - Distributed SQL, automatic scaling, strong consistency
- **SurrealDB** - Distributed SQL + NoSQL + Graph, single database
- **YugabyteDB** - Distributed PostgreSQL, cloud-native
- **Astra DB** - Managed Cassandra/JSON, serverless
- **Fauna** - Serverless document database, global edge
- **Xata** - Serverless, branchable, edge caching
- **EdgeDB** - Edge-first graph database, real-time
- **Tigris** - Cloud PostgreSQL, branchable migrations
- **Crunchy Bridge** - Fully managed PostgreSQL, high availability
- **ScaleGrid** - PostgreSQL platform, branchable
- **Timescale** - PostgreSQL for time-series data

**Self-Hosted Options:**
- **PostgreSQL** - Open-source, reliable, feature-rich
- **MySQL** - Popular, mature, widely supported
- **SQLite** - File-based, zero-config, great for edge/lambda
- **MariaDB** - MySQL-compatible, open-source fork
- **Percona** - High-performance MySQL variants

Add appropriate database client to connect to your chosen service.

### Adding In-Memory Data Store

For caching or session storage, add an in-memory data store. These are typically used alongside your database for:

- Caching frequent database queries
- Storing session data
- Rate limiting counters
- Real-time pub/sub messaging

**Popular Options:**
- **Redis** (ioredis, redis) - Most popular, feature-rich, data structures
- **Upstash Redis** - Serverless Redis, edge caching, pay-per-request
- **Momento** - Serverless caching, edge network, low latency
- **DragonflyDB** - Redis-compatible, higher throughput, cloud-native
- **AWS ElastiCache** - Managed Redis/Memcached, AWS-integrated
- **GCP MemoryStore** - Managed Redis, Google Cloud integration
- **Azure Cache for Redis** - Azure-managed Redis, high availability
- **Cloudflare Workers KV** - Edge-cached, serverless, global distribution
- **Keyv** - Universal interface, supports multiple backends (Redis, MongoDB, etc.)
- **Memcached** (memjs, memcached) - Simple, fast key-value store
- **Durable Object (DO)** - Redis-compatible, persistent, Vercel-integrated

Choose based on your infrastructure and performance needs.

### Adding Validation

> **Important:** The example module skips validation for simplicity, but you should add a runtime validation library before building real endpoints. TypeScript types only exist at compile time — they don't protect you from malformed request bodies at runtime.

**Recommended:** [Zod](https://zod.dev) — runtime validation with first-class TypeScript support. Define a schema once and get both the type and the validator:

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

Validate in your controller before passing data to services:

```typescript
const parsed = CreateUserSchema.safeParse(req.body);
if (!parsed.success) {
  return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Validation Error', parsed.error.message);
}
const user = createUser(parsed.data);
```

**Other options:**
- **Joi** - Schema validation, popular in Node.js
- **Yup** - Simple, lightweight validation
- **class-validator** - Decorator-based validation
- **io-ts** - Runtime type checking

### Adding API Documentation

This template is documentation-agnostic. Choose your approach:

**API Documentation Tools:**
- **Swagger/OpenAPI**: Industry standard, interactive documentation
- **Redoc**: Modern, responsive, Three.js-powered UI
- **TypeDoc**: Generate documentation from TypeScript types
- **Postman**: API testing, documentation, and collaboration
- **Stoplight**: Design, test, and document APIs
- **Apicurio**: OpenAPI editor and documentation
- **ReadMe**: Developer-friendly API documentation platform
- **Bump.sh**: API changelog and release notes
- **Slate**: Markdown-based API documentation

Choose based on your team's workflow and documentation preferences.

### Adding Authentication

Add authentication to protect your API endpoints. Choose your approach:

**Token-Based Auth:**
- **JWT** (jsonwebtoken) - Stateless, industry standard
- **API Keys** (custom middleware) - Simple, per-user keys

**Session-Based Auth:**
- **express-session** - Server-managed sessions
- **cookie-session** - Cookie-based sessions

**Auth-as-a-Service Providers:**
- **Better Auth** - Modern authentication, multiple providers
- **WorkOS** - Auth for B2B SaaS products
- **Auth0** - Enterprise authentication platform
- **Clerk** - Modern auth, easy integration
- **Supabase Auth** - Auth + Database + Realtime
- **NextAuth** - OAuth providers, Next.js optimized
- **Firebase Auth** - Google's complete auth solution
- **AWS Cognito** - AWS-managed user pools
- **Descope** - Passwordless, biometric authentication
- **Stytch** - Modern auth APIs
- **Logto** - Open-source identity infrastructure
- **Keycloak** - Open-source identity management
- **Okta** - Enterprise SSO & MFA
- **Ping Identity** - Enterprise IAM
- **Kinde** - Simple auth for developers

**Other Options:**
- **Basic Auth** (express-basic-auth, http-auth) - Simple username/password
- **Custom** - Build your own authentication system

Choose based on your requirements (social login, SSO, enterprise features, etc.).

## Production

### Docker Deployment

```bash
docker compose up -d
```

The Docker setup includes:

- Production environment configuration
- Health check endpoint using curl
- Trusts proxy for proper IP extraction behind load balancers

**Production Tips:**
- **Pin versions** for reproducible builds: Change `FROM oven/bun:latest` to `FROM oven/bun:1.1.30` (or specific version)
- **Pin apt package versions**: Change `apt-get install -y curl` to `apt-get install -y curl=7.81.0-1` (or specific version)
- Using specific versions ensures your Docker images won't break from unexpected updates

### Environment Variables

Set `NODE_ENV=production` to:

- Log to files instead of console
- Hide stack traces from error responses
- Enable compression and HTTP request logging

## License

MIT
