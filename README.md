[![Build Status](https://travis-ci.org/CascadeEnergy/dynamoDb-marshaler.svg?branch=master)](https://travis-ci.org/CascadeEnergy/dynamoDb-marshaler)
dynamoDb-marshaler
===

[![NPM](https://nodei.co/npm/dynamodb-marshaler.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/dynamodb-marshaler/)

Translates sane javascript objects (and JSON) into DynamoDb format and vice versa.

**Caveat** Does not yet work with Binary types (B and BS). I have personally never come across
a case where I'm using binary types in json. If you need binary support, please let me know how it might be done, or contribute.

## Why?

Translation of DynamoDb `AttributeValue` objects is cumbersome and makes working with the [aws-sdk-js](https://github.com/aws/aws-sdk-js)
more difficult than it needs to be. This library abstracts away the verbose tiresome mappings and lets you work with standard javascript (JSON) data like
you're used to.

## Install

```
npm install dynamodb-marshaler
```

## Basic Marshaling

```javascript
var AWS = require('aws-sdk');
var marshalItem = require('dynamodb-marshaler').marshalItem;
    
AWS.config.region = 'us-west-2';
var dynamoDb = new AWS.DynamoDB();

dynamoDb.putItem({
  TableName: 'users',
  Item: marshalItem({username: 'nackjicholson'})  // {username: {S: 'nackjicholson'}}
});
```

## Basic Unmarshaling

```javascript
var AWS = require('aws-sdk');
var unmarshalItem = require('dynamodb-marshaler').unmarshalItem;
    
AWS.config.region = 'us-west-2';
var dynamoDb = new AWS.DynamoDB();

var data = dynamoDb.scan({
  TableName: 'users'
}, function(err, data) {
  // data.Items = [{username: {S: 'nackjicholson'}]
  var items = data.Items.map(unmarshalItem);
  console.log(items); // [{username: 'nackjicholson'}]
});
```

## JSON

You can marshal directly from a JSON string. Or unmarshal a DynamoDb api response into a JSON string. Use `marshalJson` and `unmarshalJson`.

## Examples

More extensive examples can be found in the [examples](https://github.com/CascadeEnergy/dynamoDb-marshaler/tree/master/examples) directory.

## Contributions

Please contribute. But make sure test coverage is 100% and that the code
complies with the [Cascade Energy Style Guide for NodeJs](https://github.com/CascadeEnergy/node-style-guide)
