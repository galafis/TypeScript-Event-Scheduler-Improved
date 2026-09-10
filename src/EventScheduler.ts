export interface ScheduledEvent {
  id: string;
  name: string;
  date: Date;
  description?: string;
}

/** In-memory schedule. Calendar queries use UTC; returned dates are defensive copies. */
export default class EventScheduler {
  private readonly events = new Map<string, ScheduledEvent>();

  private valid(event: ScheduledEvent): boolean {
    return (
      typeof event.id === "string" &&
      event.id.trim().length > 0 &&
      typeof event.name === "string" &&
      event.name.trim().length > 0 &&
      event.date instanceof Date &&
      Number.isFinite(event.date.getTime()) &&
      event.date.getUTCFullYear() >= 0 &&
      event.date.getUTCFullYear() <= 9999 &&
      (event.description === undefined || typeof event.description === "string")
    );
  }

  private parseTimestamp(value: unknown): Date {
    const parts =
      typeof value === "string"
        ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|([+-])(\d{2}):(\d{2}))$/.exec(
            value,
          )
        : null;
    if (!parts)
      throw new TypeError("Expected ISO timestamp / instante ISO esperado");
    const [year, month, day, hour, minute, second] = parts
      .slice(1, 7)
      .map(Number);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > days[month - 1] ||
      hour > 23 ||
      minute > 59 ||
      second > 59 ||
      (parts[8] !== "Z" && (Number(parts[10]) > 23 || Number(parts[11]) > 59))
    ) {
      throw new TypeError(
        "Invalid calendar timestamp / instante de calendário inválido",
      );
    }
    return new Date(value as string);
  }

  private copy(event: ScheduledEvent): ScheduledEvent {
    return { ...event, date: new Date(event.date.getTime()) };
  }

  addEvent(event: ScheduledEvent): boolean {
    if (!event || !this.valid(event) || this.events.has(event.id)) return false;
    this.events.set(event.id, this.copy(event));
    return true;
  }

  getEvent(id: string): ScheduledEvent | undefined {
    const event = this.events.get(id);
    return event ? this.copy(event) : undefined;
  }

  updateEvent(
    id: string,
    changes: Partial<Omit<ScheduledEvent, "id">>,
  ): boolean {
    const current = this.events.get(id);
    if (!current || !changes) return false;
    const candidate = { ...current, ...changes, id };
    if (!this.valid(candidate)) return false;
    this.events.set(id, this.copy(candidate));
    return true;
  }

  deleteEvent(id: string): boolean {
    return this.events.delete(id);
  }

  getAllEvents(): ScheduledEvent[] {
    return [...this.events.values()]
      .sort(
        (a, b) =>
          a.date.getTime() - b.date.getTime() || a.id.localeCompare(b.id),
      )
      .map((event) => this.copy(event));
  }

  getEventsByDate(date: Date): ScheduledEvent[] {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime()))
      throw new RangeError("Invalid date / data inválida");
    const day = date.toISOString().slice(0, 10);
    return this.getAllEvents().filter(
      (event) => event.date.toISOString().slice(0, 10) === day,
    );
  }

  toJSON(): string {
    return JSON.stringify(
      this.getAllEvents().map((event) => ({
        ...event,
        date: event.date.toISOString(),
      })),
      null,
      2,
    );
  }

  importJSON(source: string): void {
    const parsed: unknown = JSON.parse(source);
    if (!Array.isArray(parsed))
      throw new TypeError("Expected event array / lista de eventos esperada");
    const next = new EventScheduler();
    for (const record of parsed) {
      if (
        !record ||
        typeof record !== "object" ||
        Object.keys(record).some(
          (key) => !["id", "name", "date", "description"].includes(key),
        ) ||
        !next.addEvent({ ...record, date: this.parseTimestamp(record.date) })
      ) {
        throw new TypeError(
          "Invalid or duplicate event / evento inválido ou duplicado",
        );
      }
    }
    this.events.clear();
    for (const event of next.getAllEvents()) this.events.set(event.id, event);
  }
}
