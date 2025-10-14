# Development Guide

This guide provides detailed instructions for setting up a development environment and contributing to the Content Review Tool.

## 🛠️ Development Environment Setup

### System Requirements

- **Operating System**: Linux, macOS, or Windows (with WSL2)
- **PostgreSQL**: Version 12 or higher
- **Python**: Version 3.10 or higher
- **Node.js**: Version 16 or higher
- **Git**: Latest version

### Detailed Setup Instructions

#### 1. PostgreSQL Installation and Configuration

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Windows (WSL2):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

#### 2. Database Setup

```bash
# Switch to postgres user (Linux/WSL2)
sudo -u postgres psql

# Or connect directly (macOS)
psql postgres

# Run the following SQL commands:
CREATE USER admin WITH PASSWORD 'password';
CREATE DATABASE cr;
GRANT ALL PRIVILEGES ON DATABASE cr TO admin;
ALTER USER admin CREATEDB;
\q
```

Alternatively, run the provided setup script:
```bash
psql -U postgres -f cr-backend/setup.sql
```

#### 3. Python Environment Setup

**Create and activate virtual environment:**
```bash
cd cr-backend
python -m venv venv

# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

#### 4. Django Configuration

**Run migrations:**
```bash
python manage.py migrate
```

**Create superuser (optional):**
```bash
python manage.py createsuperuser
```

**Test the backend:**
```bash
python manage.py runserver
# Visit http://localhost:8000 to verify it's running
```

#### 5. Frontend Setup

**In a new terminal:**
```bash
cd cr-frontend
npm install
```

**Start development server:**
```bash
npm run dev
# Visit http://localhost:3000 to verify it's running
```

---

## 🏗️ Project Architecture

### Backend Structure (`cr-backend/`)

```
cr-backend/
├── api/                    # Main Django app
│   ├── __init__.py
│   ├── models.py          # Database models
│   ├── routes.py          # API endpoints
│   ├── modules.py         # Business logic
│   ├── model_validators.py # Input validation
│   ├── urls.py           # URL routing
│   ├── admin.py          # Django admin config
│   └── migrations/       # Database migrations
├── cr/                    # Django project settings
│   ├── settings.py       # Project configuration
│   ├── urls.py          # Root URL configuration
│   └── wsgi.py          # WSGI configuration
├── tests/                # Test suite
├── manage.py            # Django management script
├── requirements.txt     # Python dependencies
├── setup.sql           # Database setup script
└── pytest.ini         # Test configuration
```

### Frontend Structure (`cr-frontend/`)

```
cr-frontend/
├── app/                   # Next.js 13 app directory
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Home page (queue list)
│   ├── queue/            # Queue-related pages
│   │   └── [queueId]/
│   │       └── page.tsx  # Queue detail page
│   └── review/           # Review-related pages
│       ├── [reviewId]/
│       │   └── page.tsx  # Review item page
│       ├── components/   # Review UI components
│       │   ├── content-card.tsx
│       │   ├── decision-card.tsx
│       │   ├── content-metadata-card.tsx
│       │   └── user-metadata-card.tsx
│       └── utils/        # Utility functions
│           └── decisions.ts
├── tests/                # Test suite
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── next.config.js       # Next.js configuration
└── jest.config.js       # Jest test configuration
```

---

## 🧪 Testing

### Backend Testing

**Run all tests:**
```bash
cd cr-backend
python -m pytest
```

**Run specific test file:**
```bash
python -m pytest tests/test_queue_routes.py
```

**Run tests with coverage:**
```bash
python -m pytest --cov=api
```

**Test categories:**
- `test_queue_routes.py` - Queue API endpoints
- `test_review_routes.py` - Review API endpoints
- `test_decision_tree_routes.py` - Decision tree API endpoints
- `test_validators.py` - Input validation logic

### Frontend Testing

**Run all tests:**
```bash
cd cr-frontend
npm test
```

**Run tests in watch mode:**
```bash
npm test -- --watch
```

**Run specific test file:**
```bash
npm test decision-card.test.js
```

**Test categories:**
- `decision-card.test.js` - Decision tree UI component
- `review-content-components.test.js` - Content display components
- `utils.test.js` - Utility functions

---

## 🔧 Development Workflow

### 1. Setting Up a New Feature

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code changes ...

# Run tests
cd cr-backend && python -m pytest
cd cr-frontend && npm test

# Commit your changes
git add .
git commit -m "Add: description of your feature"

# Push to your fork
git push origin feature/your-feature-name
```

### 2. Code Style Guidelines

**Python (Backend):**
- Follow PEP 8 style guidelines
- Use descriptive variable and function names
- Add docstrings for complex functions
- Keep line length under 88 characters

**TypeScript (Frontend):**
- Use TypeScript strict mode
- Define interfaces for all data structures
- Use meaningful component and variable names
- Follow React functional component patterns

### 3. Adding New API Endpoints

1. **Define the model** (if needed) in `api/models.py`
2. **Add validation** in `api/model_validators.py`
3. **Create the endpoint** in `api/routes.py`
4. **Add URL routing** in `api/urls.py`
5. **Write tests** in `tests/`

**Example endpoint structure:**
```python
class YourRoutes:
    @staticmethod
    def your_endpoint(request: HttpRequest) -> JsonResponse:
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        # Validation logic
        # Business logic
        # Return response
```

### 4. Adding Frontend Components

1. **Create component** in appropriate directory
2. **Add TypeScript interfaces** for props
3. **Style with Tailwind CSS**
4. **Write tests** in `tests/`

**Example component structure:**
```typescript
interface YourComponentProps {
  data: YourDataType;
  onAction: (id: number) => void;
}

export default function YourComponent({ data, onAction }: YourComponentProps) {
  return (
    <div className="tailwind-classes">
      {/* Component JSX */}
    </div>
  );
}
```

---

## 🐛 Debugging

### Backend Debugging

**Enable Django debug mode:**
```python
# In cr/settings.py
DEBUG = True
```

**Use Django shell:**
```bash
python manage.py shell
```

**Check logs:**
```bash
# Django development server shows logs in terminal
python manage.py runserver
```

### Frontend Debugging

**Use browser dev tools:**
- Open browser developer tools (F12)
- Check Console tab for JavaScript errors
- Use Network tab to inspect API calls

**Next.js debugging:**
```bash
# Run with debug output
npm run dev -- --debug
```

**React DevTools:**
Install the React Developer Tools browser extension for component inspection.

---

## 📊 Database Management

### Running Migrations

```bash
cd cr-backend

# Create new migration after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# View migration status
python manage.py showmigrations
```

### Database Console Access

```bash
# Django database shell
python manage.py dbshell

# Direct PostgreSQL access
psql -U admin -d cr -h localhost
```

### Resetting Database

```bash
# Drop and recreate database
dropdb -U postgres cr
createdb -U postgres cr
python manage.py migrate
```

---

## 🔒 Security Considerations

### Development vs Production

**Current development setup includes:**
- No authentication (all endpoints open)
- CORS enabled for localhost
- Debug mode enabled
- No rate limiting

**For production deployment, consider:**
- Adding authentication/authorization
- Configuring proper CORS settings
- Disabling debug mode
- Adding rate limiting
- Using environment variables for secrets

### Environment Variables

Create `.env` files for sensitive configuration:

**Backend `.env`:**
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://admin:password@localhost:5432/cr
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📈 Performance Considerations

### Backend Optimization

- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Consider caching for decision trees
- Optimize SQL queries (use `select_related` for joins)

### Frontend Optimization

- Implement lazy loading for large lists
- Use React.memo for expensive components
- Consider code splitting for large pages
- Optimize images and assets

---

## 🚀 Deployment

### Development Deployment

**Using Docker (when available):**
```bash
# Build and run containers
docker-compose up --build

# Run in background
docker-compose up -d
```

### Production Considerations

1. **Environment Configuration**
2. **Database Migration Strategy**
3. **Static File Serving**
4. **Load Balancing**
5. **Monitoring and Logging**
6. **Backup Strategy**

---

## 🤝 Getting Help

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Ask questions in GitHub Discussions
- **Code Review**: Submit pull requests for code review
- **Documentation**: Check this guide and the README for information

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)