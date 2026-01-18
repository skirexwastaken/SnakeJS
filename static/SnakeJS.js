class SnakeJS{
    // --- Default variables ---
    constructor(){
        this.intervalID = null

        this.mapSize = [15,21]
        this.mapTextures = ["🔲","⬜","🍎"] // Wall - Regular Tile - Food

        this.playerLengthMaximum = (this.mapSize[0] - 2) * (this.mapSize[1] - 2)
        this.playerIcon = "🟥"

        this.movements = {
            "w":[-1,0],
            "a":[0,-1],
            "s":[1,0],
            "d":[0,1],
            "ArrowUp":[-1,0],
            "ArrowLeft":[0,-1],
            "ArrowDown":[1,0],
            "ArrowRight":[0,1]
        }

        this.defaultStates()
        this.renderGame()
        this.addListener()
    }

    // --- Sets per game variables to their default values ---
    defaultStates(){
        this.generateMap()

        this.playerAlive = true

        this.appleOnMap = false
        this.appleCoords = []

        /*
            this.playerCoords saves all of the locations of where a part of the player's body is, 
            upon each game cycle, a new coord is added and the length is compared with the player length,
        
        */

        this.playerCoords = [[Math.floor(this.mapSize[0] / 2), Math.floor(this.mapSize[1] / 2)]]
        this.playerMovement = ""
        this.playerSpeed = 1
        this.playerLength = 1
        this.playerScore = 1
    }

    // --- Renders a new map based on size ---
    generateMap(){

        this.map = []
        let mapRow = []

        for (let axisY = 0; axisY < this.mapSize[0]; axisY++){
            for (let axisX = 0; axisX < this.mapSize[1]; axisX++){
                if (axisY == 0 || axisY == this.mapSize[0] - 1){
                    mapRow.push(this.mapTextures[0])
                }

                else{
                    if (axisX == 0 || axisX == this.mapSize[1] - 1){
                        mapRow.push(this.mapTextures[0])
                    }

                    else{
                        mapRow.push(this.mapTextures[1])
                    }
                }
            }

            this.map.push(mapRow)  
            mapRow = []
        }
    }

    // --- Updates player speed based on their length ---
    updateSpeed(){
        if (this.playerScore % 10 == 0){
            this.playerSpeed += 0.25
            this.endGame()
            this.startGame()
        }   
    }

    // --- Function which returns a random number between 0 - 100 ---
    random() {
        return Math.floor(Math.random() * 100);
    }

    // --- Updates player coords: Adds the location of where a player is moving and removes the last one ---
    updatePlayerCoords(movement){
        let firstPlayerCoord = JSON.parse(JSON.stringify(this.playerCoords[0]))

        firstPlayerCoord[0] += movement[0]
        firstPlayerCoord[1] += movement[1]

        if (this.playerCoords.some(playerCoord => JSON.stringify(playerCoord) == JSON.stringify(firstPlayerCoord))){
            this.playerAlive = false
        }

        else if (this.map[firstPlayerCoord[0]][firstPlayerCoord[1]] == this.mapTextures[0]){
            this.playerAlive = false
        }

        else{
            this.playerCoords.unshift(firstPlayerCoord)

            if (this.playerCoords.length > this.playerLength){
                this.playerCoords.pop()
            }
        }

        if (firstPlayerCoord[0] == this.appleCoords[0] && firstPlayerCoord[1] == this.appleCoords[1]){
            this.appleCoords = []
            this.appleOnMap = false
            this.playerLength += 1
            this.playerScore += 1

            this.updateSpeed()
        }
    }  

    // --- Renders GUI ---
    renderGame(){
        let copyMap = JSON.parse(JSON.stringify(this.map))
        let renderMap = ""
        let renderRow = ""

        if (this.appleOnMap){
            copyMap[this.appleCoords[0]][this.appleCoords[1]] = this.mapTextures[2]
        }

        for (const playerCoord of this.playerCoords){
            copyMap[playerCoord[0]][playerCoord[1]] = this.playerIcon
        }

        let indexY = 0
        let indexX = 0

        for (const row of copyMap){
            for (let tile of row){
                if (tile != this.playerIcon && tile != this.mapTextures[0]){
                    if (this.random() > 98 && this.appleOnMap == false){
                        this.appleCoords = [indexY,indexX]
                        this.appleOnMap = true
                        tile = this.mapTextures[2]
                    }
                }

                renderRow += tile
                indexX += 1
            }

            indexX = 0
            indexY += 1

            renderMap += renderRow + "<br />"
            renderRow = ""
        }

        if (this.playerLength == this.playerLengthMaximum){
            document.getElementById("map").innerHTML = renderMap
            document.getElementById("topBar").innerHTML = "You won! Final score: "+this.playerScore

            this.endGame()
        }

        else if (this.playerAlive){
            document.getElementById("map").innerHTML = renderMap
            document.getElementById("topBar").innerHTML = "Score: "+this.playerScore
        }
        else{
            document.getElementById("map").innerHTML = renderMap
            document.getElementById("topBar").innerHTML = "You lost! Final score: "+this.playerScore

            this.endGame()
        }
    }

    // --- Main game loop: Combination of updatePlayerCoords, updateSpeed and rendeGame---
    gameLoop(){
        this.updatePlayerCoords(this.movements[this.playerMovement])
        this.renderGame()
    }

    // --- Function that starts the game ---
    startGame(){
        this.intervalID = setInterval(() =>{
            this.gameLoop()
        },500 / this.playerSpeed)
    }

    // --- Function that ends the game ---
    endGame(){
        clearInterval(this.intervalID)
    }

    // --- Function that restarts the game values ---
    restartGame(){
        this.endGame()
        this.defaultStates()
        this.renderGame()
        this.intervalID = null
    }

    // --- Listener that manages user controls ---
    addListener(){
        document.addEventListener("keydown", event => {
            if (["w","a","s","d"].includes(event.key)){
                this.playerMovement = event.key
                if (this.intervalID == null){
                    this.startGame()
                }
            }

            else if (["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"].includes(event.key)){
                this.playerMovement = event.key
                if (this.intervalID == null){
                    this.startGame()
                }
            }

            else if (event.key == "r"){
                this.restartGame()
            }
        })
    }
}

// --- Creating an instance of SnakeJS---
gameInstance = new SnakeJS()
