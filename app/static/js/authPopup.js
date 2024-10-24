function CreateButtons()
{
    const BUTTONS = document.querySelectorAll('.authButton');
    BUTTONS.forEach( button => button.addEventListener('click', () => TogglePopup()));
}

function TogglePopup()
{
    const popup = document.getElementById('authPopup');
    const blur = document.getElementById('blur');
    console.log(blur);

    console.log(popup.style.display);
    if (popup.style.display === 'none' || popup.style.display == '')
    {
        popup.style.display = 'flex';
        blur.style.background = 'red';
    }
    else
    {
        popup.style.display = 'none';
        blur.style.filter = 'none';
    }
}

CreateButtons();
document.getElementById('close-popup').addEventListener('click', () => TogglePopup());
