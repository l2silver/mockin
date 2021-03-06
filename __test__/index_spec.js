
import {expect} from 'chai';
import {Range, fromJS, Map, OrderedMap, List, Seq, is} from 'immutable';

import {
	  convertArrayToOrderedMap
	, fromJSOrdered
	, transformResponse
	, mapState
	, wrapMapState
	, checkTWREntries
	, idArray
	, createOrderedMap
	, createMapObject
	
} from './../lib/';


describe('mapState', ()=>{
	it.skip('benchmark', ()=>{
		const input = Range(1,10000).reduce((list, value)=>{
			const initialObject = {
				id: value
				, fake_tests: [
					{
						  id: value
					}
				]
			};
			list.push(initialObject)
			return list
		},[])
		const startTime = new Date().getTime();
		fromJS(input)
		console.log('fromJS', new Date().getTime() - startTime);
		const globe = wrapMapState(fromJS(input), List(['tests']) ).get('fake_tests')
		//console.log(globe )
	})
	it('simple map', ()=>{
		const initialObject = {
			id: 1
			, fake_tests: [
				{
					  id: 1
				}
			]
		};
		const globe = Map({
			tests: Map({
				1: Map({
					id: 1
					, fake_testsTWR: List(['1'])
				})
			}),
			fake_tests: Map({
				1: Map({
					id: 1
				})
			}),
		});
		expect(wrapMapState(fromJS(initialObject), List(['tests', '1']))).to.equal(globe);	
	});

	it('simple', ()=>{
		const initialObject = {
			id: 1
			, fake_tests: [
				{id: 1}
			]
		};
		const globe = Map({
			tests: Map({
				1: Map({
					id: 1
					, fake_testsTWR: List(['1'])
					

				})
			}),
			fake_tests: Map({
				1: Map({
					id: 1
					
				})
			}),
		});

		expect(wrapMapState(fromJS(initialObject), List(['tests', '1']), Map())).to.equal(globe);	
	});

	it('simple w/ single', ()=>{
		const initialObject = {
			id: 1
			, child: 
				{id: 1}
		};
		const globe = Map({
			tests: Map({
				1: Map({
					id: 1
					, childTWR: '1'
				})
			}),
			children: Map({
				1: Map({
					id: 1
				})
			}),
		});

		expect(wrapMapState(fromJS(initialObject), List(['tests', '1']), Map())).to.equal(globe);	
	});

	it('deep relations', ()=>{
		const faker_tests = [{id: 1}];
		const fake_tests = [
				{
					id: 1
					, faker_tests
				}
			];
		const initialObject = {
			id: 1
			, fake_tests
		};
		const globe = Map({
			tests: Map({
				1: Map({
					id: 1
					, fake_testsTWR: List(['1'])
				})
			}),
			fake_tests: Map({
				1: Map({
					id: 1
					, faker_tests: List([Map({id: 1})])
					, faker_testsTWR: List(['1'])

				})
			}),
			faker_tests: Map({
				1: Map({
					id: 1
				})
			}),
		});


		expect(wrapMapState(fromJS(initialObject), List(['tests', '1']), Map())).to.equal(globe);	
	});
	it('array', ()=>{
		const initialObject = [{
			id: 1
		}];
		const globe = Map({
			tests: Map({
					1: Map({
						id: 1
					})
				})
		});


		expect(wrapMapState(fromJS(initialObject), List(['tests']), Map())).to.equal(globe);	
	});
	it('array with relations', ()=>{
		const fake_tests = [{id: 1}];
		const initialObject = [{
			id: 1,
			fake_tests
		}];
		const globe = Map({
			tests: Map({
					1: Map({
						id: 1
						, fake_tests: List([Map({id: 1})])
						, fake_testsTWR: List(['1'])
					})
				}),
			fake_tests: Map({
					1: Map({
						id: 1
					})
				})
		});
	expect(wrapMapState(fromJS(initialObject), List(['tests']), Map())).to.equal(globe);
	})
	
	it('idArray', ()=>{	
		expect(  is(idArray( fromJS([{id: 1}]) ), List(['1']) )).to.be.truth
	});

	it('createOrderedMap', ()=>{	
		expect(  is(createOrderedMap( fromJS([{id: 1}]) ), OrderedMap([['1', {id: 1}]]) ) ).to.be.truth
	});
		
	it('createMapObject', ()=>{
		expect(  is(
			createMapObject( 'fake_tests',  fromJS([{id: 1}]), List(['tests', '1']))
			,   Map({
					thisTree: List(['tests', '1', 'fake_tests'])
					, nextTree: List(['fake_testsTWR'])
					, nextObject: OrderedMap([['1', {id: 1}]])
					, thisObject: List(['1'])
				})
			)).to.be.truth
	});
});
