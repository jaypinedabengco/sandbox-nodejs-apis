# sandbox-nodejs-apis

List of Sample APIs

## Installation

1. Download Code
2. run : npm install 
3. run : npm start

## APIs

#### Convert date based on country code and city
- url : /api/date/convert-by-location
- header : 
  - Content-Type : application/json
- sample json body request : 

 ```json
{
  "country_code": "us",
  "city": "Chicago",
  "date": "Tue Nov 29 2016 11:50:57"
}
```
  - note
    - city is optional
    
#### Get Zone name
- url : /api/date/get-zone-name
- header : 
  - Content-Type : application/json
- sample json body request : 

 ```json
{
  "country_code": "us",
  "city": "Chicago",
}
```
  - note
    - city is optional
    

