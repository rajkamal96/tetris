document.addEventListener('DOMContentLoaded',() => {

    const GRID_WIDTH = 10
    const GRID_HEIGHT = 20
    const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT

    const grid = createGrid(); //create grid method
    let squares =   Array.from(grid.querySelectorAll('div'))
    const scoreDisplay = document.querySelector('.score-display')
    const linesDisplay = document.querySelector('.lines-score')
    const startBtn = document.querySelector('.button')
    const hamburgerBtn = document.querySelector('.toggler')
    const menu = document.querySelector('.menu')
    const span = document.getElementsByClassName('close')[0]
    
    let currentIndex = 0
    let currentRotation = 0
    const width = 10
    let score = 0
    let lines = 0
    let nextRandom = 0
    let timerId

    const colors = [
        'url(images/blue_block.png)',
        'url(images/pink_block.png)',
        'url(images/purple_block.png)',
        'url(images/peach_block.png)',
        'url(images/yellow_block.png)' 
    ]

    //create grid
    function createGrid() {
        let grid = document.querySelector(".grid")
        for( let i=0; i<GRID_SIZE; i++) {
            let gridElement = document.createElement("div")
            grid.appendChild(gridElement)
        }

        //set base of grid
        for(let i=0; i<GRID_WIDTH; i++) {
            let gridElement = document.createElement("div")
            gridElement.setAttribute("class", "block3")
            grid.appendChild(gridElement)
        }

        let miniGrid = document.querySelector(".mini-grid")
        //since 16 is th max grid size in which all the tetrominoes can fit in
        for(let i=0; i<16; i++) {
            let gridElement = document.createElement("div")
            miniGrid.appendChild(gridElement);
        }
        return grid;
    }

    //assign functions to keycodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }

    //to speed up the tetromino
    document.addEventListener('keydown', control)

    //The tetrominos
    const lTetromino = [
        [1, GRID_WIDTH+1, GRID_WIDTH*2+1, 2],
        [GRID_WIDTH, GRID_WIDTH+1, GRID_WIDTH+2, GRID_WIDTH*2+2],
        [1, GRID_WIDTH+1, GRID_WIDTH*2+1, GRID_WIDTH*2],
        [GRID_WIDTH, GRID_WIDTH*2, GRID_WIDTH*2+1, GRID_WIDTH*2+2]
    ]
    const zTetromino = [
        [0,GRID_WIDTH,GRID_WIDTH+1,GRID_WIDTH*2+1],
        [GRID_WIDTH+1,GRID_WIDTH+2,GRID_WIDTH*2,GRID_WIDTH*2+1],
        [0,GRID_WIDTH,GRID_WIDTH+1,GRID_WIDTH*2+1],
        [GRID_WIDTH+1,GRID_WIDTH+2,GRID_WIDTH*2,GRID_WIDTH*2+1]
    ]
    const tTetromino = [
        [1,GRID_WIDTH,GRID_WIDTH+1,GRID_WIDTH+2],
        [1,GRID_WIDTH+1,GRID_WIDTH+2,GRID_WIDTH*2+1],
        [GRID_WIDTH,GRID_WIDTH+1,GRID_WIDTH+2,GRID_WIDTH*2+1],
        [1,GRID_WIDTH,GRID_WIDTH+1,GRID_WIDTH*2+1]
    ]
    const oTetromino = [
        [0,1,GRID_WIDTH,GRID_WIDTH+1],
        [0,1,GRID_WIDTH,GRID_WIDTH+1],
        [0,1,GRID_WIDTH,GRID_WIDTH+1],
        [0,1,GRID_WIDTH,GRID_WIDTH+1]
    ]
    const iTetromino = [
        [1,GRID_WIDTH+1,GRID_WIDTH*2+1,GRID_WIDTH*3+1],
        [GRID_WIDTH,GRID_WIDTH+1,GRID_WIDTH+2,GRID_WIDTH+3],
        [1,GRID_WIDTH+1,GRID_WIDTH*2+1,GRID_WIDTH*3+1],
        [GRID_WIDTH,GRID_WIDTH+1,GRID_WIDTH+2,GRID_WIDTH+3]
    ]

    const theTetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino] 


    //randomly select a tetramino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes [random][currentRotation]

    let currentPosition = 4
    //draw the tetramino
    function draw () {
        current.forEach( index => {
            squares[currentPosition + index].classList.add('block')
            squares[currentPosition + index].style.backgroundImage = colors[random]
        })
    }
    
    //undraw the tetramino
    function undraw () {
        current.forEach( index => {
            squares[currentPosition + index].classList.remove('block')
            squares[currentPosition + index].style.backgroundImage = 'none'
        })
    }

    //make the tetramino move down every sec
    //timerId = setInterval(moveDown, 1000)

    //move down function
    function moveDown() {
        undraw()
        currentPosition = currentPosition += width
        draw()
        freeze()
    }

    //add functionality to the button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    //move tetromino to left unless it at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition += 1
        }
        draw()
    }
    
    //move tetromino to right unless it at the edge or there is a blockage
    function moveRight() {
        undraw() 
        const isAtRightEdge = current.some( index => (currentPosition + index) % width === width - 1)

        if(!isAtRightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition -=1
        }
        draw()
    } 

    //freeze function
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('block3') || squares[currentPosition + index + width].classList.contains('block2'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('block2'))
            //start a new tetromino
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }
    freeze()

    //rotate the tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //gameover
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }

    //show up-next tetromino in mini grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    //the tetrominos wihtout rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0,1, displayWidth, displayWidth+1],
        [1, displayWidth+1,displayWidth*2+1, displayWidth*3+1]
    ]

    //display the shape in the mini-grid display
    function displayShape() {
        //remove any trace of tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('block')
            square.style.backgroundImage = 'none'
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('block')
            displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
        })
    }

    //add score
    function addScore() {
        for( let i=0; i<GRID_SIZE; i+=GRID_WIDTH) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('block2'))) {
                score += 10
                lines += 1
                scoreDisplay.innerHTML = score
                linesDisplay.innerHTML = lines
                row.forEach(index => {
                    squares[index].classList.remove('block2')
                    squares[index].classList.remove('block')
                    squares[index].style.backgroundImage = 'none'
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
                
            }
        }
    }

    //styling eventListeners
    hamburgerBtn.addEventListener('click', () => {
        menu.style.display = 'flex'
    })
    span.addEventListener('click', () => {
        menu.style.display = 'none'
    })
})