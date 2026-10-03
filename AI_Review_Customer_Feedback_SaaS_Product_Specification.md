# AI Review & Customer Feedback SaaS

## End-to-End Product Description & Functional Specification

**Document Type:** Product Specification\
**Version:** 1.0\
**Status:** MVP / Initial Product Definition

------------------------------------------------------------------------

# 1. Product Overview

The product is a multi-tenant SaaS platform that helps businesses
collect structured customer feedback and make it easier for customers to
write genuine Google reviews based on their actual experience.

The system has three primary roles:

1.  **Super Admin** --- manages business accounts and the overall
    platform.
2.  **Business/Admin User** --- configures a business profile,
    questions, Google review link, QR code, and views feedback/review
    analytics.
3.  **Customer** --- scans a business QR code, answers a small set of
    dynamically selected questions, receives an AI-assisted review
    draft, and can copy it before being redirected to the business's
    Google review page.

The core problem being solved is:

> Businesses often ask customers for reviews, but customers may not know
> what to write. Businesses also lack structured information about which
> aspects of their service customers like or dislike.

The product addresses both problems:

-   **Customer side:** Reduce the friction of writing a review.
-   **Business side:** Collect structured feedback and understand
    category-level customer experience.

The product should help customers express their own genuine experience.
AI should transform customer-provided information into natural language,
not invent experiences or manipulate customers into leaving positive
reviews.

------------------------------------------------------------------------

# 2. Core Product Concept

The complete flow is:

``` text
Business Account
       |
       v
Configure Business
       |
       +--> Add Google Review Link
       |
       +--> Create Question Bank
       |
       +--> Create Categories
       |
       +--> Generate QR Code
       |
       v
Customer Scans QR
       |
       v
Customer Information
       |
       v
System Selects 3 Questions
       |
       v
Customer Rates Each Question
       |
       v
AI Generates Review Draft
       |
       v
Customer Reviews / Edits Draft
       |
       +----------------------+
       |                      |
       v                      v
Copy Review Text       Redirect to Google
                              |
                              v
                       Customer Posts Review
```

At the same time, the business receives structured feedback that can be
analyzed by category and over time.

------------------------------------------------------------------------

# 3. Main Objectives

## 3.1 Customer Objectives

The customer should be able to:

-   Scan a QR code.
-   Quickly identify the business.
-   Provide basic information.
-   Answer only a few questions.
-   Rate individual aspects of the experience.
-   Optionally provide additional context.
-   Receive an AI-generated review draft.
-   Edit the draft if desired.
-   Copy the review.
-   Continue to the business's Google review page.

The process should minimize unnecessary steps.

## 3.2 Business Objectives

The business should be able to:

-   Maintain its business profile.
-   Add/update its Google review URL.
-   Create and manage feedback categories.
-   Create and manage questions.
-   Activate/deactivate questions.
-   Generate a QR code.
-   Track QR scans.
-   Track feedback sessions.
-   Track completed question sessions.
-   Track AI review generations.
-   Track Google review redirects.
-   Analyze category-level ratings.
-   Analyze monthly trends.
-   View customer feedback records.
-   Understand areas such as staff, food, service, ambience, collection,
    pricing, etc.

## 3.3 Super Admin Objectives

The Super Admin should be able to:

-   Create business accounts.
-   View all businesses.
-   Update business information.
-   Activate/deactivate businesses.
-   Reset/update business passwords.
-   Delete business accounts.
-   View high-level platform activity.
-   Access a business account/dashboard when required for
    administration.

Subscription management is intentionally **not part of the current Super
Admin scope**.

------------------------------------------------------------------------

# 4. User Roles

## 4.1 Super Admin

The Super Admin is the platform-level administrator.

### Responsibilities

-   Manage business accounts.
-   Manage business access.
-   Maintain platform-level records.
-   Monitor overall platform usage.
-   Handle account-related administrative operations.

### Permissions

-   Create business.
-   View businesses.
-   Update business.
-   Activate/deactivate business.
-   Reset business password.
-   Delete business.
-   View business activity.
-   Access business-level information for support/administration.

### Explicitly Out of Scope

The Super Admin will not manage:

-   Subscription plans.
-   Billing.
-   Payments.
-   Subscription upgrades/downgrades.

These can be added in a future version.

------------------------------------------------------------------------

# 5. Business User

Each business gets its own account created by the Super Admin.

A business user can manage only its own business data.

### Business Responsibilities

-   Complete business profile.
-   Configure Google review link.
-   Configure feedback categories.
-   Configure questions.
-   Activate/deactivate questions.
-   Generate/download QR code.
-   View feedback analytics.
-   View review-generation analytics.
-   View customer records.
-   Review category-level trends.

------------------------------------------------------------------------

# 6. Customer

The customer does not need a traditional account.

The customer accesses the system through a QR code associated with a
specific business.

The customer journey is session-based.

A customer:

1.  Scans QR.
2.  Opens business feedback page.
3.  Provides requested details.
4.  Answers dynamically selected questions.
5.  Receives AI-generated review draft.
6.  Reviews/edits the draft.
7.  Copies the text.
8.  Is redirected to Google.

------------------------------------------------------------------------

# 7. Super Admin Module

## 7.1 Super Admin Login

The platform should have a protected Super Admin login.

Required credentials:

-   Username/email
-   Password

Security requirements:

-   Passwords must never be stored as plain text.
-   Passwords should be securely hashed.
-   Login attempts should be rate limited.
-   Sessions/tokens should expire appropriately.
-   Administrative actions should be logged.

------------------------------------------------------------------------

# 8. Business Account Management

The Super Admin can create a new business.

## 8.1 Create Business

Required/optional information can include:

-   Business name
-   Owner/contact name
-   Email
-   Mobile number
-   Username
-   Initial password
-   Business category
-   Address
-   Status

Business status:

-   Active
-   Inactive

Only active businesses should be able to receive new customer sessions.

## 8.2 Update Business

Super Admin can update:

-   Business name
-   Contact information
-   Category
-   Address
-   Username
-   Status
-   Other administrative profile information

## 8.3 Password Management

Super Admin can:

-   Reset password.
-   Set a new temporary password.
-   Force password change if required.

The actual password should never be displayed after creation.

## 8.4 Delete Business

Deleting a business should be treated as a destructive administrative
action.

The system should ideally support either:

-   Soft delete, or
-   Confirmation + permanent deletion

Soft delete is preferable for auditability.

------------------------------------------------------------------------

# 9. Business Profile Management

The business user can manage its public-facing business information.

Possible fields:

-   Business name
-   Logo
-   Business category
-   Address
-   Phone
-   Email
-   Description
-   Google Business/Review URL
-   Default language
-   Active/inactive status

The Google review URL is especially important because the final customer
action will redirect to this URL.

------------------------------------------------------------------------

# 10. Google Review Link Management

Each business must have a configurable Google review URL.

Example:

``` text
https://g.page/...
```

The business user can:

-   Add review URL.
-   Update review URL.
-   Test the URL.
-   Save the URL.

The system should validate that a URL is present before allowing the
review journey to redirect to Google.

The system should not claim that a customer actually submitted a Google
review merely because the customer was redirected.

The platform can reliably measure:

-   Google redirect/click.

Actual Google review submission should be treated as a separate metric
unless the system has a legitimate and reliable method of obtaining
verified review data.

------------------------------------------------------------------------

# 11. Question and Category Management

This is one of the core modules of the product.

The business defines what aspects of the customer experience should be
measured.

Examples:

### Restaurant

Categories:

-   Food
-   Taste
-   Staff
-   Service
-   Ambience
-   Cleanliness
-   Waiting Time
-   Value for Money

### Jewellery Store

Categories:

-   Collection
-   Product Quality
-   Staff
-   Service
-   Pricing
-   Store Ambience
-   Variety
-   Packaging

### Salon

Categories:

-   Staff
-   Service
-   Cleanliness
-   Waiting Time
-   Ambience
-   Value for Money
-   Result

The business can define categories appropriate to its own operation.

------------------------------------------------------------------------

# 12. Question Structure

Each question should contain structured data.

Example:

``` text
Question ID:
Q001

Category:
Staff

Question:
How would you rate our staff?

Type:
Rating

Status:
Active
```

Recommended fields:

-   Question ID
-   Business ID
-   Category ID
-   Question text
-   Question type
-   Active/inactive
-   Created timestamp
-   Updated timestamp

The system should avoid allowing arbitrary AI instructions to be
embedded inside business questions.

The AI prompt should be controlled by the platform and populated using
structured customer responses.

------------------------------------------------------------------------

# 13. Question Activation

Businesses should be able to:

-   Create questions.
-   Edit questions.
-   Activate questions.
-   Deactivate questions.
-   Delete questions if no historical records depend on them.

Historical customer answers should retain the original question/category
information even if a question is later deactivated.

This is important for historical analytics.

------------------------------------------------------------------------

# 14. Random Question Selection

The system should not display every available question during every
customer session.

Instead, it should select a small number of questions.

Default:

**3 questions per session**

The system can later support configurable numbers such as:

-   3
-   4
-   5

For the MVP, 3 is recommended.

## Selection Logic

When a customer starts a session:

1.  Retrieve active questions for the business.
2.  Check that there are enough active questions.
3.  Randomize eligible questions.
4.  Select 3.
5.  Present one question at a time.
6.  Store the selected question IDs in the customer session.

The selected questions must remain fixed for that session.

If the customer refreshes the page, the system should not randomly
select a completely different set.

------------------------------------------------------------------------

# 15. Avoiding Repetitive Question Selection

A future improvement can consider previous sessions.

For example, the system may avoid selecting the same combination
repeatedly.

Possible logic:

``` text
Business has 10 active questions.

Session 1:
Staff + Food + Ambience

Session 2:
Service + Waiting Time + Food

Session 3:
Collection + Staff + Pricing
```

This produces more varied feedback across customers.

However, randomness should not be used to selectively expose only
positive categories.

Question selection should remain fair and representative of the
business's configured feedback areas.

------------------------------------------------------------------------

# 16. Customer QR Code

Each business gets a unique customer-facing QR code.

The QR code points to a business-specific URL.

Example concept:

``` text
https://yourplatform.com/review/abc-jewellers
```

or:

``` text
https://yourplatform.com/r/ABC123
```

The QR code should identify the business but should not expose sensitive
database information.

The business can download/print the QR code.

The QR code can be placed:

-   At the billing counter.
-   On receipts.
-   On tables.
-   At the exit.
-   On packaging.
-   On business cards.
-   On printed marketing material.

------------------------------------------------------------------------

# 17. Customer Session

Every QR scan should create or initialize a customer session.

A session should contain information such as:

-   Session ID
-   Business ID
-   Start time
-   Customer information if provided
-   Selected questions
-   Customer answers
-   AI generation status
-   Review draft
-   Google redirect event
-   Completion status

Example session lifecycle:

``` text
STARTED
   ↓
CUSTOMER_INFO_COMPLETED
   ↓
QUESTIONS_STARTED
   ↓
QUESTIONS_COMPLETED
   ↓
AI_GENERATION_STARTED
   ↓
AI_GENERATION_COMPLETED
   ↓
REVIEW_SHOWN
   ↓
GOOGLE_REDIRECTED
```

------------------------------------------------------------------------

# 18. Customer Information

The initial concept includes:

-   Name
-   Mobile number

These should be collected only for a clearly defined business purpose.

The platform should have:

-   Privacy notice.
-   Appropriate consent/notice where required.
-   Data retention policy.
-   Secure storage.
-   Access controls.

The system should not automatically assume that permission to provide
feedback also means permission to receive marketing messages.

Marketing consent should be a separate concept if introduced later.

------------------------------------------------------------------------

# 19. Customer Question Flow

The customer receives questions one by one.

Example:

### Question 1

``` text
How would you rate our staff?

1  2  3  4  5
```

Customer selects 4.

Then:

### Question 2

``` text
How would you rate the food?

1  2  3  4  5
```

Customer selects 5.

Then:

### Question 3

``` text
How would you rate the ambience?

1  2  3  4  5
```

Customer selects 5.

After completion, the system sends the collected answers to the
review-generation service.

------------------------------------------------------------------------

# 20. Rating System

The initial rating system should use a 1--5 scale.

``` text
1 = Very Poor
2 = Poor
3 = Average
4 = Good
5 = Excellent
```

The exact labels can be configured later.

The raw numerical rating should always be stored.

This allows analytics such as:

-   Average rating.
-   Distribution.
-   Category comparison.
-   Monthly trend.
-   Rating frequency.

------------------------------------------------------------------------

# 21. Optional Customer Comment

A future or optional feature can allow the customer to provide
additional information.

Example:

> Is there anything specific you would like to mention?

The customer can:

-   Type a comment.
-   Optionally provide a voice input.

This should not be mandatory for the MVP.

The purpose is to provide richer context to the AI without forcing
customers to write a review themselves.

------------------------------------------------------------------------

# 22. AI Review Generation

The AI system receives structured information such as:

``` text
Business:
ABC Restaurant

Category:
Food
Rating:
5

Category:
Staff
Rating:
4

Category:
Ambience
Rating:
5
```

Optional customer comment:

``` text
The biryani was really good.
```

The AI produces a natural-language review draft.

Example:

> I had a really good experience at ABC Restaurant. The food was
> excellent, especially the biryani. The staff were helpful and the
> ambience was pleasant. Overall, it was a great experience.

The AI must not invent:

-   Products the customer did not mention.
-   Services the customer did not experience.
-   Specific staff names.
-   Prices.
-   Discounts.
-   Claims about awards.
-   Claims about guarantees.
-   Facts not provided by the customer or business context.

------------------------------------------------------------------------

# 23. Rating-Aware Review Generation

The AI must preserve the customer's actual ratings.

Example:

``` text
Food: 5
Staff: 2
Ambience: 5
```

The generated review should not say:

> The staff were excellent.

Instead it should accurately reflect the lower staff rating if that
aspect is included.

Possible output:

> The food was excellent and I really liked the ambience. However, I
> felt the service could have been better.

The system should not automatically convert every rating into
exaggerated positive language.

------------------------------------------------------------------------

# 24. Review Draft Principles

The generated draft should be:

-   Natural.
-   Concise.
-   Based on customer inputs.
-   Grammatically correct.
-   Human-readable.
-   Non-repetitive.
-   Proportional to the customer's ratings.
-   Editable by the customer.

The AI should not:

-   Fabricate experiences.
-   Guarantee a positive rating.
-   Force a 5-star review.
-   Add unsupported claims.
-   Hide a negative aspect that the customer intentionally provided.
-   Create fake personal experiences.

------------------------------------------------------------------------

# 25. Customer Review Confirmation

After generation:

``` text
Your Review

[Generated Review Text]

Edit Review
```

The customer should be able to edit the text.

The customer remains responsible for deciding whether to publish the
review.

The system should not automatically submit the review to Google.

------------------------------------------------------------------------

# 26. Copy + Google Redirect

The primary action can be:

**Copy & Continue to Google**

The intended operation:

1.  Copy generated review text to the customer's clipboard.
2.  Record a Google redirect event.
3.  Redirect/open the business's configured Google review URL.

The system should handle cases where clipboard permission fails.

Fallback:

``` text
Copy Review
Continue to Google
```

This gives the customer control if automatic clipboard access is
unavailable.

------------------------------------------------------------------------

# 27. Google Review Measurement

The system should distinguish between:

### Review Draft Generated

AI successfully generated a review draft.

### Google Redirect

Customer clicked the Google continuation action.

### Verified Google Review

Only show this if actual Google review data can be reliably obtained
through an authorized mechanism.

Do not assume:

``` text
Google Redirect = Google Review Posted
```

because the customer can leave the Google page without submitting.

------------------------------------------------------------------------

# 28. Business Analytics

The business dashboard should contain core metrics.

## 28.1 QR Scans

Total number of QR sessions initiated.

Possible metrics:

-   Total scans.
-   Daily scans.
-   Weekly scans.
-   Monthly scans.
-   Unique sessions.

## 28.2 Question Sessions

Track:

-   Sessions started.
-   Sessions completed.
-   Abandoned sessions.

## 28.3 AI Generation

Track:

-   Generation requests.
-   Successful generations.
-   Failed generations.
-   Average generation time.

## 28.4 Google Redirects

Track:

-   Total Google redirect clicks.
-   Redirects by date.
-   Redirect rate from completed sessions.

------------------------------------------------------------------------

# 29. Conversion Funnel

A major dashboard feature should be the customer journey funnel.

Example:

``` text
QR Scans
1,000

        ↓

Customer Information Completed
850

        ↓

Questions Completed
790

        ↓

Review Generated
770

        ↓

Google Redirect
680
```

This helps the business identify where customers drop out.

Useful calculated rates:

``` text
Question Completion Rate
= Completed Sessions / Started Sessions

Generation Rate
= Generated Reviews / Completed Sessions

Google Redirect Rate
= Google Redirects / Generated Reviews
```

------------------------------------------------------------------------

# 30. Category Analytics

Every question belongs to a category.

Example:

``` text
Staff
Food
Service
Ambience
Waiting Time
Pricing
```

The system should calculate category-level metrics.

Example:

``` text
Staff        4.7 / 5
Food         4.5 / 5
Ambience     4.6 / 5
Service      4.1 / 5
Waiting      3.8 / 5
```

The business can identify areas requiring attention.

------------------------------------------------------------------------

# 31. Monthly Category Analysis

The system should allow businesses to understand trends.

Example:

``` text
Category       August    September    October

Food            4.3        4.5         4.6
Staff           4.5        4.6         4.7
Service         4.2        4.1         4.0
Waiting Time    4.0        3.8         3.7
```

This allows businesses to identify:

-   Improving areas.
-   Declining areas.
-   Stable areas.
-   Areas with insufficient data.

The system should show the number of responses alongside averages
because an average based on 3 responses is not equivalent to one based
on 300 responses.

------------------------------------------------------------------------

# 32. Category Distribution

Average rating alone is not sufficient.

For each category, the system can show:

``` text
Food

5 Star: 72%
4 Star: 18%
3 Star: 6%
2 Star: 3%
1 Star: 1%
```

This provides more context.

------------------------------------------------------------------------

# 33. Overall Customer Experience

The platform can calculate an overall feedback score from the questions
answered during sessions.

However, the product should clearly distinguish:

-   Customer feedback score collected by this platform.
-   Actual Google review rating.

They are not necessarily the same metric.

------------------------------------------------------------------------

# 34. Customer Management

The business should have a separate customer section.

Possible fields:

-   Customer ID
-   Name
-   Mobile number
-   First interaction
-   Last interaction
-   Number of sessions
-   Average feedback rating
-   Last feedback date

Customer history can show:

``` text
Customer:
Rahul

Sessions:
3

Average Feedback:
4.3

Last Visit:
2026-10-02
```

------------------------------------------------------------------------

# 35. Customer Feedback History

For each customer, the business can see historical feedback where
permitted.

Example:

``` text
Date:
2026-10-02

Staff:
5

Food:
4

Ambience:
5
```

Another session:

``` text
Date:
2026-09-12

Service:
4

Food:
5

Waiting Time:
3
```

This allows businesses to understand repeat customer experience.

------------------------------------------------------------------------

# 36. Customer Privacy

Because the system can collect names and mobile numbers, privacy must be
treated as a first-class requirement.

The system should provide:

-   Privacy notice.
-   Clear reason for collecting customer information.
-   Appropriate consent mechanisms where required.
-   Secure database storage.
-   Role-based access.
-   Data retention controls.
-   Ability to remove/anonymize customer data where legally required.
-   Audit logs for sensitive administrative access.

The system should not expose customer information publicly through QR
URLs.

------------------------------------------------------------------------

# 37. Event Tracking

The analytics system should record important events.

Example:

``` text
QR_SCANNED
SESSION_STARTED
CUSTOMER_INFO_SUBMITTED
QUESTION_VIEWED
QUESTION_ANSWERED
QUESTION_SESSION_COMPLETED
AI_GENERATION_STARTED
AI_GENERATION_COMPLETED
AI_GENERATION_FAILED
REVIEW_DISPLAYED
REVIEW_EDITED
REVIEW_COPIED
GOOGLE_REDIRECT_CLICKED
SESSION_ABANDONED
```

This event structure makes future analytics much easier.

------------------------------------------------------------------------

# 38. AI Request Handling

The AI generation system must support multiple simultaneous requests.

The application should not assume only one customer is generating a
review at a time.

Recommended architecture:

``` text
Customer
   |
   v
FastAPI API
   |
   v
Generation Job
   |
   v
Redis Queue
   |
   +---- Worker 1
   |
   +---- Worker 2
   |
   +---- Worker 3
   |
   v
AI Provider
   |
   v
Generated Review
   |
   v
Database
```

For a small MVP, asynchronous FastAPI requests can be sufficient.

As traffic increases, a Redis-backed worker queue should be introduced.

------------------------------------------------------------------------

# 39. AI Job States

Each generation request should have a state.

Possible states:

``` text
QUEUED
PROCESSING
COMPLETED
FAILED
RETRYING
```

The frontend can display appropriate status.

Example:

``` text
Creating your review...
```

If generation fails:

``` text
We couldn't generate your review right now.
Please try again.
```

The system should retry transient AI/API failures where appropriate.

------------------------------------------------------------------------

# 40. AI Rate Limiting and Abuse Prevention

The generation endpoint must be protected.

Controls can include:

-   IP-based rate limiting.
-   Session-based rate limiting.
-   Business-level usage limits.
-   Request validation.
-   Maximum input length.
-   AI timeout.
-   Retry limits.
-   Abuse detection.

A customer should not be able to repeatedly call the generation endpoint
thousands of times from the same session.

------------------------------------------------------------------------

# 41. AI Cost Control

The system should keep prompts concise.

Only necessary information should be sent to the AI.

For example:

``` text
Business type
Relevant categories
Ratings
Optional customer comment
Language
Generation rules
```

The system should not send the entire business database to the AI.

Caching may be used carefully when identical inputs produce the same
generation requirements.

------------------------------------------------------------------------

# 42. Multi-Tenant Architecture

The platform must support multiple businesses from the beginning.

Example:

``` text
Business A
Business B
Business C
Business D
...
```

Each business must have isolated data.

Core records should contain:

``` text
business_id
```

For example:

``` text
questions
------------------
id
business_id
category_id
question_text
status
```

And:

``` text
customer_sessions
------------------
id
business_id
customer_id
created_at
status
```

A business user must never be able to access another business's records.

------------------------------------------------------------------------

# 43. Recommended Core Data Model

A conceptual database structure:

``` text
users
    |
    +---- business_users
                |
                +---- businesses
                          |
                          +---- categories
                          |
                          +---- questions
                          |
                          +---- customer_sessions
                                      |
                                      +---- customer_answers
                                      |
                                      +---- review_generations
                                      |
                                      +---- analytics_events
```

Additional tables can include:

``` text
customers
business_settings
google_redirects
audit_logs
```

------------------------------------------------------------------------

# 44. Businesses Table

Example fields:

``` text
id
name
owner_name
email
phone
username
password_hash
category
address
google_review_url
logo
status
created_at
updated_at
deleted_at
```

Passwords should be represented by secure password hashes, not plaintext
values.

------------------------------------------------------------------------

# 45. Categories Table

Example:

``` text
id
business_id
name
description
status
created_at
updated_at
```

Example records:

``` text
1 | ABC Restaurant | Food
2 | ABC Restaurant | Staff
3 | ABC Restaurant | Ambience
```

------------------------------------------------------------------------

# 46. Questions Table

Example:

``` text
id
business_id
category_id
question_text
status
created_at
updated_at
```

A question remains associated with its original category for historical
reporting.

------------------------------------------------------------------------

# 47. Customer Sessions Table

Example:

``` text
id
business_id
customer_id
session_token
status
started_at
completed_at
created_at
```

The session token should be sufficiently random and should not contain
sensitive customer information.

------------------------------------------------------------------------

# 48. Customer Answers Table

Example:

``` text
id
session_id
question_id
category_id
rating
answer_text
answered_at
```

Storing category/question references at the time of response helps
preserve historical reporting even if the business later changes its
question configuration.

------------------------------------------------------------------------

# 49. Review Generations Table

Example:

``` text
id
session_id
business_id
prompt_version
input_snapshot
generated_text
final_text
status
provider
model
created_at
completed_at
```

`prompt_version` is useful because the AI generation rules may change
over time.

------------------------------------------------------------------------

# 50. Analytics Events Table

Example:

``` text
id
business_id
session_id
event_type
metadata
created_at
```

Examples:

``` text
QR_SCANNED
QUESTION_ANSWERED
AI_GENERATION_COMPLETED
REVIEW_COPIED
GOOGLE_REDIRECTED
```

------------------------------------------------------------------------

# 51. Security Requirements

The platform should implement:

-   Secure password hashing.
-   HTTPS.
-   Authentication.
-   Authorization.
-   Role-based access control.
-   Secure session/token management.
-   Rate limiting.
-   Input validation.
-   Output validation.
-   SQL injection protection.
-   XSS protection.
-   CSRF protection where applicable.
-   Secure HTTP headers.
-   Audit logging for administrative actions.
-   Secrets stored in environment/secret management systems.
-   No API keys exposed to the customer frontend.

------------------------------------------------------------------------

# 52. Business Data Isolation

Every authenticated business request should be checked against the
authenticated business identity.

Example principle:

``` text
Authenticated Business ID = 42

Requested Question ID = 991

System checks:

Question.business_id == 42
```

If not:

``` text
403 Forbidden
```

The frontend should never be trusted to provide the correct business ID.

The backend should derive tenant identity from authentication.

------------------------------------------------------------------------

# 53. QR Security

QR URLs should use public identifiers or random tokens.

Avoid:

``` text
/review/business/1
/review/business/2
```

as the only access mechanism if that makes enumeration easy.

Prefer:

``` text
/review/r/8F7K2M9P
```

or another secure public identifier.

The QR endpoint should expose only the information needed for the
customer journey.

------------------------------------------------------------------------

# 54. Error Handling

The system should handle:

### Invalid QR

``` text
This review link is no longer available.
```

### Inactive Business

``` text
This business is currently unavailable.
```

### Missing Google URL

The business should not be allowed to activate the review flow until the
Google URL is configured.

### AI Failure

``` text
Review generation is temporarily unavailable.
Please try again.
```

### Clipboard Failure

Provide manual copy functionality.

### Network Failure

Allow the customer to retry without losing already submitted answers
where practical.

------------------------------------------------------------------------

# 55. Business Analytics Dashboard - MVP

The initial dashboard should show:

``` text
Total QR Scans
Total Completed Sessions
Total AI Reviews Generated
Total Google Redirects
Average Feedback Rating
```

Then:

``` text
Category Performance

Staff       4.7
Food        4.5
Service     4.2
Ambience    4.6
```

And:

``` text
Recent Activity

Today       82 scans
Yesterday   74 scans
This Month  1,824 scans
```

------------------------------------------------------------------------

# 56. Reporting Filters

Business analytics should eventually support:

-   Today.
-   Yesterday.
-   Last 7 days.
-   Last 30 days.
-   This month.
-   Previous month.
-   Custom date range.

Category filters:

-   Staff.
-   Food.
-   Service.
-   Ambience.
-   Pricing.
-   Any business-defined category.

------------------------------------------------------------------------

# 57. Monthly Business Understanding

The system should provide meaningful summaries based on collected
feedback.

For example:

``` text
October Summary

Responses:
842

Overall Feedback:
4.42 / 5

Strongest Category:
Staff - 4.71

Lowest Category:
Waiting Time - 3.72

Compared with September:
Staff +0.12
Food +0.08
Waiting Time -0.21
```

Any automated interpretation should be based on sufficient data and
should clearly distinguish statistical observations from subjective
conclusions.

------------------------------------------------------------------------

# 58. Review Generation Quality Controls

The system should validate AI output before displaying it.

Checks can include:

-   Empty output.
-   Excessive length.
-   Unsupported claims.
-   Business policy violations.
-   Repetition.
-   Prompt injection attempts in customer input.
-   Personally identifiable information unnecessarily included in
    generated text.

The generated text should be treated as a draft.

------------------------------------------------------------------------

# 59. Review Authenticity Principle

The platform's core principle should be:

> AI assists the customer in expressing their own experience; AI does
> not manufacture the experience.

The customer provides the underlying ratings and optional comments.

The customer gets the opportunity to edit the generated draft.

The customer chooses whether to proceed to Google.

The system should not promise or guarantee a particular Google rating.

------------------------------------------------------------------------

# 60. Avoid Review Gating

The system should not implement a flow such as:

``` text
5 stars → Google
1-3 stars → Private feedback only
```

That would selectively route positive experiences toward public reviews.

Instead, customers should have a consistent opportunity to continue to
the business's Google review page.

The platform can separately provide businesses with structured feedback
analytics.

------------------------------------------------------------------------

# 61. Avoid Fake or Repetitive Reviews

The AI should not produce the same review for every customer.

Generation should be based on the actual session's answers and optional
comments.

The system should avoid:

-   Fixed review templates repeated across customers.
-   Fabricated details.
-   Automatically generated praise unrelated to answers.
-   Forced 5-star language.

The goal is natural variation derived from real customer input.

------------------------------------------------------------------------

# 62. Business-Level Question Examples

## Restaurant

``` text
Food
- How would you rate the food quality?

Staff
- How would you rate our staff?

Service
- How would you rate the service?

Ambience
- How would you rate the ambience?

Waiting Time
- How would you rate the waiting time?
```

## Jewellery Store

``` text
Collection
- How would you rate our collection?

Staff
- How would you rate the assistance from our staff?

Product Quality
- How would you rate the quality of the products?

Ambience
- How would you rate the store ambience?

Pricing
- How would you rate the overall value?
```

The business should control which questions are active.

------------------------------------------------------------------------

# 63. Complete Customer Journey

``` text
1. Customer sees QR code.

2. Customer scans QR.

3. System identifies business.

4. System creates session.

5. Customer provides requested information.

6. System retrieves active business questions.

7. System randomly selects 3 eligible questions.

8. Customer answers Question 1.

9. Customer answers Question 2.

10. Customer answers Question 3.

11. Answers are stored.

12. AI generation job is created.

13. AI generates review draft.

14. System validates the draft.

15. Draft is shown to customer.

16. Customer can edit the draft.

17. Customer clicks Copy & Continue to Google.

18. System attempts to copy the text.

19. System records Google redirect event.

20. Customer is redirected to the configured Google review page.

21. Business analytics are updated.
```

------------------------------------------------------------------------

# 64. Complete Business Journey

``` text
1. Super Admin creates business account.

2. Business receives login credentials.

3. Business logs in.

4. Business completes profile.

5. Business adds Google review URL.

6. Business creates categories.

7. Business creates questions.

8. Business activates questions.

9. System generates business QR code.

10. Business downloads/prints QR.

11. Customers scan QR.

12. Customer feedback begins accumulating.

13. Business dashboard receives analytics.

14. Business reviews category performance.

15. Business reviews customer feedback.

16. Business monitors monthly trends.
```

------------------------------------------------------------------------

# 65. Complete Super Admin Journey

``` text
1. Super Admin logs in.

2. Views all businesses.

3. Creates new business.

4. Provides business login details.

5. Business becomes active.

6. Super Admin can view/update business.

7. Super Admin can reset password.

8. Super Admin can deactivate business.

9. Super Admin can delete/soft-delete business.

10. Super Admin can inspect platform activity.
```

------------------------------------------------------------------------

# 66. Recommended MVP Technical Architecture

A practical initial architecture:

``` text
Frontend
   |
   v
FastAPI Backend
   |
   +-------------------+
   |                   |
   v                   v
PostgreSQL           Redis
   |                   |
   |                   v
   |               AI Workers
   |                   |
   |                   v
   |               AI Provider
   |
   v
Analytics / Data
```

Possible implementation:

-   Frontend: React or Next.js.
-   Backend: FastAPI.
-   Database: PostgreSQL.
-   Cache/queue: Redis.
-   Background jobs: Celery/RQ or an equivalent worker system.
-   AI: External LLM API.
-   QR generation: Server-side QR generation library.
-   Authentication: Secure JWT/session-based authentication.
-   Deployment: Docker-based deployment.

The exact technology can be changed without changing the product
requirements.

------------------------------------------------------------------------

# 67. Scalability Approach

The MVP should not be over-engineered.

Initial:

``` text
1 Backend
1 Database
1 Redis
1 Worker
```

As usage grows:

``` text
Load Balancer
      |
      +---- Backend 1
      +---- Backend 2
      +---- Backend 3
                |
              Redis
                |
        +-------+-------+
        |       |       |
     Worker  Worker  Worker
        |       |       |
        +-------+-------+
                |
             AI API
```

Because the API layer should remain stateless, additional backend
instances can be added horizontally.

------------------------------------------------------------------------

# 68. Observability

The production system should monitor:

-   API response time.
-   Error rate.
-   AI generation latency.
-   AI failures.
-   Queue length.
-   Worker failures.
-   Database performance.
-   Redis performance.
-   QR scan volume.
-   Review generation volume.
-   Google redirect volume.

Important alerts:

-   AI provider unavailable.
-   Queue growing abnormally.
-   Database unavailable.
-   High API error rate.
-   Excessive generation failures.

------------------------------------------------------------------------

# 69. Audit Logging

Important actions should be logged.

Examples:

``` text
SUPER_ADMIN_CREATED_BUSINESS
SUPER_ADMIN_UPDATED_BUSINESS
SUPER_ADMIN_RESET_PASSWORD
SUPER_ADMIN_DEACTIVATED_BUSINESS
BUSINESS_UPDATED_PROFILE
BUSINESS_CREATED_QUESTION
BUSINESS_DELETED_QUESTION
BUSINESS_UPDATED_GOOGLE_URL
```

Audit logs should contain:

-   Actor.
-   Action.
-   Target.
-   Timestamp.
-   Relevant metadata.

------------------------------------------------------------------------

# 70. Future Features

These are intentionally outside the initial MVP but can be added later.

## Multi-Branch Businesses

One business account can manage:

``` text
Branch A
Branch B
Branch C
```

Each branch can have:

-   Separate QR.
-   Separate Google URL.
-   Separate questions.
-   Separate analytics.

## Multiple Business Users

Business owners can create staff accounts.

Roles could include:

-   Owner.
-   Manager.
-   Staff.

## WhatsApp Integration

The business could send customers a feedback link after purchase.

## SMS Integration

Feedback link can be sent by SMS.

## Voice Feedback

Customer can speak instead of typing.

## Multilingual Review Generation

Support:

-   English.
-   Bengali.
-   Hindi.
-   Other languages.

## Advanced Analytics

-   Customer segmentation.
-   Repeat customer analysis.
-   Category correlation.
-   Trend detection.
-   Feedback summaries.

## Verified Google Review Analytics

If a legitimate integration becomes available, the platform can
separately import/compare actual Google review data.

------------------------------------------------------------------------

# 71. Product KPIs

The platform itself should monitor:

### Acquisition

-   Businesses created.
-   Active businesses.

### Customer Usage

-   QR scans.
-   Unique sessions.
-   Completed sessions.

### AI Usage

-   Generation requests.
-   Successful generations.
-   Failed generations.

### Google Funnel

-   Review drafts generated.
-   Review copies.
-   Google redirects.

### Feedback

-   Total category responses.
-   Average category ratings.
-   Monthly changes.

### Customer Database

-   Unique customers.
-   Returning customers.
-   Repeat feedback sessions.

------------------------------------------------------------------------

# 72. Most Important Product Metrics

For determining whether the product is actually useful, the most
important metrics are:

``` text
QR Scan Rate
        ↓
Feedback Completion Rate
        ↓
AI Generation Rate
        ↓
Google Redirect Rate
```

The platform should not use Google redirects as proof that a review was
posted.

A particularly important business metric is:

``` text
Google Redirects / Completed Feedback Sessions
```

because it measures how effectively the workflow helps customers
continue toward Google.

------------------------------------------------------------------------

# 73. MVP Success Criteria

The MVP should be considered successful if:

1.  Businesses can be created and managed by Super Admin.
2.  Businesses can configure their own questions.
3.  Businesses can configure their Google review URL.
4.  Businesses can generate a QR code.
5.  Customers can scan the QR.
6.  Customers can complete the three-question journey.
7.  The system can generate a review draft from the customer's actual
    inputs.
8.  Customers can edit the draft.
9.  Customers can copy the review.
10. Customers can continue to Google.
11. Business analytics correctly record every major event.
12. Category-level analytics are accurate.
13. Customer information is securely stored.
14. Multiple simultaneous AI requests can be handled.
15. One business cannot access another business's data.

------------------------------------------------------------------------

# 74. Product Boundary

The product is **not** intended to:

-   Automatically create fake Google reviews.
-   Automatically submit reviews to Google.
-   Guarantee 5-star reviews.
-   Hide negative customer experiences.
-   Selectively send only positive customers to Google.
-   Invent customer experiences.
-   Manipulate Google ratings.

The product is intended to:

-   Collect genuine customer feedback.
-   Help customers express that feedback naturally.
-   Provide structured business insights.
-   Make the process of leaving a genuine review easier.

------------------------------------------------------------------------

# 75. Final Product Definition

The product can be summarized as:

> **A multi-tenant SaaS platform that enables businesses to collect
> structured customer feedback through QR codes, intelligently select a
> small set of experience-based questions, use AI to turn the customer's
> own responses into a natural review draft, and provide a simple path
> to the business's Google review page while giving the business
> detailed analytics about customer experience across categories and
> over time.**

The three core components are:

### 1. Business Management

Super Admin creates and manages business accounts.

### 2. Customer Feedback & Review Assistant

Customers scan a QR, answer three dynamically selected questions,
receive an AI-assisted review draft, edit it if desired, copy it, and
continue to Google.

### 3. Business Analytics

Businesses see QR activity, feedback completion, AI generation, Google
redirects, customer information, category ratings, and monthly trends.

This creates a product that is more than a simple review generator:

``` text
              CUSTOMER EXPERIENCE
                       |
                       v
                    QR CODE
                       |
                       v
              STRUCTURED FEEDBACK
                       |
                       v
                AI REVIEW ASSIST
                       |
             +---------+---------+
             |                   |
             v                   v
       GOOGLE REVIEW       BUSINESS INSIGHTS
                               |
                               v
                    CATEGORY + MONTHLY
                         ANALYTICS
```

**Core value proposition:**

> **Make it easier for customers to express genuine experiences, while
> helping businesses understand what their customers actually think.**
