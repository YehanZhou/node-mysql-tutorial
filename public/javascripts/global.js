/**
 * Created by yehanzhou on 16/10/18.
 */
    // Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);
    $('#btnModUser').on('click', updateUser);
    $('.mask').on('click', hideMod);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    $('#userList table tbody').on('click', 'td a.linkupdateuser', showMod);

});

// Functions =============================================================

// Fill table with data
function populateTable() {
    var tableContent = '';
    $.getJSON( '/users/userlist', function( data ) {
        // Stick our user data array into a userlist variable in the global object
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.UserName + '" title="Show Details">' + this.UserName + '</a></td>';
            tableContent += '<td>' + this.UserPass + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.Id + '">delete</a></td>';
            tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this.Id + '">edit</a></td>';
            tableContent += '</tr>';
        });
        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.UserName; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#UserName').text(thisUserObject.UserName);
    $('#UserPass').text(thisUserObject.UserPass);
    // $('#userInfoGender').text(thisUserObject.gender);
    // $('#userInfoLocation').text(thisUserObject.location);

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
        // If it is, compile all user info into one object
        var newUser = {
            'UserName': $('#addUser fieldset input#inputUserName').val(),
            'UserPass': $('#addUser fieldset input#inputUserPass').val()
        };
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            url: '/users/adduser',
            data: newUser,
            dataType: 'JSON'
        }).done(function( response ) {
            // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#addUser fieldset input').val('');
                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {
    event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            // Update the table
            populateTable();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};

function showMod (event) {
    event.preventDefault();
    $('#upUser fieldset input#modId').val($(this).attr('rel'));
    $('#upUser fieldset input#modUserName').val('');
    $('#upUser fieldset input#modUserPass').val('');
    $('.mask').show();
    $('.alert').show();
}
function hideMod () {
    $('.mask').hide();
    $('.alert').hide();
}
function updateUser(event) {

    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#upUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure the user confirmed
    if(errorCount === 0) {
        var upUser = {
            'UserName': $('#upUser fieldset input#modUserName').val(),
            'UserPass': $('#upUser fieldset input#modUserPass').val()
        };
        $.ajax({
            type: 'PUT',
            url: '/users/updateuser/' + $('#upUser fieldset input#modId').val(),
            data: upUser,
            dataType: 'JSON'
        }).done(function( response ) {
            // Check for a successful (blank) response
            if (response.msg === '') {
                $('.mask').hide();
                $('.alert').hide();
                populateTable();
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};
