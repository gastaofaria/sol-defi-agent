const express = require('express')
const axios = require('axios')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Endpoint to compare rates
app.get('/api/compare-rates', async (req, res) => {
  try {
    // Query Jupiter API for USDC lending rate
    const jupiterResponse = await axios.get('https://lite-api.jup.ag/lend/v1/earn/tokens')
    const usdcToken = jupiterResponse.data.find((token) => token.symbol === 'USDC' || token.name.includes('USDC'))

    if (!usdcToken) {
      return res.status(404).json({ error: 'USDC token not found in Jupiter API' })
    }

    const jupiterNaturalApy = usdcToken.supplyRate / 100
    const jupiterIncentivesApy = usdcToken.rewardsRate / 100
    const jupiterTotalApy = usdcToken.totalRate / 100

    // Query Kamino API for vault metrics
    const kaminoResponse = await axios.get(
      'https://api.kamino.finance/kvaults/HDsayqAsDWy3QvANGqh2yNraqcD8Fnjgh73Mhb3WRS5E/metrics',
    )

    const kaminoNaturalApy = Number((kaminoResponse.data.apy * 100).toFixed(2))
    const kaminoIncentivesApy = Number((kaminoResponse.data.apyIncentives * 100).toFixed(2))
    const kaminoTotalApy = kaminoNaturalApy + kaminoIncentivesApy

    // Compare rates
    const comparison = {
      jupiter: {
        NaturalAPY: jupiterNaturalApy,
        IncentivesAPY: jupiterIncentivesApy,
        TotalAPY: jupiterTotalApy,
      },
      kamino: {
        NaturalAPY: kaminoNaturalApy,
        IncentivesAPY: kaminoIncentivesApy,
        TotalAPY: kaminoTotalApy,
      },
      naturalHighest: jupiterNaturalApy > kaminoNaturalApy ? 'Jupiter' : 'Kamino',
      naturalDifference: Math.abs(jupiterNaturalApy - kaminoNaturalApy),
      totalHighest: jupiterTotalApy > kaminoTotalApy ? 'Jupiter' : 'Kamino',
      totalDifference: Math.abs(jupiterTotalApy - kaminoTotalApy),
    }

    res.json(comparison)
  } catch (error) {
    console.error('Error fetching rates:', error.message)
    res.status(500).json({
      error: 'Failed to fetch rates',
      details: error.message,
    })
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Compare rates at: http://localhost:${PORT}/api/compare-rates`)
})
