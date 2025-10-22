# Backend Server

A simple Express.js backend server that compares lending rates between Jupiter and Kamino DeFi protocols on Solana.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

Install dependencies:

```bash
npm install
```

## Running the Server

Start the server:

```bash
node backend.js
```

The server will run on port 3000 by default (or the port specified in the `PORT` environment variable).

## API Endpoints

### Compare Rates

**GET** `/api/compare-rates`

Fetches and compares USDC lending rates from Jupiter and Kamino.

**Response:**
```json
{
  "jupiter": {
    "rate": 5.2,
    "source": "Jupiter (USDC)",
    "details": { ... }
  },
  "kamino": {
    "rate": 4.8,
    "source": "Kamino Vault",
    "apy": 0.045,
    "apyIncentives": 0.003
  },
  "higher": "Jupiter",
  "difference": 0.4
}
```

### Health Check

**GET** `/health`

Returns the server status.

**Response:**
```json
{
  "status": "ok"
}
```

## Example Usage

```bash
# Check server health
curl http://localhost:3000/health

# Compare lending rates
curl http://localhost:3000/api/compare-rates
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## API References

The server queries the following external APIs:

- **Jupiter Lending API**: `https://lite-api.jup.ag/lend/v1/earn/tokens`
- **Kamino Vault API**: `https://api.kamino.finance/kvaults/HDsayqAsDWy3QvANGqh2yNraqcD8Fnjgh73Mhb3WRS5E/metrics`
