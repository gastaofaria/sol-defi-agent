# Mamo Protocol Deployment Steps

This document outlines the deployment process for the Mamo protocol as implemented in `script/DeploySystem.s.sol`.

## Prerequisites

Before running the deployment, ensure:
- Environment variable `DEPLOY_ENV` is set (defaults to `8453_PROD`)
- Configuration file exists at `./deploy/{DEPLOY_ENV}.json`
- Addresses directory exists at `./addresses` with chain-specific JSON files
- Deployer account has sufficient funds for deployment and gas fees

## Deployment Configuration

The deployment reads configuration from:
- **Config file**: `./deploy/{DEPLOY_ENV}.json` - Contains deployment parameters like version, chain ID, admin addresses, and reward token configurations
- **Addresses folder**: `./addresses` - Contains existing contract addresses for the target chain

## Deployment Steps

### Step 1: Deploy MamoStrategyRegistry

**Purpose**: Deploy the central registry that coordinates all strategies, tracks ownership, and manages implementations.

**Details**:
- Executes: `StrategyRegistryDeploy.deployStrategyRegistry(addresses, config)`
- The registry is NOT upgradeable to ensure ownership guarantees remain immutable
- Initial deployer gets `DEFAULT_ADMIN_ROLE`

**Output**: MamoStrategyRegistry contract address

---

### Step 2: Deploy SlippagePriceChecker

**Purpose**: Deploy the price validation contract that protects users from unfavorable swaps using Chainlink oracles.

**Details**:
- Executes: `DeploySlippagePriceChecker.deploySlippagePriceChecker(addresses, config)`
- Initial owner is the deployer (will be transferred later)

**Output**: SlippagePriceChecker contract address

---

### Step 3: Configure SlippagePriceChecker for Reward Tokens

**Purpose**: Set up price feeds and parameters for all reward tokens that strategies will swap.

**Details**:
- For each reward token in the config:
  - Adds token configuration mapping reward token → USDC
  - Configures Chainlink price feed address
  - Sets reverse flag (determines if feed is TOKEN/USD or USD/TOKEN)
  - Sets heartbeat (maximum age for price data)
- After configuration, transfers ownership to the multisig

**Configuration Parameters**:
- `from`: Reward token address (e.g., WELL, MORPHO)
- `to`: Target token address (currently always USDC)
- `priceFeed`: Chainlink oracle address
- `reverse`: Boolean flag for price feed direction
- `heartbeat`: Maximum seconds before price is considered stale

---

### Step 4: Deploy USDC Strategy Implementation

**Purpose**: Deploy the implementation contract that will be used by all user strategy proxies.

**Details**:
- Executes: `USDCStrategyImplDeployer.deployImplementation(addresses)`
- Deploys `ERC20MoonwellMorphoStrategy` implementation
- This is the logic contract; users will get proxy instances

**Output**: Strategy implementation contract address (stored as `MOONWELL_MORPHO_STRATEGY_IMPL`)

---

### Step 5: Whitelist USDC Strategy Implementation

**Purpose**: Register the implementation in the registry as an approved strategy type.

**Details**:
- Calls: `registry.whitelistImplementation(usdcStrategyImplementation, 0)`
- Parameter `0` is the previous implementation ID (0 for first implementation)
- Returns a `strategyTypeId` used to identify this implementation type

**Output**: Strategy type ID for the whitelisted implementation

---

### Step 6: Grant Admin Role to Multisig

**Purpose**: Transfer administrative control to the multisig wallet.

**Details**:
- Executes: `registry.grantRole(DEFAULT_ADMIN_ROLE, MAMO_MULTISIG)`
- Multisig address is read from the addresses configuration
- Both deployer and multisig have admin role at this point

---

### Step 7: Revoke Admin Role from Deployer

**Purpose**: Remove deployer's administrative privileges, leaving only the multisig as admin.

**Details**:
- Executes: `registry.revokeRole(DEFAULT_ADMIN_ROLE, msg.sender)`
- Ensures deployer cannot perform administrative actions after deployment
- Only multisig retains admin control

---

### Step 8: Deploy USDCStrategyFactory

**Purpose**: Deploy the factory contract that will create new user strategy instances.

**Details**:
- Executes: `StrategyFactoryDeployer.deployStrategyFactory(addresses, config, strategyTypeId, deployerEOA)`
- Links factory to the whitelisted implementation via `strategyTypeId`
- Factory will create minimal proxies pointing to the implementation

**Output**: USDCStrategyFactory contract address

---

## Post-Deployment Actions

### Update Addresses File
- All newly deployed contract addresses are saved to the addresses JSON file
- Executes: `addresses.updateJson()`
- Prints changes to console for verification

### Validation

The deployment script validates all critical parameters:

1. **Registry Roles**:
   - Multisig has `DEFAULT_ADMIN_ROLE`
   - Deployer does NOT have `DEFAULT_ADMIN_ROLE`

2. **SlippagePriceChecker Ownership**:
   - Owner is the multisig

3. **Reward Token Configurations**:
   - Each reward token is registered
   - Price feed addresses match config
   - Reverse flags match config
   - Heartbeats match config
   - Max price valid time is set correctly

4. **Strategy Implementation**:
   - Implementation is whitelisted in the registry

If any validation fails, the deployment transaction reverts.

## Running the Deployment

### Command
```bash
make deploy-broadcast
```

Or manually:
```bash
export DEPLOY_ENV="8453_PROD"
forge script script/DeploySystem.s.sol:DeploySystem \
  --fork-url base \
  --account mamo-test \
  --verify \
  --slow \
  -vvvvv \
  --broadcast \
  --sender 0xDca82E03057329f53Ed4173429D46B0511E46Fb8
```

### Environment Variables Required
- `BASE_RPC_URL`: RPC endpoint for Base network
- `BASESCAN_API_KEY`: API key for contract verification
- `DEPLOY_ENV`: Environment configuration (e.g., "8453_PROD", "8453_TESTING")

## Security Considerations

1. **Role Management**: Admin roles are immediately transferred to multisig and revoked from deployer
2. **Ownership Transfer**: SlippagePriceChecker ownership is transferred to multisig after configuration
3. **Implementation Whitelisting**: Only approved implementations can be used for user strategies
4. **Price Feed Configuration**: All reward tokens have validated price feeds before strategies can swap them
5. **Validation**: Comprehensive post-deployment checks ensure correct configuration

## Key Addresses After Deployment

- `MAMO_STRATEGY_REGISTRY`: Central registry contract
- `SLIPPAGE_PRICE_CHECKER`: Price validation contract
- `MOONWELL_MORPHO_STRATEGY_IMPL`: Strategy implementation
- `USDC_STRATEGY_FACTORY`: Factory for creating user strategies
- `MAMO_MULTISIG`: Administrative multisig (has admin role and ownership)

## Notes

- The registry is not upgradeable by design to maintain trust in ownership guarantees
- Strategy implementations can be upgraded per-user through the registry
- All user funds remain in user-controlled strategy contracts
- The multisig has timelock for critical operations (DEFAULT_ADMIN_ROLE)
- A separate GUARDIAN_ROLE can be configured for emergency pause functionality
