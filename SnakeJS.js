class SnakeJS{
    defaultStates(){
        this.map = [
            ["🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","⬜","🔲"],
            ["🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲","🔲"]
            ]
        
        this.movements = {
            "w":[-1,0],
            "a":[0,-1],
            "s":[1,0],
            "d":[0,1]
        }

        this.playerAlive = true

        this.appleOnMap = false
        this.appleCoords = []

        this.playerCoords = [[7,7]]
        this.playerMovement = "w"
        this.playerLength = 1
        this.playerScore = 1
    }

    random() {
        return Math.floor(Math.random() * 100);
    }

    updatePlayerCoords(movement){
        let firstPlayerCoord = JSON.parse(JSON.stringify(this.playerCoords[0]))

        firstPlayerCoord[0] += movement[0]
        firstPlayerCoord[1] += movement[1]

        if (this.playerCoords.some(playerCoord => JSON.stringify(playerCoord) == JSON.stringify(firstPlayerCoord))){
            this.playerAlive = false
        }

        else if (this.map[firstPlayerCoord[0]][firstPlayerCoord[1]] == "🔲"){
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
        }
    }

    renderGame(){
        let copyMap = JSON.parse(JSON.stringify(this.map))
        let renderMap = ""
        let renderRow = ""

        if (this.appleOnMap){
            copyMap[this.appleCoords[0]][this.appleCoords[1]] = "🍎"
        }

        for (const playerCoord of this.playerCoords){
            copyMap[playerCoord[0]][playerCoord[1]] = "🟥"
        }

        let indexY = 0
        let indexX = 0

        for (const row of copyMap){
            for (let tile of row){
                if (tile != "🟥" && tile != "🔲"){
                    if (this.random() > 98 && this.appleOnMap == false){
                        this.appleCoords = [indexY,indexX]
                        this.appleOnMap = true
                        tile = "🍎"
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

        if (this.playerLength == 169){
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

    gameLoop(){
        this.updatePlayerCoords(this.movements[this.playerMovement])
        this.renderGame()
    }

    startGame(){
        if (this.intervalID == null){
            this.intervalID = setInterval(() =>{
                this.gameLoop()
            },1000)
        }
    }

    endGame(){
        clearInterval(this.intervalID)
        this.intervalID = null
    }

    restartGame(){
        this.endGame()
        this.defaultStates()
        this.renderGame()
    }

    addListener(){
        document.addEventListener("keydown", event => {
            if (["w","a","s","d"].includes(event.key)){
                this.playerMovement = event.key
                this.startGame()
            }

            else if (event.key == "r"){
                this.restartGame()
            }
        })
    }

    main(){
        this.intervalID = null
        this.defaultStates()
        this.renderGame()
        this.addListener()
    }
}

gameInstance = new SnakeJS()
gameInstance.main()