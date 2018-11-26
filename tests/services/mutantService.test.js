
import * as mutantService from '../../src/services/mutantService';
import * as dnaDAO from '../../src/daos/dna';
jest.mock('../../src/daos/dna');

describe('Mutants service', () => {

	test('Mutant positive result given example', async () => {
        const request = {
            body: JSON.stringify(
                {
                    dna:['ATGCGA','CAGTGC','TTATGT','AGAAGG','CCCCTA','TCACTG']
                }
            )
        };
        const result = await mutantService.isMutant(request);
        
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toBe('OK');
    });

    test('Mutant positive result from left to right', async () => {
        const request = {
            body: JSON.stringify(
                {
                    dna:['AAAAGA','TGGGGC','TTATGT','AGAAGG','TTCCTA','TCACTG']
                }
            )
        };
        const result = await mutantService.isMutant(request);
        
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toBe('OK');
    });
    
    test('Mutant positive result from top to bottom', async () => {
        const request = {
            body: JSON.stringify(
                {
                    dna:['ATGCGA','ACGTGC','ATATGT','AGAAGG','CCTCTA','TCACTG']
                }
            )
        };
        const result = await mutantService.isMutant(request);
        
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toBe('OK');
    });

    test('Mutant positive result diagonal from top to bottom', async () => {
        const request = {
            body: JSON.stringify(
                {
                    dna:['AGGCAA','CAGTGC','TGAGTT','AGAAGG','CCCCTA','TCACTG']
                }
            )
        };
        const result = await mutantService.isMutant(request);
        
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toBe('OK');
    });

    test('Mutant positive result diagonal from bottom to top', async () => {
        const request = {
            body: JSON.stringify(
                {
                    dna:['TTGCGA','CACTAC','TCAACT','CGAAGG','CCACTA','TCTCTG']
                }
            )
        };
        const result = await mutantService.isMutant(request);
        
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toBe('OK');
    });

    test('Mutant negative result', async () => {
        const request = {
            body: JSON.stringify(
                {
                    dna:['TTGCGA','CAGTGC','TTATGT','AGAAGG','TCCCTA','TCACTG']
                }
            )
        };
        const result = await mutantService.isMutant(request);
        
		expect(result.statusCode).toBe(403);
        expect(JSON.parse(result.body)).toBe('Forbidden');
    });
    
    test('Return dna stats', async () => { 
        const stats = await mutantService.stats();

        expect(stats.statusCode).toBe(200);
    });

    describe('Mutant check error', () => {
        beforeEach(() => {
            dnaDAO.save = jest.fn().mockImplementation(() => {
                throw new Error();
            });
        });
        afterEach(() => {
            dnaDAO.save = () => {return jest.fn()};
        });

        test('Expect an error', async () => {
            const request = {
                body: JSON.stringify(
                    {
                        dna:['ATGCGA','CAGTGC','TTATGT','AGAAGG','CCCCTA','TCACTG']
                    }
                )
            };

            try {
                await mutantService.isMutant(request);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe('Mutant stats error', () => {
        beforeEach(() => {
            dnaDAO.stats = jest.fn().mockImplementation(() => {
                throw new Error();
            });
        });
        afterEach(() => {
            dnaDAO.stats = () => {return jest.fn()};
        });

        test('Expect an error', async () => {
            try {
                await mutantService.stats();
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });
});