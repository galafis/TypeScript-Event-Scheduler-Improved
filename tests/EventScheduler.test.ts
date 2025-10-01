import EventScheduler from '../src/EventScheduler';

describe('EventScheduler', () => {
  let scheduler: EventScheduler;

  beforeEach(() => {
    scheduler = new EventScheduler();
  });

  it('should add an event', () => {
    const event = { id: '1', name: 'Meeting', date: new Date('2025-10-26T10:00:00Z') };
    expect(scheduler.addEvent(event)).toBe(true);
    expect(scheduler.getEvent('1')).toEqual(event);
  });

  it('should not add an event with a duplicate ID', () => {
    const event1 = { id: '1', name: 'Meeting', date: new Date('2025-10-26T10:00:00Z') };
    const event2 = { id: '1', name: 'Another Meeting', date: new Date('2025-10-26T11:00:00Z') };
    scheduler.addEvent(event1);
    expect(scheduler.addEvent(event2)).toBe(false);
    expect(scheduler.getEvent('1')).toEqual(event1);
  });

  it('should get an event by ID', () => {
    const event = { id: '2', name: 'Presentation', date: new Date('2025-10-27T14:00:00Z') };
    scheduler.addEvent(event);
    expect(scheduler.getEvent('2')).toEqual(event);
  });

  it('should return undefined for a non-existent event', () => {
    expect(scheduler.getEvent('99')).toBeUndefined();
  });

  it('should update an existing event', () => {
    const event = { id: '3', name: 'Workshop', date: new Date('2025-10-28T09:00:00Z') };
    scheduler.addEvent(event);
    const updatedName = 'Daily Standup';
    expect(scheduler.updateEvent('3', { name: updatedName })).toBe(true);
    expect(scheduler.getEvent('3')?.name).toBe(updatedName);
  });

  it('should not update a non-existent event', () => {
    expect(scheduler.updateEvent('99', { name: 'NonExistent' })).toBe(false);
  });

  it('should delete an event', () => {
    const event = { id: '4', name: 'Lunch', date: new Date('2025-10-29T12:00:00Z') };
    scheduler.addEvent(event);
    expect(scheduler.deleteEvent('4')).toBe(true);
    expect(scheduler.getEvent('4')).toBeUndefined();
  });

  it('should not delete a non-existent event', () => {
    expect(scheduler.deleteEvent('99')).toBe(false);
  });

  it('should return all events sorted by date', () => {
    const event1 = { id: '5', name: 'Event A', date: new Date('2025-10-30T10:00:00Z') };
    const event2 = { id: '6', name: 'Event B', date: new Date('2025-10-29T10:00:00Z') };
    scheduler.addEvent(event1);
    scheduler.addEvent(event2);
    const allEvents = scheduler.getAllEvents();
    expect(allEvents.length).toBe(2);
    expect(allEvents[0]).toEqual(event2);
    expect(allEvents[1]).toEqual(event1);
  });

  it('should return events for a specific date', () => {
    const date = new Date('2025-10-31T00:00:00Z');
    const event1 = { id: '7', name: 'Daily Scrum', date: new Date('2025-10-31T09:00:00Z') };
    const event2 = { id: '8', name: 'Client Call', date: new Date('2025-10-31T14:00:00Z') };
    const event3 = { id: '9', name: 'Another Day Event', date: new Date('2025-11-01T10:00:00Z') };
    scheduler.addEvent(event1);
    scheduler.addEvent(event2);
    scheduler.addEvent(event3);
    const eventsOnDate = scheduler.getEventsByDate(date);
    expect(eventsOnDate.length).toBe(2);
    expect(eventsOnDate).toContainEqual(event1);
    expect(eventsOnDate).toContainEqual(event2);
  });
});
