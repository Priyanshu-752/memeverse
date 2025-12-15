'use client';

import { useState } from 'react';
import { migrateToHighScores, verifyMigration } from '@/lib/migrate-high-scores';
import Link from 'next/link';

export default function MigrationToolPage() {
  const [migrating, setMigrating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleMigration = async () => {
    setMigrating(true);
    setResult('Starting migration...');
    
    try {
      const migrationResult = await migrateToHighScores();
      
      if (migrationResult.success) {
        setResult(`✓ Migration successful! Migrated ${migrationResult.migratedCount} users.`);
      } else {
        setResult(`✗ Migration failed: ${migrationResult.error}`);
      }
    } catch (error: any) {
      setResult(`✗ Error: ${error.message}`);
    } finally {
      setMigrating(false);
    }
  };

  const handleVerification = async () => {
    setVerifying(true);
    setResult('Verifying migration...');
    
    try {
      const isValid = await verifyMigration();
      
      if (isValid) {
        setResult('✓ Verification successful! All data migrated correctly.');
      } else {
        setResult('⚠ Warning: Verification found inconsistencies. Check console for details.');
      }
    } catch (error: any) {
      setResult(`✗ Error: ${error.message}`);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Migration Tools</h1>
          <p className="text-gray-600 mt-2">Migrate existing user scores to the high scores collection</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">What does this do?</h2>
            <p className="text-gray-700 mb-2">
              This migration tool copies all existing user scores from the <code className="bg-gray-100 px-2 py-1 rounded">users</code> collection 
              to a new <code className="bg-gray-100 px-2 py-1 rounded">highScores</code> collection.
            </p>
            <p className="text-gray-700 mb-2">
              The <code className="bg-gray-100 px-2 py-1 rounded">users</code> collection will continue to store the latest game scores, 
              while <code className="bg-gray-100 px-2 py-1 rounded">highScores</code> will track each user's personal best scores.
            </p>
            <p className="text-yellow-700 bg-yellow-50 p-3 rounded mt-4">
              ⚠️ <strong>Note:</strong> Run this migration only once. Running it multiple times is safe but unnecessary.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleMigration}
              disabled={migrating}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {migrating ? 'Migrating...' : 'Run Migration'}
            </button>

            <button
              onClick={handleVerification}
              disabled={verifying}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {verifying ? 'Verifying...' : 'Verify Migration'}
            </button>
          </div>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.startsWith('✓') ? 'bg-green-50 text-green-800' :
              result.startsWith('⚠') ? 'bg-yellow-50 text-yellow-800' :
              result.startsWith('✗') ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              <pre className="whitespace-pre-wrap font-mono text-sm">{result}</pre>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Technical Details:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Creates a new Firebase collection: <code>highScores</code></li>
              <li>Preserves all existing data in <code>users</code> collection</li>
              <li>Rankings page will now display highest scores instead of latest</li>
              <li>Future game plays will automatically update high scores when beaten</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
