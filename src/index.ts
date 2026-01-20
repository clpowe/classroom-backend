import { eq } from 'drizzle-orm';
import { db } from './db';

async function main() {
    try {
        console.log('Performing CRUD operations...');
    } catch (error) {
        console.error('❌ Error performing CRUD operations:', error);
        process.exit(1);
    }
}

main();
