function Setup()
{
    const COMMENT_BUTTON = document.getElementById('comment');
    const COMMENT_UI = document.getElementById('thread-comment-ui');

    COMMENT_BUTTON.addEventListener('click', () => {
        COMMENT_UI.classList.add('header-last');
    });

    COMMENT_UI.addEventListener('click', () => {
        COMMENT_UI.classList.remove('header-last');
    })
}

document.addEventListener("DOMContentLoaded", () => {
    Setup();
});