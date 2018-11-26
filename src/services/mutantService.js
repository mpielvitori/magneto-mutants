
import {createResponse} from '../util/lambdaUtils';
import {createLogger} from '../logger';
import * as dnaDAO from '../daos/dna';

const logger = createLogger(__filename);

/**
 * @param {object} event
 * @return {object}
*/
export async function isMutant(event) {
    const request = JSON.parse(event.body);
    logger.info(`Check if DNA: ${request.dna} is mutant`);

    let isMutant = checkDNA(request.dna);

    try {
        await dnaDAO.save(request.dna, isMutant);
    } catch (error) {
        logger.error(`A problem occurs persisting dna: ${error}`);
        return createResponse(error.message, 500);
    }

    if (isMutant) {
        return createResponse('OK');
    } else {
        return createResponse('Forbidden', 403);
    }
}

/**
 * @return {object}
*/
export async function stats() {
    logger.info(`DNA stats`);
    let result;

    try {
        result = await dnaDAO.stats();
    } catch (error) {
        logger.error(`A problem occurs persisting dna: ${error}`);
        return createResponse(error.message, 500);
    }

    return createResponse(result);
}

/**
 * Check DNA matrix
 * @param {array<string>} arr
 * @return {boolean}
 */
function checkDNA(arr) {
    let len = arr.length;
    let top = len - 4;
    let max = len - 1;
    let matchCount = 0;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j <= top; j++) {
            // Compara fila izq-der
            if (
                arr[i][j] === arr[i][j+1] &&
                arr[i][j] === arr[i][j+2] &&
                arr[i][j] === arr[i][j+3]
            ) {
                matchCount++;
                if (matchCount === 2) {
                    return true;
                }
            }
            // Compara columna arr-aba
            if (
                arr[j][i] === arr[j+1][i] &&
                arr[j][i] === arr[j+2][i] &&
                arr[j][i] === arr[j+3][i]
            ) {
                matchCount++;
                if (matchCount === 2) {
                    return true;
                }
            }
            // Compara diagonal izq-arr -> der-aba
            if (
                i <= top &&
                arr[i][j] === arr[i+1][j+1] &&
                arr[i][j] === arr[i+2][j+2] &&
                arr[i][j] === arr[i+3][j+3]
            ) {
                matchCount++;
                if (matchCount === 2) {
                    return true;
                }
            }
            // Compara diagonal izq-aba -> der-arr
            if (
                i <= top &&
                arr[max-i][j] === arr[max-i-1][j+1] &&
                arr[max-i][j] === arr[max-i-2][j+2] &&
                arr[max-i][j] === arr[max-i-3][j+3]
            ) {
                matchCount++;
                if (matchCount === 2) {
                    return true;
                }
            }
        }
    }

    return false;
}
