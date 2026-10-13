import test from 'node:test';import assert from 'node:assert/strict';import {project,unproject} from '../map.js';
test('Mercator coordinates round trip across hemispheres',()=>{for(const [lat,lon]of [[43.12,131.9],[-33.9,18.4],[0,0],[80,-120]]){const result=unproject(...project(lat,lon,8),8);assert.ok(Math.abs(result[0]-lat)<1e-6);assert.ok(Math.abs(result[1]-lon)<1e-6)}});
