rowCount = 18;
columnCount = 18;
amountOfTiles = rowCount * columnCount;
var mineGridStats = [];
divMineGrid = document.getElementById("divMineGrid");
mineGridContainer = document.getElementById("mineGridContainer");
mineGridRows = document.getElementsByClassName("divRow");
mineGridCells = document.getElementsByClassName("gridTile");

statButtons = document.getElementsByClassName("statButton");
var firstClick = true;
var zeroList = [];
var bombsLeft = Math.floor(rowCount * columnCount * 0.20);
var digitalClock = [0, 0, 0, 0, 0, 0];
var flagsRemaining = bombsLeft;
var clockActive = false;
var flaggingModeEnabled = false;
var originalGridSize = 80;
var originalCellsize = 4;
var cellSize = originalCellsize;
var originalGridFontSize = 3;
var fontSize = originalGridFontSize;
var zoomLevel = 3;
var originalBorderSize = 0.125;
var borderSize = originalBorderSize;
var safeTilesLeftToFind = (rowCount*columnCount) - bombsLeft;
updateFlagsRemaining();
//initializing field BE CAREFUL WITH THE REVERSED INITIALIZING FOR INSERT ROW/CELL(0) * the 400 - accounts for this but still x and y are SWITCHED

/* 

for(y=0;y<rowCount;y++){
    row = mineGridPhysical.insertRow(0);
    for(x=0;x<columnCount;x++){
        cell = row.insertCell(0);
        cell.id = ((amountOfTiles-1) - (x + (y * columnCount)));
        cell.className = "gridTile";
    }
}
    */
for(y=0;y<rowCount;y++){
    var divRow = document.createElement("div");
    divRow.className = "gridRow";
    divMineGrid.appendChild(divRow);
    for(x=0;x<columnCount;x++){
        var divCell = document.createElement("div");
        divCell.className = "gridTile";
        divCell.id = (x + (y * columnCount));
        divRow.appendChild(divCell);
    }
}
document.getElementById("title").innerHTML = "Grave Digger: " + columnCount + "x" + rowCount;

centerGrid();

function zoomChange({button}){
    

    if(button == 0 && zoomLevel < 7){
        zoomLevel++;
        fontSize += 0.75;
        cellSize += 1;
        if(zoomLevel < 4){
            borderSize += 0.035; 
        }
    }
    else if(button == 1 && zoomLevel > 1){
        zoomLevel--;
        fontSize -= 0.75;
        cellSize -=1;
        if(zoomLevel < 3){
            borderSize -= 0.035; 
        }
    }
   
    for(i=0;i<rowCount*columnCount;i++){
        mineGridCells[i].style.fontSize = fontSize.toString() + "vh";
        mineGridCells[i].style.width = cellSize.toString() + "vh";
        mineGridCells[i].style.height = cellSize.toString() + "vh";
        mineGridCells[i].style.borderWidth = borderSize.toString() + "vh";
    }
    if(zoomLevel > 1 && zoomLevel < 7){
        statButtons[2].style.backgroundColor = "rgb(95, 92, 92)";
        statButtons[3].style.backgroundColor = "rgb(95, 92, 92)";
    }
    else if(zoomLevel > 6){
        statButtons[3].style.backgroundColor = "rgb(60, 57, 57)";
    }
    else{
        statButtons[2].style.backgroundColor = "rgb(60, 57, 57)";
    }
    centerGrid();
}

function centerGrid(){
    if(columnCount < 20 * (originalCellsize/cellSize)){
        mineGridContainer.style.alignItems = "center";
    }
    else{
        mineGridContainer.style.alignItems = "flex-start";
    }

    if(rowCount < 20 * (originalCellsize/cellSize)){
        mineGridContainer.style.justifyContent = "center";
    }
    else{
        mineGridContainer.style.justifyContent = "flex-start";
    }
}



//clearing minefield
function clearGrid(){
    for(x=0;x<columnCount;x++){
        for(y=0;y<rowCount;y++){
            mineGridStats[x + (y * columnCount)] = ["O", "hidden", 0];
        }
    }
}


//random chance for bombs spawning 
function spawnBombs({cellToKeepSafe}){
    var timesgenerated = 0;
    while(bombsLeft > 0){
        timesgenerated++;
        x = Math.floor(Math.random() * columnCount);
        y = Math.floor(Math.random() * rowCount);
        if((x + (y * columnCount)) != cellToKeepSafe){
            if(mineGridStats[x + (y * columnCount)][0] != "X"){ //checking is theres not already a bomb in place
                //setting bomb
                bombsLeft--;
                mineGridStats[x + (y * columnCount)] = ["X", "hidden", 0];
                //calculating how many bombs are around each space from each placed bomb
                for(xx=-1;xx<=1;xx++){
                    for(yy=-1;yy<=1;yy++){
                        if(xx != 0 || yy != 0){
                            if((x + xx < columnCount && x + xx > -1) && (y + yy < rowCount && y + yy > -1)){
                                if(mineGridStats[(x + xx) + ((y + yy) * columnCount)] != undefined && (mineGridStats[(x + xx) + ((y + yy) * columnCount)][0]) != "X"){
                                    mineGridStats[(x + xx) + ((y + yy) * columnCount)][2]++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    clockActive = true;
    checkTile({cellToCheck: cellToKeepSafe});
    //ment for checking purposes
    /*
    for(x=0;x<columnCount;x++){
        for(y=0;y<rowCount;y++){
            mineGridCells[x + (y * columnCount)].innerHTML = mineGridStats[x + (y * columnCount)][2];
            if(mineGridStats[x + (y * columnCount)][0] == "X"){
                mineGridCells[x + (y * columnCount)].style.backgroundColor = "red";
            }
        }
    }
    */

}


function generateGrid({firstCell}){
    clearGrid();
    spawnBombs({cellToKeepSafe: firstCell});
}

function checkTile({cellToCheck}){
    zeroList = [];
    console.log("x:" + (Math.floor(cellToCheck/columnCount)) +  "    y: " + cellToCheck % columnCount);
    mineGridStats[cellToCheck][1] = "revealed";
    //in case someone reveals a tile that previously had a flag before clicking on it
    if(mineGridStats[cellToCheck][0] == "X"){ //GAMEOVER or HP -1
        
            if(mineGridCells[cellToCheck].innerHTML != ""){
                flagsRemaining++;
                mineGridCells[cellToCheck].innerHTML = "";
                updateFlagsRemaining();
            }
            mineGridCells[cellToCheck].style.backgroundColor = "red";
            mineGridContainer.style.backgroundColor = "red";
            mineGridCells[cellToCheck].innerHTML = ""; //making sure the flag goes away
            //mineGridCells[cellClickedCoordinates].innerHTML = "<img class='icon' src='./img/bomb.png'>" change when better img
    }
    else{
         //Reveal Clear Tile and if all surrounding tile have no bomb so bomb count > 0, clear all adjacent 8 tiles, chain reaction for other 0's
        safeTilesLeftToFind--;
        clearSafeTile({tileToClear: cellToCheck});
    }
}

//check a tile for if its a bomb or a clear field and apply a graphic change to the tile (left click)
divMineGrid.addEventListener('click', (event) => {{
    if(event.target.classList.contains("gridTile")){
        cellClickedCoordinates = Number(event.target.id);
        if(flaggingModeEnabled){
            flagAction({event:event});
        }
        else{
            if(!firstClick && mineGridStats[cellClickedCoordinates][1] != "revealed"){
                checkTile({cellToCheck: cellClickedCoordinates})
            } 
            else if(firstClick){
                firstClick = false;
                generateGrid({firstCell: cellClickedCoordinates});
            }
        }
        
    }
}})

    //Actual logic behind the chain reaction and unveiling tiles
    function clearSafeTile({tileToClear}){
        if(mineGridCells[tileToClear].innerHTML != "" && mineGridStats[tileToClear][1] != "revealed"){
            flagsRemaining++;
            mineGridCells[tileToClear].innerHTML = "";  
            updateFlagsRemaining();
        }   
        mineGridCells[tileToClear].style.backgroundColor = "rgb(37, 35, 12)";   
        
        if(mineGridStats[tileToClear][2] != 0){
            mineGridCells[tileToClear].innerHTML = mineGridStats[tileToClear][2];
        } 
       
        if(mineGridStats[tileToClear][2] == 0)
        {
            x = tileToClear % columnCount;
            y = Math.floor(tileToClear/columnCount);
            for(xx=-1;xx<=1;xx++){
                for(yy=-1;yy<=1;yy++){
                    if(xx != 0 || yy != 0){
                        if((x + xx < columnCount && x + xx > -1) && (y + yy < rowCount && y + yy > -1)){
                            if(mineGridStats[(x + xx) + ((y + yy) * columnCount)][1] != "revealed"){
                                safeTilesLeftToFind--;
                                if(mineGridCells[(x + xx) + ((y + yy) * columnCount)].innerHTML != "" && mineGridStats[(x + xx) + ((y + yy) * columnCount)][1] != "revealed"){
                                flagsRemaining++;
                                mineGridCells[tileToClear].innerHTML = "";  
                                updateFlagsRemaining();
                            }   
                                if(mineGridStats[(x + xx) + ((y + yy) * columnCount)][2] != 0){
                                    mineGridCells[(x + xx) + ((y + yy) * columnCount)].innerHTML = mineGridStats[(x + xx) + (y + yy) * columnCount][2];
                                }   
                                mineGridCells[(x + xx) + ((y + yy) * columnCount)].style.backgroundColor = "rgb(37, 35, 12)";   
                                mineGridStats[(x + xx) + ((y + yy) * columnCount)][1] = "revealed";
                                
                                if(mineGridStats[(x + xx) + ((y + yy) * columnCount)] != undefined && (mineGridStats[(x + xx) + ((y + yy) * columnCount)][0]) != "X"){
                                    if(mineGridStats[(x + xx) + ((y + yy) * columnCount)][2] == 0){
                                        /*have to do it via this method and have the actual chain reaction later so the recursion doesnt interrupt 
                                        the original call of this function and finishes mapping all 8 squares around the original chosen square*/
                                        zeroList.push((x + xx) + ((y + yy) * columnCount));
                                    }
                                } 
                            }
                        }
                    }
                }
            }
        }
        //emptying out stored 0-tiles till it's empty using recursion
        if(zeroList[0] != null){
            numStorage = zeroList[0];
            zeroList.splice(0, 1);
            clearSafeTile({tileToClear: numStorage});
        }
        updateFlagsRemaining();
    }
//flag a tile and de-flag it
divMineGrid.addEventListener('contextmenu', (event) => {{
    event.preventDefault();
    flagAction({event:event});
}})

function flagAction({event}){
        if(!firstClick){
        if(event.target.classList.contains("gridTile")){
            cellClickedCoordinates = Number(event.target.id);
            if(mineGridStats[cellClickedCoordinates][1] != "revealed"){
                if(mineGridCells[cellClickedCoordinates].innerHTML == "" && flagsRemaining > 0){
                    mineGridCells[cellClickedCoordinates].innerHTML = "<img class='icon' src='./img/flag.png'>";
                    flagsRemaining--;
                }
                else
                {
                    flagsRemaining++;
                    mineGridCells[cellClickedCoordinates].innerHTML = "";
                }
                
            }
        }
        updateFlagsRemaining();
    }
}
    

function updateFlagsRemaining(){
    if(flagsRemaining < 10){
        document.getElementById("bombCount").innerHTML = "Bombs Left: " + "0" + flagsRemaining;
    }
    else{
        document.getElementById("bombCount").innerHTML = "Bombs Left: " + flagsRemaining;
    }

    if(flagsRemaining == 0 && safeTilesLeftToFind == 0){
        mineGridContainer.style.backgroundColor = "green";
    }
}

//timer in charge of updating digital clock
clockInterval = setInterval(function(){
    if(clockActive){
        doNotChangeTimer = false;
        digitalClock[5]++;
        for(i=5;i>=0;i--){
            // % 2 because of the way a clock works, for even and uneven numbers
            if(i % 2 == 0){
                if(digitalClock[i] >= 6){
                    if(i == 0){
                        digitalClock = [0,0,0,0,0,0];
                    }
                    else{
                        digitalClock[i] = 0;
                        digitalClock[i-1]++;
                    }
                }
            }
            else{
                if(digitalClock[i] >= 10){
                    digitalClock[i] = 0;
                    digitalClock[i-1]++;
                }
            }
        }
        document.getElementById("timer").innerHTML = "Time: " + digitalClock[0] + digitalClock[1] + ":" + digitalClock[2] + digitalClock[3] + ":" + digitalClock[4] + digitalClock[5];
    }
}, 1000)

function statButtonClicked({button}){
    if(button == 0){
        flaggingModeEnabled = true;
        statButtons[0].style.backgroundColor = "rgb(60, 57, 57)";
        statButtons[1].style.backgroundColor = " rgb(95, 92, 92)";
    }
    if(button == 1){
        flaggingModeEnabled = false;
        statButtons[1].style.backgroundColor = "rgb(60, 57, 57)";
        statButtons[0].style.backgroundColor = " rgb(95, 92, 92)";
    }

    
}