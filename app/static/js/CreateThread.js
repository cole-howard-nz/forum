function CreateThread()
{
    const CREATE_THREAD_FORM = document.getElementById('create-thread-form');
    const WRAPPER = document.getElementById('');
    const TABLE = document.getElementById('table');

    if (CREATE_THREAD_FORM.style.display == '' || CREATE_THREAD_FORM.style.display === 'none')
    {
        CREATE_THREAD_FORM.style.display = 'block';
        TABLE.style.display = 'none';
    }
    else
    {
        CREATE_THREAD_FORM.style.display = 'none';
        TABLE.style.display = 'block';
    }
}

let isSetupDone_ = false;

function Setup() 
{
    if (isSetupDone_) return; 
    isSetupDone_ = true;

    const THREAD_BUTTON = document.getElementById('comment create-thread');
    THREAD_BUTTON.addEventListener('click', () => { CreateThread() });
}

Setup();