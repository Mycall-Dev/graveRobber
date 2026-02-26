rowCount = 18;
columnCount = 18;
setSliders = document.getElementsByClassName("setSlider");
setSliders[0].addEventListener("change", (function(){
        updateGridLayout();
}));
setSliders[1].addEventListener("change", (function(){
        updateGridLayout();
}));

function updateGridLayout(){
    rowCount = setSliders[0].value;
    columnCount = setSliders[1].value;
    document.getElementsByClassName("sliderText")[0].innerHTML = "rows: " + rowCount;
    document.getElementsByClassName("sliderText")[1].innerHTML = "columns: " + columnCount;
}

function startGame(){
    localStorage.setItem("rowCount", rowCount);
    localStorage.setItem("columnCount", columnCount);
    console.log("started");
}

document.getElementsByClassName("menuButton")[0].addEventListener("click" , function(){
    startGame();
});

       
