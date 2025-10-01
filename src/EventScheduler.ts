interface Event {
  id: string;
  name: string;
  date: Date;
  description?: string;
}

class EventScheduler {
  private events: Map<string, Event>;

  constructor() {
    this.events = new Map<string, Event>();
  }

  addEvent(event: Event): boolean {
    if (this.events.has(event.id)) {
      return false; // Event with this ID already exists
    }
    this.events.set(event.id, event);
    return true;
  }

  getEvent(id: string): Event | undefined {
    return this.events.get(id);
  }

  updateEvent(id: string, updatedEvent: Partial<Event>): boolean {
    const existingEvent = this.events.get(id);
    if (!existingEvent) {
      return false; // Event not found
    }
    this.events.set(id, { ...existingEvent, ...updatedEvent });
    return true;
  }

  deleteEvent(id: string): boolean {
    return this.events.delete(id);
  }

  getAllEvents(): Event[] {
    return Array.from(this.events.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private normalizeDate(d: Date): string {
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  }

  getEventsByDate(date: Date): Event[] {
    const normalizedSearchDate = this.normalizeDate(date);
    return this.getAllEvents().filter(event =>
      this.normalizeDate(event.date) === normalizedSearchDate
    );
  }
}

export default EventScheduler;
