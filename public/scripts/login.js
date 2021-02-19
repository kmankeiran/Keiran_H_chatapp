document.getElementById('join').addEventListener('click', function() {
    const name = document.getElementById('name').value;
    localStorage.setItem('name', name);
});

