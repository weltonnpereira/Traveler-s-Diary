const diary = document.querySelector('.diary')
const cover = document.querySelector('.cover')
const against_cover = document.querySelector('.against-cover')

if (!sessionStorage.getItem('keep-open')) {
    diary.addEventListener('click', (e) => {
        diary.classList.add('remove-rotate')

        opened = true;
        cover.classList.add('flip')
        cover.classList.add('transition-all')
        sessionStorage.setItem('keep-open', 'true')
    })
} else {
    diary.classList.add('remove-rotate')
    diary.classList.add('remove-transition')
    cover.classList.add('flip')
    cover.classList.add('remove-transition')
}