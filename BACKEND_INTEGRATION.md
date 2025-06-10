# AgroConnect Frontend - Backend Integration Guide

This guide explains how to easily connect the AgroConnect frontend with any backend service.

## 🚀 Quick Setup

### 1. Environment Configuration

Copy the environment example file and configure your backend URLs:

```bash
cp .env.example .env.local
```

Update the variables in `.env.local`:

```env
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_APP_NAME=AgroConnect
VITE_NODE_ENV=production
```

### 2. Backend Requirements

Your backend should implement the following endpoints:

## 🔐 Authentication Endpoints

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh
```

### Login Request/Response

```typescript
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "farmer",
      "verified": true
    }
  }
}
```

## 👤 User Profile Endpoints

```
GET  /api/user/profile
PUT  /api/user/profile
POST /api/user/avatar
```

### Profile Response Format

```typescript
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "farmer" | "exporter" | "analyst",
    "region": "string",
    "organization": "string",
    "joinDate": "ISO date string",
    "verified": boolean,
    "rating": number,
    "completedTransactions": number,
    "totalVolume": number,
    "avatar": "string (optional)"
  }
}
```

## 🌾 Farmers Endpoints

```
GET  /api/farmers
GET  /api/farmers/:id
POST /api/farmers
PUT  /api/farmers/:id
```

### Farmers List with Pagination

```typescript
// Request: GET /api/farmers?page=1&limit=10&region=tashkent&search=wheat

// Response
{
  "success": true,
  "data": [
    {
      "id": "farmer_id",
      "name": "Farmer Name",
      "farmName": "Farm Name",
      "email": "farmer@example.com",
      "phone": "+998901234567",
      "regionId": "tashkent",
      "verified": true,
      "rating": 4.8,
      "products": [
        {
          "id": "product_id",
          "name": "Wheat",
          "amount": 100,
          "unit": "tons",
          "area": 35,
          "pricePerUnit": 250,
          "qualityGrade": "A",
          "available": true
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## 📊 Analytics Endpoints

```
GET /api/analytics/dashboard
GET /api/analytics/regions
GET /api/analytics/regions/:id
```

### Dashboard Analytics Response

```typescript
{
  "success": true,
  "data": {
    "totalProduction": 125000,
    "averagePrice": 285.5,
    "priceChange": 2.3,
    "regionStats": [
      {
        "regionId": "tashkent",
        "name": "Tashkent",
        "production": 15000,
        "efficiency": "Excellent"
      }
    ]
  }
}
```

## 🏪 Market Data Endpoints

```
GET /api/market/prices
GET /api/market/prices/:productId/history
```

## 🛠️ Integration Steps

### Step 1: Update API Base URL

In your `.env.local` file:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Step 2: Implement Backend Authentication

Ensure your backend:

- Issues JWT tokens on login
- Validates Bearer tokens on protected routes
- Implements token refresh mechanism
- Returns user data with authentication

### Step 3: Database Schema

Your backend should store user profiles with these fields:

```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role ENUM('farmer', 'exporter', 'analyst'),
  region VARCHAR(100),
  organization VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2,1) DEFAULT 0,
  completed_transactions INT DEFAULT 0,
  total_volume INT DEFAULT 0,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Step 4: Error Handling

Your API should return consistent error responses:

```typescript
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE" // optional
}
```

Common HTTP status codes:

- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `422` - Validation error
- `500` - Internal server error

### Step 5: CORS Configuration

Configure CORS to allow your frontend domain:

```javascript
// Express.js example
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
    credentials: true,
  }),
);
```

### Step 6: File Upload Support

For avatar uploads, implement multipart/form-data handling:

```javascript
// Express.js with multer example
app.post("/api/user/avatar", upload.single("avatar"), (req, res) => {
  // Handle file upload
  // Return: { success: true, data: { avatarUrl: "uploaded_file_url" } }
});
```

## 🔄 Offline/Development Mode

The frontend includes offline support. To enable mock API mode:

```env
VITE_ENABLE_MOCK_API=true
```

This will:

- Save all data to localStorage
- Simulate API responses
- Work without a backend during development

## 🧪 Testing Your Integration

1. **Authentication Test**: Try login/logout flows
2. **Profile Update**: Test editing and saving profile changes
3. **Data Persistence**: Refresh page to verify data persistence
4. **Error Handling**: Test with invalid credentials/network errors
5. **Token Refresh**: Test automatic token refresh

## 📝 Implementation Examples

### Node.js/Express Backend

```javascript
// Login endpoint example
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate credentials
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Generate tokens
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});
```

### Python/Django Backend

```python
# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(email=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)

        return Response({
            'success': True,
            'data': {
                'token': str(refresh.access_token),
                'refreshToken': str(refresh),
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                    'role': user.role,
                    'verified': user.verified
                }
            }
        })

    return Response({
        'success': False,
        'error': 'Invalid credentials'
    }, status=401)
```

## 📚 Additional Resources

- API client implementation: `src/lib/api-client.ts`
- Service layer: `src/services/`
- Environment configuration: `.env.example`
- TypeScript types: All interfaces exported from `api-client.ts`

## 🆘 Support

For questions about integration:

1. Check the console for detailed error messages
2. Verify your API responses match the expected format
3. Test endpoints directly using tools like Postman
4. Ensure CORS is properly configured

The frontend is designed to be backend-agnostic and will work with any REST API that follows these conventions.
