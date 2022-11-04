const container = document.querySelector('.container-main')
const btn = document.querySelector('.test-modal');
const modal = document.querySelector('.film-modal');
const modalClose = document.querySelector('.modal-icon-cross');

container.addEventListener('click', (e) => {
    if (e.target.getAttribute('class')?.includes('test-modal')) {
        modal.classList.remove('is-hidden') 
        modalClose.addEventListener('click', e => {
            modal.classList.add('is-hidden');
        })
    }
})




