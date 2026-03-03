import { getEconomicCalendar } from './lib/finnhub';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  try {
    const calendar = await getEconomicCalendar();
    console.log('--- Economic Calendar ---');
    console.log(JSON.stringify(calendar, null, 2));
    console.log('--- End ---');
  } catch (error) {
    console.error('Test Error:', error);
  }
}

test();
