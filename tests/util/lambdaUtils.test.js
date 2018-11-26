
import * as lambdaUtils from '../../src/util/lambdaUtils';

describe('Lambda response creator', () => {

    test('Default response', async () => {
        const result = lambdaUtils.createResponse();
        
		expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toBe('');
    });
    
    test('Custom response', async () => {
        const result = lambdaUtils.createResponse('Server error',500);
        
		expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toBe('Server error');
	});
});