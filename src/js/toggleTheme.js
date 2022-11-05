const toggleTheme = document.querySelector('.toggle-theme');
 const footer = document.querySelector(".footer_box")
//  const footerText = document.querySelector(".footer_text")
console.log("footer",footer);
toggleTheme.addEventListener('click', onChangeTheme);

function onChangeTheme() {
    document.body.classList.toggle("dark-theme");
    if(document.body.classList.contains("dark-theme")){
toggleTheme.style.color = "black";
footer.style.backgroundColor = "rgb(182, 165, 165)";
return
    }
    footer.style.backgroundColor = "#ffffff";
    toggleTheme.style.color = "#ffffff";
}