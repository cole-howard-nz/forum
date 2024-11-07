function InterfaceToggle()
{
    const SETTING_INTERFACE = document.getElementById('toggleSettingInterface');
    const HEADER = SETTING_INTERFACE.closest(".header.settings");
    const OPTION_CONTAINER = HEADER.nextElementSibling;

    console.log(OPTION_CONTAINER);

    if (OPTION_CONTAINER.style.visibility === 'hidden')
    {
        OPTION_CONTAINER.style.opacity = '1';
        OPTION_CONTAINER.style.visibility = 'visible';
        OPTION_CONTAINER.style.display = 'block';
    }
    else
    {
        OPTION_CONTAINER.style.opacity = '0';
        OPTION_CONTAINER.style.visibility = 'hidden';

        setTimeout(() => {
            OPTION_CONTAINER.style.display = 'none';
        }, 330);
    }
}

function Setup()
{
    const INTERFACE_TOGGLES = document.querySelectorAll('#toggleSettingInterface');
    console.log(INTERFACE_TOGGLES);

    INTERFACE_TOGGLES.forEach(element => {
        element.addEventListener('click', () =>
        {
            InterfaceToggle()
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    Setup();
});