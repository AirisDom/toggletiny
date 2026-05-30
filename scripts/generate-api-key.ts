import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const ENV_FILE = path.join(process.cwd(), '.env');
const API_KEY_VAR = 'API_KEY';

function generateApiKey(): string {
  return `tt_${crypto.randomBytes(32).toString('hex')}`;
}

function main() {
  let envContent = '';

  if (fs.existsSync(ENV_FILE)) {
    envContent = fs.readFileSync(ENV_FILE, 'utf-8');

    if (envContent.includes(`${API_KEY_VAR}=`)) {
      console.log('API_KEY already exists in .env file');
      return;
    }
  }

  const apiKey = generateApiKey();
  const newLine = envContent.endsWith('\n') || envContent === '' ? '' : '\n';
  const apiKeyLine = `\n# API key for consumption endpoint\n${API_KEY_VAR}="${apiKey}"\n`;

  fs.writeFileSync(ENV_FILE, envContent + newLine + apiKeyLine);

  console.log('Generated new API key and saved to .env file');
  console.log(`Your API key is: ${apiKey}`);
  console.log('\nUse this key in requests to /api/flags:');
  console.log('  - Header: Authorization: Bearer <your-api-key>');
  console.log('  - Or header: x-api-key: <your-api-key>');
}

main();
