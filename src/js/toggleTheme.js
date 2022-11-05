const toggleTheme = document.querySelector('.toggle-theme');

const footer = document.querySelector(".footer_box");
const modal_bgr = document.querySelector(".film-modal-content");

const LS_Key = 'theme';
DarkOrWhiteTheme();

toggleTheme.addEventListener('click', onChangeTheme);

function onChangeTheme() {
    document.body.classList.toggle("dark-theme");
    const message = JSON.stringify(document.body.classList.contains("dark-theme"));
    localStorage.setItem(LS_Key, message ); 
    DarkOrWhiteTheme();
}

function DarkOrWhiteTheme() {
    const Dark = JSON.parse(localStorage.getItem(LS_Key));
    if(Dark){
        footer.style.backgroundColor = "rgb(182, 165, 165)";
        document.body.classList.add("dark-theme");
        modal_bgr.classList.add('dark');
        toggleTheme.style.color = "#ffffff";

        return;
    }
        document.body.classList.remove("dark-theme");
        footer.style.backgroundColor = "#ffffff";
        modal_bgr.classList.remove('dark');
        toggleTheme.style.color = "#000000";   
}

