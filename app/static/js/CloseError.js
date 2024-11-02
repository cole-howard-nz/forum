function CloseError(CLASSES)
{
    // Grab actual class name
    const CLASS = CLASSES[0]

    const ERROR_POPUP = document.getElementById(CLASS + '-error-popup');
    ERROR_POPUP.style.display = 'none';
}

function Setup()
{
    const CLOSE = document.getElementById('close-error-popup');

    if (CLOSE)
    {
        CLOSE.addEventListener('click', () => 
        {
            const CLASSES = CLOSE.classList;
            CloseError(CLASSES);
        });
    }
}

Setup();