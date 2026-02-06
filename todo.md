# Iconic AI Leads - Project TODO

## Core Lead Generation System

### Database & Backend
- [x] Create partners table (stores partner business info and niche)
- [x] Create leads table (stores generated leads)
- [x] Create nicheMappings table (maps niches to lead sources)
- [x] Define Drizzle schema with relations
- [x] Create database migrations

### Lead Generation API
- [x] getAvailableNiches - returns list of supported niches
- [x] getNicheSourceMapping - returns best lead sources for each niche
- [x] generateLeadsForNiche - generates sample leads for a niche
- [x] getTodaysHotLeads - retrieves today's leads for a partner
- [x] getPartnerProfile - gets partner information
- [x] updatePartnerNiche - updates partner's selected niche

### Frontend - Leads Dashboard
- [x] Create leads page component with niche selection
- [x] Display "Today's Hot Leads" with business details
- [x] Show qualification scores and lead sources
- [x] Add generate leads button with loading state
- [x] Display contact information (email, phone)
- [x] Show employee count and online presence assessment
- [x] Add email/call action buttons for each lead

### Frontend - Home Page
- [x] Create "Grandma-Simple" landing page
- [x] Add authentication flow (login/logout)
- [x] Display features overview
- [x] Show pricing tiers ($111, $222, $333)
- [x] Add "How It Works" section
- [x] Add CTA buttons to leads page

### Routing & Navigation
- [x] Add /leads route to App.tsx
- [x] Add navigation between Home and Leads pages
- [x] Add header with branding and navigation

### Testing
- [x] Write unit tests for leads router
- [x] Test getAvailableNiches functionality
- [x] Test getNicheSourceMapping functionality
- [x] Test partner profile retrieval
- [x] All tests passing (9 tests)

## Stripe Payment Integration (COMPLETED)

### Setup & Configuration
- [x] Stripe feature added to project
- [x] API keys auto-configured
- [x] Pricing tiers defined (Basic $111, Agency Partner $222, Elite $333)
- [x] Webhook endpoint registered at /api/stripe/webhook

### Database Schema
- [x] Added stripeCustomerId to users table
- [x] Added Stripe fields to partners table
- [x] Created subscriptions table for tracking events

### API Endpoints
- [x] POST /api/stripe/webhook - Webhook handler
- [x] trpc.payment.getPricingTiers - List pricing tiers
- [x] trpc.payment.createCheckoutSession - Create checkout
- [x] trpc.payment.getSubscriptionStatus - Get user subscription
- [x] trpc.payment.cancelSubscription - Cancel subscription

### Frontend Pages
- [x] /pricing - Full pricing page with checkout
- [x] Home page updated with pricing link

### Webhook Events Handled
- [x] checkout.session.completed
- [x] customer.subscription.updated
- [x] customer.subscription.deleted
- [x] invoice.payment_succeeded
- [x] invoice.payment_failed

## Features Not Yet Implemented

### Lead Generation Enhancement
- [ ] Integrate real AI to pull leads from actual sources (Google Business, LinkedIn, Yelp, etc.)
- [ ] Implement lead qualification scoring algorithm
- [ ] Add lead deduplication logic
- [ ] Implement daily scheduled lead generation (6 AM delivery)

### Partner Management
- [ ] Partner dashboard with usage stats
- [ ] Lead history and archive
- [ ] Lead export functionality (CSV, PDF)
- [ ] Lead filtering and search
- [ ] Show subscription status in dashboard

### Admin Features
- [ ] Admin dashboard
- [ ] Partner management interface
- [ ] Lead quality monitoring
- [ ] System analytics

### Communication
- [ ] Email notifications for new leads
- [ ] SMS notifications (optional)
- [ ] Lead delivery scheduling
- [ ] Notification preferences

### GoHighLevel Integration
- [ ] Connect to GoHighLevel CRM
- [ ] Auto-sync leads to GHL
- [ ] GHL contact creation
- [ ] Campaign integration

## Known Limitations

- Sample leads are currently hardcoded (5 per niche)
- No real data source integration yet
- Lead generation is manual (not automated)
- No email delivery system
- No admin interface
- Stripe test mode only (requires live keys after KYC)

## Next Priority Tasks

1. Test Stripe payment flow with test card (4242 4242 4242 4242)
2. Add subscription status to partner dashboard
3. Integrate real lead sources (Google Business API, LinkedIn, etc.)
4. Set up automated daily lead generation (6 AM delivery)
5. Add email notifications for new leads
6. Create admin dashboard
7. Connect to GoHighLevel

## Testing Instructions

### Stripe Test Mode
- Card: 4242 4242 4242 4242
- Expiration: Any future date (e.g., 12/25)
- CVC: Any 3-digit number
- Webhook testing: Use Stripe CLI or test event from dashboard

### Manual Testing Checklist
- [ ] Visit /pricing page
- [ ] Click "Get Started" on Agency Partner tier
- [ ] Complete checkout with test card
- [ ] Verify webhook received and subscription created
- [ ] Check partner subscription status updated
- [ ] Test subscription cancellation
- [ ] Verify all webhook events logged

## Deployment Notes

- Stripe test keys are auto-configured
- After KYC verification, update to live keys in Settings > Payment
- Webhook endpoint: https://your-domain.com/api/stripe/webhook
- Test webhook events before going live
- Set up Stripe CLI for local webhook testing
