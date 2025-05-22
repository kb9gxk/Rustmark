let allClientsData = []; // Store the full data globally

$(document).ready(function () {
    // FETCHING DATA FROM JSON FILE
    $.getJSON("clients.json", function (data) {
        allClientsData = data.sort(function(a, b) {
            return a.NAME.localeCompare(b.NAME);
        });
        // DO NOT call renderTable(allClientsData) here
        // The table will remain hidden until a search is performed.
    }).fail(function() {
        $('#clientTableBody').html('<tr><td colspan="1" style="text-align: center; color: var(--primary-color);">Error loading client data. Please check clients.json.</td></tr>');
        // Hide the initial message if there's an error
        $('#initialMessage').hide();
    });

    // Set focus on the search bar when the page loads
    $('#clientSearch').focus();

    // Search functionality
    $('#clientSearch').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase().trim(); // Trim whitespace
        const $initialMessage = $('#initialMessage');
        const $noResults = $('#noResults');
        const $clientTable = $('#clientTable');

        if (searchTerm.length > 0) {
            $initialMessage.hide(); // Hide the initial message once typing starts
            const filteredClients = allClientsData.filter(client => {
                return client.NAME.toLowerCase().includes(searchTerm);
            });
            renderTable(filteredClients);
            $clientTable.show(); // Show the table only when there's a search term
        } else {
            // If search bar is empty, hide the table and show initial message
            $clientTable.hide();
            $noResults.hide(); // Hide no results as well
            $initialMessage.show(); // Show initial message again
        }
    });

    // Register the Service Worker (moved here from index.html)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
});

function renderTable(clientsToRender) {
    let clientRows = '';
    const $tableBody = $('#clientTableBody');
    const $noResults = $('#noResults');

    if (clientsToRender.length === 0) {
        $noResults.show(); // Show no results message
        $tableBody.empty(); // Clear existing rows
    } else {
        $noResults.hide(); // Hide no results message
        $.each(clientsToRender, function (key, value) {
            clientRows += '<tr>';
            clientRows += '<td><a href="#" onclick="location.href=\'rustdesk://' + value.ID + '\'">' + value.NAME + '</a></td>';
            clientRows += '</tr>';
        });
        $tableBody.html(clientRows); // Use .html() to replace content
    }
}
