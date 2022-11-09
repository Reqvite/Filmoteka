import { refs } from "./refs/refs";

const LS_Key = 'theme';
DarkOrWhiteTheme();

refs.toggleTheme.addEventListener('click', onChangeTheme);

function onChangeTheme() {
    document.body.classList.toggle("dark-theme");
    const message = JSON.stringify(document.body.classList.contains("dark-theme"));
    localStorage.setItem(LS_Key, message ); 
    DarkOrWhiteTheme();
}

function DarkOrWhiteTheme() {
    const Dark = JSON.parse(localStorage.getItem(LS_Key));
    if(Dark){
        refs.footer.style.backgroundColor = "rgb(182, 165, 165)";
        document.body.classList.add("dark-theme");
        refs.modal_bgr.classList.add('dark');
        refs.toggleTheme.style.backgroundColor = "#000";
        refs.iconSun.classList.add('is-hiden'); 
        refs.iconBrightness.classList.remove('is-hiden');
        refs.modalFooter.classList.add('dark');
        return;
    }
        document.body.classList.remove("dark-theme");
        refs.footer.style.backgroundColor = "#ffffff";
        refs.modal_bgr.classList.remove('dark');
        refs.toggleTheme.style.backgroundColor = "#fff";
        refs.iconBrightness.classList.add('is-hiden');
        refs.iconSun.classList.remove('is-hiden') ;
        refs.modalFooter.classList.remove('dark');

}

