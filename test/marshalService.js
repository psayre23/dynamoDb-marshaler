'use strict';

var proxyquire = require('proxyquire');
var sinon = require('sinon');
var withData = require('leche').withData;
var marshalString = sinon.stub();
var marshalNumber = sinon.stub();
var marshalBoolean = sinon.stub();
var marshalNull = sinon.stub();
var marshalStringSet = sinon.stub();
var marshalNumberSet = sinon.stub();
var marshalList = sinon.stub();
var marshalMap = sinon.stub();
var unmarshalPassThrough = sinon.stub();
var unmarshalNumber = sinon.stub();
var unmarshalNumberSet = sinon.stub();
var unmarshalNull = sinon.stub();
var unmarshalMap = sinon.stub();
var unmarshalList = sinon.stub();
var marshalService = proxyquire('../lib/marshalService', {
    './commands/marshalString': marshalString,
    './commands/marshalNumber': marshalNumber,
    './commands/marshalBoolean': marshalBoolean,
    './commands/marshalNull': marshalNull,
    './commands/marshalStringSet': marshalStringSet,
    './commands/marshalNumberSet': marshalNumberSet,
    './commands/marshalList': marshalList,
    './commands/marshalMap': marshalMap,
    './commands/unmarshalPassThrough': unmarshalPassThrough,
    './commands/unmarshalNumber': unmarshalNumber,
    './commands/unmarshalNumberSet': unmarshalNumberSet,
    './commands/unmarshalNull': unmarshalNull,
    './commands/unmarshalMap': unmarshalMap,
    './commands/unmarshalList': unmarshalList
  });

describe('marshalService', function() {
  var invalidItem = new Buffer('foo');

  describe('marshal()', function() {
    it(
      'should only be formatted by first command which accepts the value, ' +
      'after which the loop is exited.',
      function() {
        var item = 42;
        var result;

        marshalString.withArgs(item, marshalService.marshal).returns(undefined);
        marshalNumber.withArgs(item, marshalService.marshal).returns({N: '42'});

        result = marshalService.marshal(item);

        marshalString.calledOnce.should.equal(true);
        marshalNumber.calledOnce.should.equal(true);
        // exits early after marshalNumber handles the item.
        marshalBoolean.callCount.should.equal(0);
        marshalNull.callCount.should.equal(0);
        marshalStringSet.callCount.should.equal(0);
        marshalNumberSet.callCount.should.equal(0);
        marshalList.callCount.should.equal(0);
        marshalMap.callCount.should.equal(0);

        result.should.eql({N: '42'});
      }
    );

    withData({
      'empty value': [
        '',
        'Marshaling error: encountered empty value'
      ],
      'unexpected value': [
        invalidItem,
        'Marshaling error: encountered unexpected item ' +
        invalidItem.toString()
      ]
    }, function(item, errorMessage) {
      it(
        'should throw a type error if none of the marshaler commands' +
        'can handle the item',
        function() {
          marshalString
            .withArgs(item, marshalService.marshal)
            .returns(undefined);
          marshalNumber
            .withArgs(item, marshalService.marshal)
            .returns(undefined);
          marshalBoolean
            .withArgs(item, marshalService.marshal)
            .returns(undefined);
          marshalNull
            .withArgs(item, marshalService.marshal)
            .returns(undefined);
          marshalStringSet
            .withArgs(item, marshalService.marshal)
            .returns(undefined);
          marshalNumberSet
            .withArgs(item, marshalService.marshal)
            .returns(undefined);
          marshalList
            .withArgs(item, marshalService.marshal)
            .returns(undefined);
          marshalMap
            .withArgs(item, marshalService.marshal)
            .returns(undefined);

          marshalService
            .marshal
            .bind(null, item)
            .should
            .throw(TypeError, {message: errorMessage});
        }
      );
    });
  });

  describe('unmarshal()', function() {
    it(
      'should only return the unmarshaled value returned by the first ' +
      'unmarshaler command which accepts the item',
      function() {
        var item = {N: '42'};
        var result;

        unmarshalPassThrough
          .withArgs(item, marshalService.unmarshal)
          .returns(undefined);
        unmarshalNumber
          .withArgs(item, marshalService.unmarshal)
          .returns(42);

        result = marshalService.unmarshal(item);

        unmarshalPassThrough.calledOnce.should.equal(true);
        unmarshalNumber.calledOnce.should.equal(true);
        unmarshalNumberSet.callCount.should.equal(0);
        unmarshalNull.callCount.should.equal(0);
        unmarshalMap.callCount.should.equal(0);
        unmarshalList.callCount.should.equal(0);

        result.should.eql(42);
      }
    );

    it(
      'should throw a type error if the none of the unmarshal commands ' +
      'can handle the item',
      function() {
        var item = {UNKNOWN: 'unknown'};

        unmarshalPassThrough
          .withArgs(item, marshalService.unmarshal)
          .returns(undefined);
        unmarshalNumber
          .withArgs(item, marshalService.unmarshal)
          .returns(undefined);
        unmarshalNumberSet
          .withArgs(item, marshalService.unmarshal)
          .returns(undefined);
        unmarshalNull
          .withArgs(item, marshalService.unmarshal)
          .returns(undefined);
        unmarshalMap
          .withArgs(item, marshalService.unmarshal)
          .returns(undefined);
        unmarshalList
          .withArgs(item, marshalService.unmarshal)
          .returns(undefined);

        marshalService
          .unmarshal
          .bind(null, item)
          .should
          .throw(
            TypeError,
            {message: 'Unmarshal error: encountered unexpected item ' + item}
          );
      }
    );
  });
});
