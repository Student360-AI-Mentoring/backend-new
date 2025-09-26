# API Testing Guide

## Quick Start

The easiest way to test the API is through Swagger UI:

1. **Start the application** (see main [README.md](../README.md) for setup instructions)
2. **Open Swagger UI** at `http://localhost:3000/docs`
3. **Test endpoints** directly in the browser interface

## Available Endpoints

### Authentication Module
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Student IDs Module
- `GET /api/student-ids` - List all student IDs
- `POST /api/student-ids` - Create new student ID
- `GET /api/student-ids/{id}` - Get student ID by ID
- `PUT /api/student-ids/{id}` - Update student ID
- `DELETE /api/student-ids/{id}` - Delete student ID

## Using Swagger UI

### Testing Flow:
1. **Register/Login** to get authentication token
2. **Authorize** using the `Authorize` button in Swagger UI
3. **Test protected endpoints** with automatic token inclusion

### Response Format:
All API responses follow this standard format:
```json
{
  "success": true,
  "status": 200,
  "data": { ... },
  "meta": {
    "timestamp": "2025-01-01T00:00:00.000Z",
    "request_id": "req-123456"
  }
}
```

## Alternative Testing Methods

### Using curl
If you prefer command-line testing, here are basic curl examples:

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Authenticated Request:**
```bash
# Replace YOUR_JWT_TOKEN with token from login response
curl -X GET http://localhost:3000/api/student-ids \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman/Insomnia
1. Import the API collection from Swagger UI
2. Set up environment variables for base URL and tokens
3. Use collection runner for automated testing

## Testing Best Practices

1. **Start with Authentication** - Most endpoints require valid JWT tokens
2. **Check Response Format** - Verify all responses follow the standard format
3. **Test Error Cases** - Try invalid data to see error handling
4. **Use Request IDs** - Each response includes a unique request_id for debugging
5. **Monitor Logs** - Check application logs for detailed request/response information

For detailed endpoint documentation, schemas, and response examples, use the Swagger UI interface at `/docs`.