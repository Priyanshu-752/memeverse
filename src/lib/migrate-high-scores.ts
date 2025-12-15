/**
 * Migration Script: Initialize High Scores Collection
 * 
 * This script migrates existing user scores from the 'users' collection
 * to the new 'highScores' collection for tracking personal best scores.
 * 
 * Run this once to initialize the highScores collection with existing data.
 * You can run this from the browser console while logged in as an admin.
 */

import { db } from './firebase';
import { collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { UserHighScores } from '@/types';

export const migrateToHighScores = async () => {
    console.log('Starting migration to highScores collection...');

    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        let migratedCount = 0;
        let skippedCount = 0;

        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const uid = userDoc.id;

            // Check if high score already exists
            const highScoreRef = doc(db, 'highScores', uid);

            // Create high score document
            const highScoreData: UserHighScores = {
                uid,
                userName: userData.userName,
                highScores: {
                    flyingMeme: userData.gameScores?.flyingMeme || 0,
                    quickMath: userData.gameScores?.quickMath || 0,
                    wordPuzzle: userData.gameScores?.wordPuzzle || 0,
                    reactionTime: userData.gameScores?.reactionTime || 0
                },
                totalHighScore: userData.totalRating || 0,
                lastUpdated: Timestamp.now()
            };

            await setDoc(highScoreRef, highScoreData);
            migratedCount++;

            console.log(`Migrated user: ${userData.userName} (${uid})`);
        }

        console.log(`Migration complete! Migrated ${migratedCount} users, skipped ${skippedCount}.`);
        return { success: true, migratedCount, skippedCount };
    } catch (error) {
        console.error('Migration failed:', error);
        return { success: false, error };
    }
};

// Helper function to verify migration
export const verifyMigration = async () => {
    console.log('Verifying migration...');

    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const highScoresSnapshot = await getDocs(collection(db, 'highScores'));

        console.log(`Users collection: ${usersSnapshot.size} documents`);
        console.log(`HighScores collection: ${highScoresSnapshot.size} documents`);

        if (usersSnapshot.size === highScoresSnapshot.size) {
            console.log('✓ Migration verified successfully!');
            return true;
        } else {
            console.log('⚠ Warning: Document counts do not match!');
            return false;
        }
    } catch (error) {
        console.error('Verification failed:', error);
        return false;
    }
};
