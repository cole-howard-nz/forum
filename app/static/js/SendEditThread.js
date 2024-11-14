function ToggleEditMode(ID)
{
    const SELECTED_CONTENT = document.getElementById(ID + '-content');
    const TEXTAREA_ELEMENT = document.getElementById(ID + '-textarea-edit');
    const CONFIRM_BUTTON = document.getElementById(ID + '-confirm-edit');
    const CANCEL_BUTTON = document.getElementById(ID + '-cancel-edit');
    
    if (SELECTED_CONTENT.style.display === 'block')
    {
        SELECTED_CONTENT.style.display = 'none';
        TEXTAREA_ELEMENT.style.display = 'block';
        CONFIRM_BUTTON.style.display = 'block';
        CANCEL_BUTTON.style.display = 'block';
    }
    else
    {
        SELECTED_CONTENT.style.display = 'block';
        TEXTAREA_ELEMENT.style.display = 'none';
        CONFIRM_BUTTON.style.display = 'none';
        CANCEL_BUTTON.style.display = 'none';
    }
}

let isSetupDone = false;

function Setup() 
{
    // Screw this stupid javascript bullshit, logging outside of Setup run once but Setup is called twice somehow
    if (isSetupDone) return; 
    isSetupDone = true;

    const EDIT_BUTTON = document.querySelectorAll('.edit-comment');
    console.log(EDIT_BUTTON);
    
    EDIT_BUTTON.forEach(button => {
        button.addEventListener('click', () => ToggleEditMode(button.classList[1]));
    });
}

console.log('test');
Setup();
