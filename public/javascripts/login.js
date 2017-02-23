$('document').ready(function() {
    $('h1').html('Welcome to Disease Database');

    $('#btn').click(function(event) {
        console.log('test click');
        location.href = '/home';
    });
});
