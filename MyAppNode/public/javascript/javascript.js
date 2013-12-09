
function changeAction()
{
form=document.getElementById('myForm');
    form.action='/movies';
    form.submit();
    form.action='/actor';
}
