const axios = require('axios')

// Store current protocol and APY
let currentProtocol = null
let currentAPY = null

// Function to fetch and compare rates
async function fetchAndCompareRates() {
  try {
    console.log(`[${new Date().toISOString()}] Fetching rates...`)

    // Query Jupiter API for USDC lending rate
    const jupiterResponse = await axios.get('https://lite-api.jup.ag/lend/v1/earn/tokens')
    const usdcToken = jupiterResponse.data.find((token) => token.symbol === 'USDC' || token.name.includes('USDC'))

    if (!usdcToken) {
      console.error('USDC token not found in Jupiter API')
      return
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

    // Determine which protocol has higher APY
    const highestProtocol = jupiterTotalApy > kaminoTotalApy ? 'Jupiter' : 'Kamino'
    const highestAPY = Math.max(jupiterTotalApy, kaminoTotalApy)

    // Check if we need to swap protocols
    const previousProtocol = currentProtocol
    if (currentProtocol !== highestProtocol) {
      currentProtocol = highestProtocol
      if (previousProtocol !== null) {
        console.log(`\n🔄 PROTOCOL SWAP: ${previousProtocol} -> ${currentProtocol}`)
        console.log(`   Previous APY: ${currentAPY}% | New APY: ${highestAPY}%`)
      }
    }

    // Update current APY
    currentAPY = highestAPY

    console.log('\n=== Rate Comparison ===')
    console.log('Jupiter:', comparison.jupiter)
    console.log('Kamino:', comparison.kamino)
    console.log(`Natural APY Winner: ${comparison.naturalHighest} (difference: ${comparison.naturalDifference.toFixed(2)}%)`)
    console.log(`Total APY Winner: ${comparison.totalHighest} (difference: ${comparison.totalDifference.toFixed(2)}%)`)
    console.log('\n📊 Current Status:')
    console.log(`   Protocol: ${currentProtocol}`)
    console.log(`   APY: ${currentAPY}%`)
    console.log('=======================\n')
  } catch (error) {
    console.error('Error fetching rates:', error.message)
  }
}

// Fetch rates immediately on startup
console.log('Starting rate comparison service...')
fetchAndCompareRates()

// Schedule rate fetching every minute (60000ms)
setInterval(fetchAndCompareRates, 60000)
console.log('Service will fetch rates every 60 seconds')
