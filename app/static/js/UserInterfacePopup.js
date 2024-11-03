let translate;

function ToggleInterface()
{
    const POPUP = document.getElementById('uiPopup');

    if (POPUP.style.visibility === 'hidden' || POPUP.style.visibility == '')
    {
        POPUP.style.opacity = '1';
        POPUP.style.visibility = 'visible';
    }
    else
    {
        POPUP.style.opacity = '0';
        POPUP.style.visibility = 'hidden';
    }
}

function IconAnimation() 
{
    const ICON = document.getElementById('userButton');
    const NAME = document.getElementById('userName');

    if (!translate)
    {
        ICON.style.transform = 'translateX(-190%)';
        translate = 1;

        setTimeout(() => {
            NAME.style.display = 'none';
        }, 140);
    }
    else
    {
        ICON.style.transform = 'translateX(0)';
        translate = 0;

        setTimeout(() => {
            NAME.style.display = 'block';
        }, 200);
    }    
}

function Setup() 
{
    const POPUP = document.getElementById('uiPopup');
    const ICON = document.getElementById('userButton');

    ICON.addEventListener('click', (event) => 
    {
        IconAnimation();

        setTimeout(() => {
            ToggleInterface();
        }, 200);

        // Prevent the global document eventListener from being processed,
        // without this we cannot click on the user icon within the popup.
        event.stopPropagation();
    });
    
    document.addEventListener('click', (event) => 
    {
        // Click is not inside POPUP, and the popup is up
        if (!POPUP.contains(event.target) && translate === 1)
        {
            IconAnimation();
            ToggleInterface();
        }
    });
}

document.addEventListener('DOMContentLoaded', Setup);