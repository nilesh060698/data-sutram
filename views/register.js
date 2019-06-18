$(function(){
    $('#register').click(function(e){
        e.preventDefault();
        console.log('select_link clicked');
// var data = {};
// data.title = "title";
// data.message = "message";

$.ajax({
type: 'POST',
    contentType: 'application/json',
            url: 'http://localhost:3000/register',
            data:$("#registerSubmit").serialize()
            success: function(data) {
                console.log('success');
                console.log(JSON.stringify(data));
            }
        });
