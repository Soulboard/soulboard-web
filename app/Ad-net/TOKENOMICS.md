# Ad-Net Tokenomics Implementation

This document outlines the tokenomics implementation for the Ad-Net protocol, which facilitates the exchange of advertising space on physical displays for ADC tokens.

## Overview

The Ad-Net protocol leverages the Metal token infrastructure to implement a tokenomics system where:

1. Advertisers purchase ADC tokens through a simulated swap (in demo mode)
2. Advertisers allocate tokens to campaigns targeting specific physical displays
3. Display owners receive payment based on performance metrics
4. The protocol automatically distributes payments on an hourly basis

## ADC Token

The ADC (Ad Network Coin) token is the utility token that powers the Ad-Net ecosystem. In a production environment, ADC would be traded against USDC in a liquidity pool following the Uniswap curve model.

For the demo implementation, we simulate token purchases by directly distributing tokens from the merchant account to advertisers.

## Workflow

### 1. Initial Setup

- The protocol initializes the ADC token via Metal API
- The protocol creates holder accounts for:
  - Advertisers
  - Display owners

### 2. Advertiser Flow

1. **Purchase ADC Tokens**
   - Advertiser specifies USD amount
   - Backend calculates ADC tokens to distribute
   - Tokens are distributed from merchant account to advertiser's holder

2. **Create Campaign**
   - Advertiser selects displays and campaign duration
   - ADC tokens are withdrawn from advertiser's holder to escrow account
   - Campaign details are stored with display allocations and hourly rate

3. **Update Allocations**
   - Advertiser can update display allocations based on performance data
   - No additional tokens are required, just reallocation of the budget

### 3. Performance & Payment Flow

1. **Record Performance**
   - Each display's performance metrics (views, engagements) are tracked
   - Metrics are associated with specific time slots

2. **Process Payments**
   - An hourly cron job processes payments for active campaigns
   - Payment calculation includes:
     - A minimum guaranteed amount (10% of hourly rate)
     - Performance-based amount (90% of hourly rate, allocated by views)
   - Tokens are withdrawn from escrow to display owners' holders

3. **Performance Analytics**
   - Advertisers can view campaign performance data
   - Data can be filtered by different time frames (hourly, daily, weekly)

## API Endpoints

### Tokenomics API

- `/api/tokenomics/initialize-token` - Create the ADC token on Metal
- `/api/tokenomics/create-holder` - Create holder accounts for users
- `/api/tokenomics/purchase-adc` - Purchase ADC tokens (simulated swap)
- `/api/tokenomics/deposit-to-escrow` - Transfer tokens to escrow for campaigns
- `/api/tokenomics/process-display-payments` - Process payments to display owners
- `/api/tokenomics/campaign-performance` - Get campaign performance data
- `/api/tokenomics/update-campaign-allocation` - Update campaign display allocations
- `/api/tokenomics/trigger-hourly-payments` - Manually trigger the hourly payment process

## Metal Integration

This implementation uses the [Metal Token Cloud API](https://api.metal.build) for token creation, distribution, and holder management. Key Metal API endpoints utilized:

- `/merchant/create-token` - Create the ADC token
- `/token/:address/distribute` - Distribute tokens to holders
- `/holder/:userId` - Create and manage holder accounts
- `/holder/:userId/withdraw` - Transfer tokens between holders

## Development

To set up the tokenomics backend:

1. Set your Metal API key in environment variables:
   ```
   METAL_API_KEY=your_api_key_here
   ```

2. Set your ADC token address & escrow holder address after creation:
   ```
   ADC_TOKEN_ADDRESS=0x...
   ESCROW_ADDRESS = 0x00
   ```

## Implementation Notes

- For demo purposes, we use mock data instead of database integration
- In production, you would implement a database to store campaign data, performance metrics, and payment history
- The hourly payment process would be handled by a real cron job or cloud scheduler 