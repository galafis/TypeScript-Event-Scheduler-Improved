import EventScheduler from '../dist/EventScheduler.js';

const scheduler = new EventScheduler();

const eventIdInput = document.getElementById('eventId');
const eventNameInput = document.getElementById('eventName');
const eventDateInput = document.getElementById('eventDate');
const eventDescriptionInput = document.getElementById('eventDescription');
const addEventBtn = document.getElementById('addEventBtn');
const eventsList = document.getElementById('eventsList');

const filterDateInput = document.getElementById('filterDate');
const filterEventsBtn = document.getElementById('filterEventsBtn');
const filteredEventsList = document.getElementById('filteredEventsList');

function renderEvents(listElement, events) {
    listElement.innerHTML = '';
    if (events.length === 0) {
        listElement.innerHTML = '<li>No events found.</li>';
        return;
    }
    events.forEach(event => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${event.name}</strong> (${new Date(event.date).toLocaleDateString()}) - ${event.description || 'No description'}</span>
            <button data-id="${event.id}">Delete</button>
        `;
        li.querySelector('button').addEventListener('click', (e) => {
            scheduler.deleteEvent(e.target.dataset.id);
            renderAllEvents();
            renderFilteredEvents();
        });
        listElement.appendChild(li);
    });
}

function renderAllEvents() {
    const allEvents = scheduler.getAllEvents();
    renderEvents(eventsList, allEvents);
}

function renderFilteredEvents() {
    if (!filterDateInput.value) {
        filteredEventsList.innerHTML = '<li>Please select a date to filter.</li>';
        return;
    }
    const dateToFilter = new Date(filterDateInput.value);
    const filtered = scheduler.getEventsByDate(dateToFilter);
    renderEvents(filteredEventsList, filtered);
}

addEventBtn.addEventListener('click', () => {
    const id = eventIdInput.value;
    const name = eventNameInput.value;
    const date = new Date(eventDateInput.value);
    const description = eventDescriptionInput.value;

    if (id && name && eventDateInput.value) {
        const success = scheduler.addEvent({ id, name, date, description });
        if (success) {
            eventIdInput.value = '';
            eventNameInput.value = '';
            eventDateInput.value = '';
            eventDescriptionInput.value = '';
            renderAllEvents();
            renderFilteredEvents();
        } else {
            alert('Event with this ID already exists!');
        }
    } else {
        alert('Please fill in Event ID, Name, and Date.');
    }
});

filterEventsBtn.addEventListener('click', renderFilteredEvents);

// Initial render
renderAllEvents();

