# Contributing to Content Review Tool

Thank you for your interest in contributing to the Content Review Tool! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

We welcome contributions of all kinds:

- 🐛 **Bug reports and fixes**
- ✨ **New features and enhancements**
- 📖 **Documentation improvements**
- 🧪 **Test coverage improvements**
- 🎨 **UI/UX improvements**
- 🔧 **Performance optimizations**

## 📋 Before You Start

1. **Check existing issues** to see if your bug report or feature request already exists
2. **Read the [Development Guide](DEVELOPMENT.md)** to understand the project structure
3. **Review the [API Documentation](API.md)** to understand the system architecture
4. **Join the discussion** in GitHub Discussions if you need clarification

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/content-review-tool.git
cd content-review-tool

# Add the original repository as upstream
git remote add upstream https://github.com/shug2k/content-review-tool.git
```

### 2. Set Up Development Environment

Follow the detailed setup instructions in the [Development Guide](DEVELOPMENT.md).

### 3. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 4. Make Your Changes

- Write clean, readable code
- Follow the existing code style and conventions
- Add tests for new functionality
- Update documentation as needed

### 5. Test Your Changes

```bash
# Backend tests
cd cr-backend && python -m pytest

# Frontend tests
cd cr-frontend && npm test

# Manual testing
# Start both frontend and backend servers and test the functionality
```

### 6. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Add: brief description of your changes"
```

### 7. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

---

## 📝 Code Style Guidelines

### Python (Backend)

- **Follow PEP 8** style guidelines
- **Line length**: Maximum 88 characters
- **Imports**: Use absolute imports, group standard library, third-party, and local imports
- **Docstrings**: Use Google-style docstrings for functions and classes
- **Type hints**: Use type hints for function parameters and return values

**Example:**
```python
from typing import List, Optional
from django.http import JsonResponse

def get_queue_items(queue_id: int, limit: Optional[int] = None) -> List[dict]:
    """
    Retrieve items from a specific queue.

    Args:
        queue_id: The ID of the queue to retrieve items from
        limit: Optional limit on number of items to return

    Returns:
        List of queue item dictionaries
    """
    # Implementation here
    pass
```

### TypeScript (Frontend)

- **Use TypeScript strict mode**
- **Define interfaces** for all data structures
- **Component naming**: Use PascalCase for components
- **File naming**: Use kebab-case for files
- **Props**: Always define prop interfaces

**Example:**
```typescript
interface QueueItemProps {
  item: QueueItem;
  onSelect: (id: number) => void;
  isSelected?: boolean;
}

export default function QueueItem({ item, onSelect, isSelected = false }: QueueItemProps) {
  return (
    <div className={`border rounded p-4 ${isSelected ? 'bg-blue-50' : 'bg-white'}`}>
      <h3 className="font-semibold">{item.name}</h3>
      <button onClick={() => onSelect(item.id)}>Select</button>
    </div>
  );
}
```

### CSS/Styling

- **Use Tailwind CSS** for styling
- **Responsive design**: Use responsive utilities (`sm:`, `md:`, `lg:`)
- **Consistent spacing**: Use Tailwind's spacing scale
- **Color scheme**: Stick to the existing color palette

---

## 🧪 Testing Guidelines

### Backend Testing

- **Write tests** for all new API endpoints
- **Test edge cases** and error conditions
- **Use descriptive test names** that explain what is being tested
- **Mock external dependencies**

**Example test structure:**
```python
def test_create_queue_with_valid_data():
    """Test creating a queue with valid input data."""
    response = client.post('/create-queue', {
        'name': 'Test Queue',
        'decision_tree': valid_decision_tree
    })
    assert response.status_code == 200
    assert 'id' in response.json()

def test_create_queue_with_duplicate_name():
    """Test that creating a queue with duplicate name fails."""
    # Test implementation
    pass
```

### Frontend Testing

- **Test user interactions** and component behavior
- **Mock API calls** using appropriate mocking libraries
- **Test accessibility** features
- **Test responsive behavior**

**Example test:**
```javascript
describe('DecisionCard', () => {
  it('should display question text and answer options', () => {
    render(<DecisionCard question={mockQuestion} onAnswer={mockOnAnswer} />);

    expect(screen.getByText(mockQuestion.text)).toBeInTheDocument();
    mockQuestion.answers.forEach(answer => {
      expect(screen.getByText(answer.text)).toBeInTheDocument();
    });
  });

  it('should call onAnswer when an answer is selected', () => {
    render(<DecisionCard question={mockQuestion} onAnswer={mockOnAnswer} />);

    fireEvent.click(screen.getByText(mockQuestion.answers[0].text));
    expect(mockOnAnswer).toHaveBeenCalledWith(mockQuestion.answers[0]);
  });
});
```

---

## 📖 Documentation Guidelines

### Code Documentation

- **Add docstrings** to all public functions and classes
- **Comment complex logic** inline
- **Update API documentation** when adding new endpoints
- **Include examples** in documentation

### README and Guides

- **Keep documentation up to date** with code changes
- **Use clear, concise language**
- **Include code examples** where helpful
- **Test all instructions** before submitting

---

## 🐛 Bug Reports

When reporting bugs, please include:

### Required Information

- **Clear description** of the issue
- **Steps to reproduce** the bug
- **Expected vs actual behavior**
- **Environment details** (OS, Python version, Node.js version)
- **Error messages or logs**

### Bug Report Template

```markdown
## Bug Description
A clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., Ubuntu 20.04]
- Python version: [e.g., 3.10.2]
- Node.js version: [e.g., 16.14.0]
- Browser: [e.g., Chrome 98.0]

## Additional Context
Any other context about the problem.
```

---

## ✨ Feature Requests

When requesting features, please include:

- **Clear description** of the proposed feature
- **Use case** explaining why this feature would be valuable
- **Proposed implementation** (if you have ideas)
- **Alternative solutions** you've considered

### Feature Request Template

```markdown
## Feature Description
A clear and concise description of the feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other approaches have you considered?

## Additional Context
Any other context about the feature.
```

---

## 🔍 Code Review Process

### For Contributors

- **Keep pull requests focused** on a single feature or fix
- **Write clear commit messages** following conventional commits format
- **Update tests** and documentation as needed
- **Respond to feedback** promptly and professionally

### Review Criteria

Pull requests will be reviewed for:

- **Code quality** and adherence to style guidelines
- **Test coverage** for new functionality
- **Documentation** updates
- **Security** considerations
- **Performance** impact
- **Backward compatibility**

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(api): add endpoint for bulk review deletion
fix(frontend): resolve decision tree navigation bug
docs(readme): update installation instructions
test(backend): add tests for queue validation
```

---

## 🏆 Recognition

Contributors will be recognized in:

- **GitHub contributors list**
- **Release notes** for significant contributions
- **Project documentation** for major features

---

## ❓ Questions and Support

If you have questions:

1. **Check existing documentation** first
2. **Search GitHub issues** for similar questions
3. **Ask in GitHub Discussions**
4. **Contact maintainers** via GitHub

---

## 📄 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory language
- Personal or political attacks
- Publishing private information without permission
- Any conduct that could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

---

## 🎉 Thank You!

Thank you for contributing to the Content Review Tool! Your contributions help make this project better for everyone.

## 📚 Additional Resources

- [Development Guide](DEVELOPMENT.md) - Detailed setup and development instructions
- [API Documentation](API.md) - Complete API reference
- [GitHub Issues](https://github.com/shug2k/content-review-tool/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/shug2k/content-review-tool/discussions) - Community discussions