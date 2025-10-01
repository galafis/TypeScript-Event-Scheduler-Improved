"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventScheduler {
    constructor() {
        this.events = new Map();
    }
    addEvent(event) {
        if (this.events.has(event.id)) {
            return false; // Event with this ID already exists
        }
        this.events.set(event.id, event);
        return true;
    }
    getEvent(id) {
        return this.events.get(id);
    }
    updateEvent(id, updatedEvent) {
        const existingEvent = this.events.get(id);
        if (!existingEvent) {
            return false; // Event not found
        }
        this.events.set(id, Object.assign(Object.assign({}, existingEvent), updatedEvent));
        return true;
    }
    deleteEvent(id) {
        return this.events.delete(id);
    }
    getAllEvents() {
        return Array.from(this.events.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
    }
    normalizeDate(d) {
        return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    }
    getEventsByDate(date) {
        const normalizedSearchDate = this.normalizeDate(date);
        return this.getAllEvents().filter(event => this.normalizeDate(event.date) === normalizedSearchDate);
    }
}
exports.default = EventScheduler;
