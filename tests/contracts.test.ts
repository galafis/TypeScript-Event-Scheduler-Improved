import EventScheduler from "../src/EventScheduler";
describe("Schedule contracts", () => {
  test("defensive copies protect stored dates", () => {
    const s = new EventScheduler();
    const event = {
      id: "a",
      name: "Demo",
      date: new Date("2026-01-01T10:00:00Z"),
    };
    s.addEvent(event);
    event.date.setFullYear(2030);
    s.getEvent("a")!.date.setFullYear(2040);
    expect(s.getEvent("a")!.date.toISOString()).toBe(
      "2026-01-01T10:00:00.000Z",
    );
  });
  test("invalid updates are atomic", () => {
    const s = new EventScheduler();
    s.addEvent({ id: "a", name: "Demo", date: new Date("2026-01-01") });
    expect(s.updateEvent("a", { name: "", date: new Date("bad") })).toBe(false);
    expect(s.getEvent("a")!.name).toBe("Demo");
  });
  test("UTC boundary is exclusive of next day", () => {
    const s = new EventScheduler();
    s.addEvent({
      id: "a",
      name: "Late",
      date: new Date("2026-01-01T23:59:59Z"),
    });
    s.addEvent({
      id: "b",
      name: "Next",
      date: new Date("2026-01-02T00:00:00Z"),
    });
    expect(s.getEventsByDate(new Date("2026-01-01")).map((e) => e.id)).toEqual([
      "a",
    ]);
  });
  test("import rejects duplicates without clearing existing data", () => {
    const s = new EventScheduler();
    s.addEvent({ id: "a", name: "Demo", date: new Date("2026-01-01") });
    const before = s.toJSON();
    const event = { id: "b", name: "Duplicate", date: "2026-02-01T00:00:00Z" };
    expect(() => s.importJSON(JSON.stringify([event, event]))).toThrow();
    expect(s.toJSON()).toBe(before);
  });
  test("roundtrip preserves instants", () => {
    const s = new EventScheduler();
    s.importJSON(
      '[{"id":"a","name":"Offset","date":"2026-01-01T23:00:00-03:00"}]',
    );
    expect(s.getEvent("a")!.date.toISOString()).toBe(
      "2026-01-02T02:00:00.000Z",
    );
    const restored = new EventScheduler();
    restored.importJSON(s.toJSON());
    expect(restored.toJSON()).toBe(s.toJSON());
  });
});
