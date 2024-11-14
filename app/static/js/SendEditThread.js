function ToggleEditMode(ID) 
{
    const FORM = document.getElementById(ID + '-edit-comment');
    const TEXT_AREA = FORM.querySelector('textarea');

    if (FORM.style.display == '' || FORM.style.display === 'none')
    {
        FORM.style.display = 'block';
        TEXT_AREA.style.display = 'block';
    }
    else
    {
        FORM.style.display = 'none';
        TEXT_AREA.style.display = 'none';
        TEXT_AREA.textContent = '';
    }
}

let isSetupDone = false;

function Setup() 
{
    if (isSetupDone) return; 
    isSetupDone = true;

    const editButtons = document.querySelectorAll('.edit-comment');
    const cancelButtons = document.querySelectorAll('.edit-cancel');

    editButtons.forEach(button => {
        const ID = button.getAttribute('data-id');
        button.addEventListener('click', () => ToggleEditMode(ID));
    });

    cancelButtons.forEach(button => {
        const ID = button.getAttribute('data-id');
        button.addEventListener('click', () => ToggleEditMode(ID));
    });
}

Setup();
