# Magneto mutants exercise
### AWS Lambda + API Gateway + DynamoDB

![](https://img.shields.io/badge/NodeJS-v8.10.0-brightgreen.svg) ![](https://img.shields.io/badge/ECMAScript-7-brightgreen.svg) ![](https://img.shields.io/badge/Babel-6.26.3-brightgreen.svg) ![](https://img.shields.io/badge/ServerlessOffline-3.23.0-brightgreen.svg) ![](https://img.shields.io/badge/jest-21.2.1-brightgreen.svg) ![](https://img.shields.io/badge/Docker-18.09.0-brightgreen.svg)

[![MP](https://sistemaglobal.com.ar/assets/images/logoTeckelBit.png)](http://mpielvitori.github.io/)

### Usage
#### isMutant function
Check DNA and persist data
* **URL**
  _/mutant/_

* **Method:**
  `POST`
  
*  **BODY Params**
    ```json
    {
        "dna":["@@@@@@","@@@@@@","@@@@@@","@@@@@@","@@@@@@","@@@@@@"]
    }
    ```

* **Success Response:**
  * **Code:** 200-OK 
    **Content:** `"OK"`
 
* **Error Response:**

  * **Code:** 403-Forbidden
    **Content:** `"Forbidden"`

  * **Code:** 500 Internal Server Error
    **Content:** `"Error message"`

#### stats function
Return mutants stats
* **URL**
  _/stats/_

* **Method:**
  `GET`

* **Success Response:**
  * **Code:** 200-OK 
    **Content:** `"OK"`
 
* **Error Response:**

  * **Code:** 500 Internal Server Error
    **Content:** 
    ```json
    {
        "count_mutant_dna": #,
        "count_human_dna": #,
        "ratio": #
    }
    ```

### Make environment
Create a configuration file in ```./config/config.<stage>.json``` with the following format:
```json
{
	"DNA_DYNAMODB_ROLE": <awsRole>,
	"AWS_REGION": <awsRegion>,
	"DNA_DYNAMODB_TABLE": <DynamoDBTableName>
}
```

### Run unit tests
```sh
yarn test
```
Coverage can be seen in `./coverage/lcov-report/index.html`

### Simulate API Gateway locally using  [serverless-offline](https://github.com/dherault/serverless-offline)

```sh
yarn offline <stage>
```
### Build docker image
```sh
docker build -t mutants --build-arg APP_ENV=<stage> .
```

### Run container
```sh
docker run -p 4010:4010 --name mutants_1 -v ~/.aws:/root/.aws mutants
```

### Deploy on AWS
```sh
yarn deploy <stage>
```