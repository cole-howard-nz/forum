function CreateButtons()
{
    const BUTTONS = document.querySelectorAll('.authButton');
    BUTTONS.forEach( button => button.addEventListener('click', () => TogglePopup()));
}

function TogglePopup()
{
    const popup = document.getElementById('authPopup');
    const blur = document.getElementById('blur');
    const body = document.body;
    console.log(blur);

    console.log(popup.style.display);
    if (popup.style.display === 'none' || popup.style.display == '')
    {
        popup.style.display = 'flex';
        blur.style.filter = 'blur(30px)';
        body.style.pointerEvents = 'none';
        popup.style.pointerEvents = 'all';
    }
    else
    {
        popup.style.display = 'none';
        blur.style.filter = 'none';
        body.style.pointerEvents = 'initial';
        popup.style.pointerEvents = 'initial';
    }
}


document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape')
    {
        let popup = document.getElementById('authPopup');
        if (popup.style.display === 'flex')
            TogglePopup();
    }
})

document.getElementById('close-popup').addEventListener('click', () => TogglePopup());


CreateButtons();