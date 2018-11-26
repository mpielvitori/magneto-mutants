
import {createLogger} from '../logger';
import AWS from 'aws-sdk';

const logger = createLogger(__filename);
const REGION = process.env.AWS_REGION || 'sa-east-1';
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE || 'dna-test';

AWS.config.update({region: REGION});

/**
 * Persist DNA record
 * @param {array<string>} dna
 * @param {boolean} mutant
 * @return {object}
*/
export async function save(dna, mutant) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  logger.info(`Saving dna`);
  const timestamp = new Date().getTime();
  const dnakey = dna.join('');

  const params = {
    TableName: DYNAMODB_TABLE,
    Item: {
      dnakey,
      mutant,
      createdAt: timestamp,
    },
  };

  try {
    const data = await dynamoDb.put(params).promise();
    logger.info(`DNA saved successfully`);
    return data;
  } catch (error) {
    logger.error(error.stack);
    throw error;
  }
}

/**
 * Mutants stats
 * @return {object}
 */
export async function stats() {
  try {
    const data = await scanDNATable();
    const humans = data.scannedCount - data.count;
    let ratio;
    if (humans > 0) {
      ratio = data.count / humans;
    } else {
      ratio = data.count > 0 ? 1 : 0;
    }
    return {
      count_mutant_dna: data.count,
      count_human_dna: data.scannedCount - data.count,
      ratio,
    };
  } catch (error) {
    logger.error(error.stack);
    throw error;
  }
}

/**
 * Paginated scan for DNA table
 * @return {object}
 */
async function scanDNATable() {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: DYNAMODB_TABLE,
    FilterExpression: 'mutant = :mutantValue',
    ExpressionAttributeValues: {
      ':mutantValue': true,
    },
    Select: 'COUNT',
  };

  let scannedCount = 0;
  let count = 0;
  let remainingData = true;
  let result;
  while (remainingData) {
    result = await dynamoDb.scan(params).promise();
    scannedCount += result.ScannedCount;
    count += result.Count;

    if (result.LastEvaluatedKey) {
      params.ExclusiveStartKey = result.LastEvaluatedKey;
    } else {
      remainingData = false;
    }
  }

  return {
    scannedCount,
    count,
  };
}
