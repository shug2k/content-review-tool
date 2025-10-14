# API Documentation

This document provides comprehensive documentation for the Content Review Tool REST API.

## Base URL
```
http://localhost:8000
```

## Response Format
All API responses return JSON with the following structure:

**Success Response:**
```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Authentication
Currently, the API does not require authentication. All endpoints are open access.

---

## Queues

### Get All Queues
Retrieve all review queues with their item counts.

**Endpoint:** `GET /queues`

**Response:**
```json
{
  "queues": [
    {
      "id": 1,
      "name": "Content Moderation Queue",
      "item_count": 5
    }
  ]
}
```

### Create Queue
Create a new review queue with an optional decision tree.

**Endpoint:** `POST /create-queue`

**Request Body:**
```json
{
  "name": "My Review Queue",
  "decision_tree": {
    "start_question_tag": "is_violating",
    "questions": [
      {
        "tag": "is_violating",
        "text": "Is this content violating?",
        "answers": [
          {
            "tag": "yes",
            "text": "Yes",
            "decision": "remove"
          },
          {
            "tag": "no",
            "text": "No",
            "decision": "approve"
          }
        ]
      }
    ]
  }
}
```

**Parameters:**
- `name` (string, required): Unique name for the queue
- `decision_tree` (object, optional): Custom decision tree configuration

**Response:**
```json
{
  "id": 1,
  "name": "My Review Queue",
  "message": "Queue created successfully"
}
```

### Get Queue Details
Retrieve details for a specific queue and its review items.

**Endpoint:** `GET /queue/{queue_id}`

**Parameters:**
- `queue_id` (integer): Queue ID

**Response:**
```json
{
  "queue": {
    "id": 1,
    "name": "My Review Queue",
    "decision_tree": { ... }
  },
  "reviews": [
    {
      "id": 1,
      "entity_type": "text",
      "entity_content": "Content to review",
      "user_name": "John Doe",
      "create_time": "2023-06-15T10:30:00Z"
    }
  ]
}
```

---

## Reviews

### Create Review Item
Add a new item to a review queue.

**Endpoint:** `POST /create-review`

**Request Body:**
```json
{
  "queue_id": 1,
  "entity_type": "text",
  "entity_content": "Content that needs to be reviewed",
  "entity_id": "content_123",
  "entity_create_time": "2023-06-15T10:00:00Z",
  "entity_metadata": {
    "platform": "twitter",
    "post_id": "12345"
  },
  "user_id": "user_456",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "user_phone_number": "+1234567890",
  "user_metadata": {
    "account_age_days": 30,
    "followers": 150
  }
}
```

**Parameters:**
- `queue_id` (integer, required): ID of the target queue
- `entity_type` (string, required): Type of content (`"text"` or `"image"`)
- `entity_content` (string, required): The actual content to review
- `entity_id` (string, optional): External identifier for the content
- `entity_create_time` (datetime, optional): When the content was originally created
- `entity_metadata` (object, optional): Additional content metadata
- `user_id` (string, optional): External user identifier
- `user_name` (string, optional): User's display name
- `user_email` (string, optional): User's email address
- `user_phone_number` (string, optional): User's phone number
- `user_metadata` (object, optional): Additional user metadata

**Response:**
```json
{
  "id": 1,
  "message": "Review item created successfully"
}
```

### Get Review Item
Retrieve a specific review item for processing.

**Endpoint:** `GET /review/{review_id}`

**Parameters:**
- `review_id` (integer): Review item ID

**Response:**
```json
{
  "review": {
    "id": 1,
    "entity_type": "text",
    "entity_content": "Content to review",
    "entity_metadata": { ... },
    "user_name": "John Doe",
    "user_metadata": { ... },
    "queue": {
      "id": 1,
      "name": "Content Moderation Queue",
      "decision_tree": { ... }
    },
    "questions_with_answers": null,
    "score": null
  }
}
```

### Submit Review Decision
Submit review decisions for a specific item.

**Endpoint:** `POST /submit-review`

**Request Body:**
```json
{
  "review_id": 1,
  "questions_with_answers": [
    {
      "question_tag": "is_violating",
      "question_text": "Is this content violating?",
      "answer_tag": "yes",
      "answer_text": "Yes",
      "decision": "remove"
    }
  ]
}
```

**Parameters:**
- `review_id` (integer, required): ID of the review item
- `questions_with_answers` (array, required): Array of question-answer pairs following the decision tree

**Response:**
```json
{
  "message": "Review submitted successfully",
  "final_decision": "remove"
}
```

---

## Decision Trees

### Get Decision Tree
Retrieve a specific decision tree configuration.

**Endpoint:** `GET /decision-tree/{tree_id}`

**Parameters:**
- `tree_id` (integer): Decision tree ID

**Response:**
```json
{
  "id": 1,
  "name": "Content Moderation Tree",
  "tree": {
    "start_question_tag": "is_violating",
    "questions": [
      {
        "tag": "is_violating",
        "text": "Is this content violating?",
        "answers": [
          {
            "tag": "yes",
            "text": "Yes",
            "decision": "remove"
          },
          {
            "tag": "no",
            "text": "No",
            "decision": "approve"
          }
        ]
      }
    ]
  }
}
```

### Create Decision Tree
Create a new decision tree template.

**Endpoint:** `POST /create-decision-tree`

**Request Body:**
```json
{
  "name": "My Decision Tree",
  "tree": {
    "start_question_tag": "severity_check",
    "questions": [
      {
        "tag": "severity_check",
        "text": "How severe is this content?",
        "answers": [
          {
            "tag": "high",
            "text": "High Severity",
            "decision": "escalate"
          },
          {
            "tag": "low",
            "text": "Low Severity",
            "next_question": "context_check"
          }
        ]
      },
      {
        "tag": "context_check",
        "text": "Does the context matter?",
        "answers": [
          {
            "tag": "yes",
            "text": "Yes",
            "decision": "manual_review"
          },
          {
            "tag": "no",
            "text": "No",
            "decision": "approve"
          }
        ]
      }
    ]
  }
}
```

**Parameters:**
- `name` (string, required): Unique name for the decision tree
- `tree` (object, required): Decision tree configuration

**Response:**
```json
{
  "id": 2,
  "message": "Decision tree created successfully"
}
```

---

## Decision Tree Structure

Decision trees are defined using a JSON structure with the following format:

### Basic Structure
```json
{
  "start_question_tag": "first_question",
  "questions": [
    {
      "tag": "unique_question_identifier",
      "text": "Question text displayed to reviewer",
      "answers": [
        {
          "tag": "answer_identifier",
          "text": "Answer text",
          "decision": "final_decision",
          "next_question": "next_question_tag"
        }
      ]
    }
  ]
}
```

### Answer Types
Each answer can either:
1. **End with a decision**: Include a `"decision"` field with the final outcome
2. **Continue to next question**: Include a `"next_question"` field with the tag of the next question

### Example Complex Tree
```json
{
  "start_question_tag": "content_type",
  "questions": [
    {
      "tag": "content_type",
      "text": "What type of content is this?",
      "answers": [
        {
          "tag": "spam",
          "text": "Spam",
          "decision": "remove"
        },
        {
          "tag": "legitimate",
          "text": "Legitimate Content",
          "next_question": "quality_check"
        }
      ]
    },
    {
      "tag": "quality_check",
      "text": "Is the content high quality?",
      "answers": [
        {
          "tag": "high_quality",
          "text": "High Quality",
          "decision": "approve"
        },
        {
          "tag": "low_quality",
          "text": "Low Quality",
          "decision": "flag_for_improvement"
        }
      ]
    }
  ]
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `QUEUE_NOT_FOUND` | The specified queue does not exist |
| `REVIEW_NOT_FOUND` | The specified review item does not exist |
| `INVALID_DECISION_TREE` | The decision tree format is invalid |
| `INVALID_ENTITY_TYPE` | Entity type must be 'text' or 'image' |
| `MISSING_REQUIRED_FIELD` | A required field is missing from the request |
| `DUPLICATE_NAME` | A queue or decision tree with this name already exists |
| `INVALID_JSON` | The request body contains invalid JSON |

---

## Rate Limiting

Currently, there are no rate limits applied to the API endpoints. This may be added in future versions.

---

## Examples

### Complete Workflow Example

1. **Create a queue:**
```bash
curl -X POST http://localhost:8000/create-queue \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Queue"}'
```

2. **Add a review item:**
```bash
curl -X POST http://localhost:8000/create-review \
  -H "Content-Type: application/json" \
  -d '{
    "queue_id": 1,
    "entity_type": "text",
    "entity_content": "This is test content",
    "user_name": "Test User"
  }'
```

3. **Get the review item:**
```bash
curl http://localhost:8000/review/1
```

4. **Submit a decision:**
```bash
curl -X POST http://localhost:8000/submit-review \
  -H "Content-Type: application/json" \
  -d '{
    "review_id": 1,
    "questions_with_answers": [
      {
        "question_tag": "is_violating",
        "answer_tag": "no",
        "decision": "approve"
      }
    ]
  }'
```