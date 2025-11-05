const fs = require('fs');
const path = require('path');

/**
 * Export contract ABI to frontend
 * This script extracts the ABI from compiled contract artifacts
 * and exports it to the frontend for use in the application
 */
function exportABI() {
  const artifactsPath = path.join(__dirname, '../artifacts/contracts/PoolManager.sol/PoolManager.json');
  const frontendABIPath = path.join(__dirname, '../../frontend/lib/contracts/PoolManager.json');
  const frontendABITypesPath = path.join(__dirname, '../../frontend/lib/contracts/abi.ts');

  try {
    // Read the compiled contract artifact
    if (!fs.existsSync(artifactsPath)) {
      console.error('❌ Contract artifacts not found. Please compile the contracts first:');
      console.error('   cd contracts && npm run compile');
      process.exit(1);
    }

    const artifact = JSON.parse(fs.readFileSync(artifactsPath, 'utf8'));
    const { abi, contractName } = artifact;

    // Create frontend contracts directory if it doesn't exist
    const contractsDir = path.dirname(frontendABIPath);
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true });
    }

    // Export full artifact JSON
    fs.writeFileSync(frontendABIPath, JSON.stringify({ abi, contractName }, null, 2));

    // Export TypeScript-friendly ABI
    const abiString = JSON.stringify(abi, null, 2);
    const tsContent = `// Auto-generated from PoolManager contract
// Run: cd contracts && npm run export-abi
// Or: cd contracts && node scripts/export-abi.js

export const PoolManagerABI = ${abiString} as const;

export const PoolManagerContractName = '${contractName}';
`;

    fs.writeFileSync(frontendABITypesPath, tsContent);

    console.log('✅ ABI exported successfully!');
    console.log(`   - JSON: ${path.relative(process.cwd(), frontendABIPath)}`);
    console.log(`   - TypeScript: ${path.relative(process.cwd(), frontendABITypesPath)}`);
    console.log(`   - Functions: ${abi.filter(item => item.type === 'function').length}`);
    console.log(`   - Events: ${abi.filter(item => item.type === 'event').length}`);
  } catch (error) {
    console.error('❌ Error exporting ABI:', error.message);
    process.exit(1);
  }
}

exportABI();

