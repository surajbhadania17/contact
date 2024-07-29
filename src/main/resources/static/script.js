document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');
    const submitBtn = document.getElementById('submitBtn');
    const searchInput = document.getElementById('searchInput');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const formTitle = document.getElementById('formTitle');

    let currentPage = 0;
    const pageSize = 10;
    let totalContacts = 0;

    // Add/Update contact
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('contactId').value;
        const name = document.getElementById('name').value;
        const number = document.getElementById('number').value;

        let url = '/addContact';
        let method = 'POST';

        if (id) {
            url = `/updateContactById/${id}`;
            method = 'POST';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, number }),
        });

        if (response.ok) {
            loadContacts();
        }
    });

    

    // Search contacts
    searchInput.addEventListener('input', debounce(() => {
        currentPage = 0;
        loadContacts();
    }, 300));

    // Load more contacts
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        loadContacts(true);
    });

    // Load contacts function
    async function loadContacts(append = false) {
        const searchTerm = searchInput.value.toLowerCase();
        const response = await fetch('/getAllContacts');
        const contacts = await response.json();

        totalContacts = contacts.length;

        const filteredContacts = contacts.filter(contact => 
            contact.name.toLowerCase().includes(searchTerm) || 
            contact.number.includes(searchTerm)
        );

        const paginatedContacts = filteredContacts.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

        if (!append) {
            contactList.innerHTML = '';
        }

        paginatedContacts.forEach(contact => {
            const tr = document.createElement('tr');
            tr.className = 'fade-in';
            tr.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.number}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-icon update-btn" data-id="${contact.id}" data-name="${contact.name}" data-number="${contact.number}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon delete-btn" data-id="${contact.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            contactList.appendChild(tr);
        });

        // Add delete and update event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteContact);
        });
        document.querySelectorAll('.update-btn').forEach(btn => {
            btn.addEventListener('click', prepareUpdateContact);
        });

        // Show/hide load more button
        loadMoreBtn.style.display = (currentPage + 1) * pageSize < filteredContacts.length ? 'inline-block' : 'none';
    }

    // Delete contact function
    async function deleteContact(e) {
        if (!confirm('Are you sure you want to delete this contact?')) return;

        const id = e.target.closest('.delete-btn').getAttribute('data-id');
        const response = await fetch(`/deleteContactById/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            loadContacts();
        }
    }

    // Prepare update contact function
    function prepareUpdateContact(e) {
        const btn = e.target.closest('.update-btn');
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const number = btn.getAttribute('data-number');

        document.getElementById('contactId').value = id;
        document.getElementById('name').value = name;
        document.getElementById('number').value = number;
        submitBtn.textContent = 'Update Contact';
        formTitle.textContent = 'Update Contact';
    }

   

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initial load
    loadContacts();
});