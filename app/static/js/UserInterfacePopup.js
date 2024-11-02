let translate;

function ToggleInterface()
{
    const POPUP = document.getElementById('uiPopup');

    if (POPUP.style.opacity === '0' || POPUP.style.opacity == '')
        POPUP.style.opacity = '1';
    else
        POPUP.style.opacity = '0';
}

function MoveIcon() 
{
    const ICON = document.getElementById('userButton');

    if (!translate)
    {
        ICON.style.transform = 'translateX(-250%)';
        translate = 1;
    }
    else
    {
        ICON.style.transform = 'translateX(0)';
        translate = 0;
    }    
}

function Setup() 
{
    const POPUP = document.getElementById('uiPopup');
    const ICON = document.getElementById('userButton');
    const USER_BUTTON = document.getElementById('userButton');

    ICON.addEventListener('click', (event) => 
    {
        MoveIcon();

        setTimeout(() => {
            ToggleInterface();
        }, 200);

        // Prevent the global document eventListener from being processed,
        // without this we cannot click on the user icon within the popup.
        event.stopPropagation();
    });
    
    document.addEventListener('click', (event) => 
    {
        // Click is not inside POPUP or USER_BUTTON, and the popup is up
        if (!POPUP.contains(event.target) && translate === 1)
        {
            MoveIcon();
            ToggleInterface();
        }
    });
}

document.addEventListener('DOMContentLoaded', Setup);