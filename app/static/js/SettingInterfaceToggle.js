function InterfaceToggle(SETTING_INTERFACE)
{
    const HEADER = SETTING_INTERFACE.closest(".header.settings");
    const OPTION_CONTAINER = HEADER.nextElementSibling;

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
        }, 150);
    }
}

function Setup()
{
    const INTERFACE_TOGGLES = document.getElementsByClassName('toggleSettingInterface');

    // Convert the HTMLCollection returned from getElementsByClassName to an array,
    // this allows us to use forEach and iterate through our collection.
    [...INTERFACE_TOGGLES].forEach(element => {
        element.addEventListener('click', () => InterfaceToggle(element));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    Setup();
});