// All your JavaScript code here
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import * as firebaseDatabase from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

//  web app's Firebase configuration (deprecated)
const firebaseConfig = {
    apiKey: "AIzaSyC0ZvnYHwvcWiyKRtg_026ZMswZLLQiPQc",
    authDomain: "wproj2-4a1fa.firebaseapp.com",
    databaseURL: "https://wproj2-4a1fa-default-rtdb.firebaseio.com",
    projectId: "wproj2-4a1fa",
    storageBucket: "wproj2-4a1fa.appspot.com",
    messagingSenderId: "396681884110",
    appId: "1:396681884110:web:f6c08309a9d07ee064fb9f",
    measurementId: "G-1YWKTJCVFW"
};

    // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = firebaseDatabase.getDatabase(app);
const itemsRef = firebaseDatabase.ref(db, 'items');  

document.getElementById('toggleTheme').addEventListener('click', function() {
    if (document.body.classList.contains('light-theme')) {
        // If it's currently light theme, switch to dark theme
        document.body.classList.remove('light-theme');
        document.querySelectorAll('input, textarea, select, button').forEach(el => {
            el.classList.remove('light-theme');
        });
    } else {
        // If it's currently dark theme, switch to light theme
        document.body.classList.add('light-theme');
        document.querySelectorAll('input, textarea, select, button').forEach(el => {
            el.classList.add('light-theme');
        });
    }
});
// Function to add a new item
function addItem(event) {
    event.preventDefault();
    console.log("Adding item..."); // log statement
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;
    const newItem = {
        name,
        description,
        image
    };
    firebaseDatabase.push(itemsRef, newItem).then(() => {
        console.log("Item added successfully!");
    }).catch((error) => {
        console.log("Error adding item:", error);
    });
    document.getElementById('addItemForm').reset();
} // Function to display items in the table
function displayItems() {
    // Get a reference to the child node of the itemsRef reference that we want to listen for changes to
    firebaseDatabase.onValue(itemsRef, snapshot => {
    const data = snapshot.val();
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; // Clear the existing list

    for(let key in data) {
        const item = data[key];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${key}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td><img src="${item.image}" alt="${item.name}" width="100"></td>
            <td><button data-edit-id="${key}">Edit</button> | <button class="remove-button" data-id="${key}">Remove</button>
        `;
        itemList.appendChild(row);
            }
              
        const editButtons = document.querySelectorAll("[data-edit-id]");
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                editItem(this.getAttribute('data-edit-id'));
            });
        });
        const removeButtons = document.querySelectorAll(".remove-button");
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
            removeItem(this.getAttribute('data-id'));
        });
    });
});
} // Function to search for an item by keyword or ID
function searchItem() {
    const searchInput = document.getElementById('searchInput').value;
    firebaseDatabase.get(itemsRef).then(snapshot => {
        const data = snapshot.val();
        const searchResult = [];
        for(let key in data) {
            const item = data[key];
            if(item.name.includes(searchInput) || key === searchInput) {
                searchResult.push({
                    ...item,
                    id: key
                });
            }
        }
        displaySearchedItems(searchResult);
    });
}

function displaySearchedItems(items) {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; // Clear the existing list

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td><img src="${item.image}" alt="${item.name}" width="100"></td>
            <td><button>Edit</button> | <button class="remove-button" data-id="${item.id}">Remove</button></td>
        `;
        itemList.appendChild(row);
    });const removeButtons = document.querySelectorAll(".remove-button");
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            removeItem(this.getAttribute('data-id'));
        });
    });


}
// Function to edit an item (only name, description, and image can be edited)
function editItem(id) {
    const newName = prompt('Enter the New Name:');
    const newDescription = prompt('Enter the New Price:');
    const newImage = prompt('Enter the New Image URL:');

    if (newName && newDescription && newImage) {
        const updatedItem = {
            name: newName,
            description: newDescription,
            image: newImage
        };

        // Get a reference to the specific item
        const itemRef = firebaseDatabase.ref(db, 'items/' + id);

        // Update the item
        firebaseDatabase.set(itemRef, updatedItem)
        .then(() => {
            console.log("Item updated successfully!");
            displayItems(); // Re-display the items after updating
        })
        .catch((error) => {
            console.error("Error updating item:", error);
        });
    }
}// Function to remove an item
function removeItem(id) {
    const confirmDelete = confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
        const itemRef = firebaseDatabase.ref(db, 'items/' + id);
        firebaseDatabase.remove(itemRef)
        .then(() => {
            console.log("Item removed successfully!");
            displayItems(); // Re-display the items after removal
        })
        .catch((error) => {
            console.error("Error removing item:", error);
        });
    }
}

function sortItemsByID() {
    firebaseDatabase.get(itemsRef).then(snapshot => {
        const data = snapshot.val();
        const itemsArray = [];
        for(let key in data) {
            itemsArray.push({
                ...data[key],
                id: key
            });
        }
        itemsArray.sort((a, b) => a.id.localeCompare(b.id)); // Sort by ID
        displaySortedItems(itemsArray);
    });
}function sortItemsByName() {
    firebaseDatabase.get(itemsRef).then(snapshot => {
        const data = snapshot.val();
        const itemsArray = [];
        for(let key in data) {
            itemsArray.push({
                ...data[key],
                id: key
            });
        }
        itemsArray.sort((a, b) => a.name.localeCompare(b.name)); // Sort by Name
        displaySortedItems(itemsArray);
    });
}

function displaySortedItems(items) {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; // Clear the existing list

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td><img src="${item.image}" alt="${item.name}" width="100"></td>
            <td><button>Edit</button> | <button class="remove-button" data-id="${item.id}">Remove</button></td>
        `;
        itemList.appendChild(row);
    });
    const removeButtons = document.querySelectorAll(".remove-button");
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            removeItem(this.getAttribute('data-id'));
        });
    });
}
// Event listeners for adding a new item and search
document.getElementById('addItemForm').addEventListener('submit', addItem);
document.getElementById('searchButton').addEventListener('click', searchItem);

//Event listeners to sort
document.getElementById('sortByID').addEventListener('click', sortItemsByID);
document.getElementById('sortByName').addEventListener('click', sortItemsByName);

displayItems();
