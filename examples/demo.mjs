import assert from 'node:assert/strict';
import EventScheduler from '../dist/src/EventScheduler.js';
const schedule=new EventScheduler();
schedule.addEvent({id:'design-review',name:'Design review / Revisão de projeto',date:new Date('2026-10-01T14:00:00Z')});
assert.equal(schedule.getEventsByDate(new Date('2026-10-01')).length,1);
console.log(schedule.toJSON());
