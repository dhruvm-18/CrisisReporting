let map, marker;

function initMap() {
    map = L.map('map').setView([20.5937, 78.9629], 4); // Center on India by default
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', function(e) {
        const { lat, lng } = e.latlng;
        document.getElementById('lat').value = lat;
        document.getElementById('lng').value = lng;
        if (marker) {
            marker.setLatLng(e.latlng);
        } else {
            marker = L.marker(e.latlng).addTo(map);
        }
        // Reverse geocode
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(res => res.json())
            .then(data => {
                document.getElementById('address').value = data.display_name || '';
            });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initMap();
    // Use My Current Location button
    document.getElementById('useLocationBtn').addEventListener('click', function() {
        if (!navigator.geolocation) {
            showLocationError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            document.getElementById('lat').value = lat;
            document.getElementById('lng').value = lng;
            map.setView([lat, lng], 14);
            if (marker) {
                marker.setLatLng([lat, lng]);
            } else {
                marker = L.marker([lat, lng]).addTo(map);
            }
            // Reverse geocode
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then(res => res.json())
                .then(data => {
                    document.getElementById('address').value = data.display_name || '';
                });
            hideLocationError();
        }, function() {
            showLocationError('Unable to retrieve your location.');
        });
    });
    function showLocationError(msg) {
        const errDiv = document.getElementById('locationError');
        errDiv.textContent = msg;
        errDiv.style.display = 'block';
    }
    function hideLocationError() {
        const errDiv = document.getElementById('locationError');
        errDiv.textContent = '';
        errDiv.style.display = 'none';
    }
    fetch('/reports')
        .then(response => response.json())
        .then(data => {
            const reportsDiv = document.getElementById('reports');
            reportsDiv.innerHTML = '';
            data.forEach(report => {
                const div = document.createElement('div');
                div.className = 'report';
                div.innerHTML = `
                    <strong>Description:</strong> ${report.description}<br>
                    <strong>Location:</strong> ${report.address ? report.address : (report.lat && report.lng ? `Lat: ${report.lat}, Lng: ${report.lng}` : 'N/A')}<br>
                    ${report.image_url ? `<img src="${report.image_url}" alt="Report Image">` : ''}
                `;
                reportsDiv.appendChild(div);
            });
        });
}); 