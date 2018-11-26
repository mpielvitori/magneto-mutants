
import * as dao from '../../src/daos/dna';
import * as AWS from 'aws-sdk-mock';
import {DynamoDB} from 'aws-sdk';

describe('DNA DAO', () => {
    describe('DynamoDB creation', () => {
        beforeEach(() => {
            AWS.mock('DynamoDB.DocumentClient', 'put', function (params, callback){
                callback(null, {});
            });
        });
        afterEach(() => {
            AWS.restore('DynamoDB.DocumentClient');
        });

        test('Save dna', async () => {
            const dna = ['AAAAAA','AAAAAA','AAAAAA','AAAAAA','AAAAAA','AAAAAA'];

            const result = await dao.save(dna, true);
            
            expect(result).toBeDefined();
        });
    });

    describe('DynamoDB creation error', async () => {
        beforeEach(() => {
            AWS.mock('DynamoDB.DocumentClient', 'put', function (params, callback){
                throw new Error();
            });
        });
        afterEach(() => {
            AWS.restore('DynamoDB.DocumentClient');
        });

        test('Save dna error', async () => {
            const dna = ['AAAAAA','AAAAAA','AAAAAA','AAAAAA','AAAAAA','AAAAAA'];
            try {
                await dao.save(dna, true);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe('Empty mutants stats', () => {
        beforeEach(() => {
            AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback){
                callback(null, {
                    ScannedCount: 0,
                    Count: 0,                    
                });
            });
        });
        afterEach(() => {
            AWS.restore('DynamoDB.DocumentClient');
        });

        test('Return stats', async () => { 
            const stats = await dao.stats();

            expect(stats.count_mutant_dna).toBe(0);
            expect(stats.count_human_dna).toBe(0);
            expect(stats.ratio).toBe(0);
        });
    });

    describe('Mutants stats more humans', () => {
        beforeEach(() => {
            AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback){
                callback(null, {
                    ScannedCount: 140,
                    Count: 40,                    
                });
            });
        });
        afterEach(() => {
            AWS.restore('DynamoDB.DocumentClient');
        });

        test('Return stats', async () => { 
            const stats = await dao.stats();

            expect(stats.count_mutant_dna).toBe(40);
            expect(stats.count_human_dna).toBe(100);
            expect(stats.ratio).toBe(0.4);
        });
    });

    describe('Mutants stats more mutants', () => {
        beforeEach(() => {
            AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback){
                callback(null, {
                    ScannedCount: 50,
                    Count: 40,                    
                });
            });
        });
        afterEach(() => {
            AWS.restore('DynamoDB.DocumentClient');
        });

        test('Return stats', async () => { 
            const stats = await dao.stats();

            expect(stats.count_mutant_dna).toBe(40);
            expect(stats.count_human_dna).toBe(10);
            expect(stats.ratio).toBe(4);
        });
    });

    describe('Mutants stats full ratio', () => {
        beforeEach(() => {
            AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback){
                callback(null, {
                    ScannedCount: 10,
                    Count: 10,                    
                });
            });
        });
        afterEach(() => {
            AWS.restore('DynamoDB.DocumentClient');
        });

        test('Return stats', async () => { 
            const stats = await dao.stats();

            expect(stats.count_mutant_dna).toBe(10);
            expect(stats.count_human_dna).toBe(0);
            expect(stats.ratio).toBe(1);
        });
    });

    describe('Mutants stats error', () => {
        beforeEach(() => {
            AWS.mock('DynamoDB.DocumentClient', 'scan', function (params, callback){
                throw new Error();
            });
        });
        afterEach(() => {
            AWS.restore('DynamoDB.DocumentClient');
        });

        test('Return error', async () => { 
            try {
                await dao.stats();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });
});