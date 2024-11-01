function CloseError(CLASS)
{
    // Grab actual class name
    CLASS = CLASS[0]

    const ERROR_POPUP = document.getElementById(CLASS + '-error-popup');
    ERROR_POPUP.style.display = 'none';
}

function Setup()
{
    const CLOSE = document.getElementById('close-error-popup');
    CLOSE.addEventListener('click', () => 
    {
        const ID = CLOSE.classList;
        CloseError(ID);
    });
}

Setup();